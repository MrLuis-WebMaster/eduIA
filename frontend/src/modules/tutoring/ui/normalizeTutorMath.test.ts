import { describe, expect, it } from 'vitest';
import { marked } from 'marked';

import {
  DISPLAY_MATH_PREFIX,
  INLINE_MATH_PREFIX,
  encodeMathAsCodespans,
  normalizeTutorMath,
  parseMathMarker,
  prepareTutorMarkdown,
} from './normalizeTutorMath';

describe('normalizeTutorMath', () => {
  it('wraps parenthesized LaTeX fractions from tutor replies', () => {
    const input =
      'Fracción original: ( \\frac{3}{5} )\n' +
      'Explicación: ( \\frac{2 \\times 3}{2 \\times 5} = \\frac{6}{10} )';

    expect(normalizeTutorMath(input)).toBe(
      'Fracción original: $\\frac{3}{5}$\n' +
        'Explicación: $\\frac{2 \\times 3}{2 \\times 5} = \\frac{6}{10}$',
    );
  });

  it('wraps bare \\frac outside delimiters', () => {
    expect(normalizeTutorMath('Simplifica \\frac{4}{8} a \\frac{1}{2}.')).toBe(
      'Simplifica $\\frac{4}{8}$ a $\\frac{1}{2}$.',
    );
  });

  it('canonicalizes \\( \\) and \\[ \\] delimiters', () => {
    expect(normalizeTutorMath('Inline \\(a+b\\) and block \\[x^2\\].')).toBe(
      'Inline $a+b$ and block $$x^2$$.',
    );
  });

  it('leaves already-delimited math untouched', () => {
    const input = 'Already fine: $\\frac{1}{2}$ and $$E=mc^2$$.';
    expect(normalizeTutorMath(input)).toBe(input);
  });

  it('does not wrap ordinary parentheses', () => {
    expect(normalizeTutorMath('Lee el paso (ver arriba) otra vez.')).toBe(
      'Lee el paso (ver arriba) otra vez.',
    );
  });
});

describe('encodeMathAsCodespans', () => {
  it('rewrites dollar math into marked-compatible codespans', () => {
    expect(encodeMathAsCodespans('Ver $\\frac{1}{3}$ y $$x^2$$.')).toBe(
      `Ver \`${INLINE_MATH_PREFIX}\\frac{1}{3}\` y \`${DISPLAY_MATH_PREFIX}x^2\`.`,
    );
  });

  it('leaves $ inside fenced code blocks alone', () => {
    const input = [
      'Antes $\\frac{1}{2}$',
      '```mermaid',
      'flowchart LR',
      '  A["costo $5"] --> B',
      '```',
      'Después $\\frac{3}{4}$',
    ].join('\n');

    expect(encodeMathAsCodespans(input)).toBe(
      [
        `Antes \`${INLINE_MATH_PREFIX}\\frac{1}{2}\``,
        '```mermaid',
        'flowchart LR',
        '  A["costo $5"] --> B',
        '```',
        `Después \`${INLINE_MATH_PREFIX}\\frac{3}{4}\``,
      ].join('\n'),
    );
  });
});

describe('prepareTutorMarkdown', () => {
  it('produces codespan tokens marked can lex (unlike raw $...$)', () => {
    const prepared = prepareTutorMarkdown(
      'Fracción original: $\\frac{1}{3}$ y ( \\frac{2}{6} )',
    );
    const tokens = marked.lexer(prepared, { gfm: true });
    const codespans = collectCodespans(tokens);

    expect(codespans).toEqual([
      `${INLINE_MATH_PREFIX}\\frac{1}{3}`,
      `${INLINE_MATH_PREFIX}\\frac{2}{6}`,
    ]);
    expect(parseMathMarker(codespans[0]!)).toEqual({
      tex: '\\frac{1}{3}',
      display: false,
    });
  });
});

function collectCodespans(tokens: ReturnType<typeof marked.lexer>): string[] {
  const out: string[] = [];

  const walk = (list: typeof tokens | undefined) => {
    if (!list) return;
    for (const token of list) {
      if (token.type === 'codespan' && 'text' in token) {
        out.push(String(token.text));
      }
      if ('tokens' in token && Array.isArray(token.tokens)) {
        walk(token.tokens as typeof tokens);
      }
      if ('items' in token && Array.isArray(token.items)) {
        for (const item of token.items) {
          if (item && typeof item === 'object' && 'tokens' in item) {
            walk(item.tokens as typeof tokens);
          }
        }
      }
    }
  };

  walk(tokens);
  return out;
}
