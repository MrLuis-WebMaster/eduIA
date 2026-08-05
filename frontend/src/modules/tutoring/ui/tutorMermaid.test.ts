import { describe, expect, it } from 'vitest';

import {
  flattenMermaidSvg,
  isMermaidCodeBlock,
  parseSvgViewBox,
  renderTutorMermaid,
  type TutorMermaidPalette,
} from './tutorMermaid';

const palette: TutorMermaidPalette = {
  bg: '#FFFFFF',
  fg: '#0F172A',
  line: '#94A3B8',
  accent: '#0D9488',
  muted: '#64748B',
  surface: '#F1F5F9',
  border: '#E2E8F0',
};

describe('isMermaidCodeBlock', () => {
  it('matches the mermaid language tag', () => {
    expect(isMermaidCodeBlock('mermaid', 'not a diagram')).toBe(true);
    expect(isMermaidCodeBlock('Mermaid', 'x')).toBe(true);
  });

  it('auto-detects common diagram headers without a language tag', () => {
    expect(isMermaidCodeBlock(undefined, 'flowchart TD\n  A --> B')).toBe(true);
    expect(isMermaidCodeBlock('', 'sequenceDiagram\n  A->>B: hi')).toBe(true);
    expect(isMermaidCodeBlock('js', 'const x = 1')).toBe(false);
  });
});

describe('flattenMermaidSvg', () => {
  it('inlines theme colors and strips CSS variable style blocks', () => {
    const input = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" style="--bg:#fff;--fg:#000">
<style>text { fill: var(--fg); }</style>
<rect fill="var(--_node-fill)" stroke="var(--_node-stroke)" />
<text fill="var(--_text)">A</text>
</svg>`;

    const out = flattenMermaidSvg(input, palette);

    expect(out).not.toContain('<style');
    expect(out).not.toContain('var(');
    expect(out).toContain(`fill="${palette.surface}"`);
    expect(out).toContain(`stroke="${palette.border}"`);
    expect(out).toContain(`fill="${palette.fg}"`);
  });
});

describe('parseSvgViewBox', () => {
  it('reads width and height from viewBox', () => {
    expect(parseSvgViewBox('<svg viewBox="0 0 120.5 80"></svg>')).toEqual({
      width: 120.5,
      height: 80,
    });
  });
});

describe('renderTutorMermaid', () => {
  it('renders a simple flowchart to concrete SVG paints', () => {
    const result = renderTutorMermaid(
      'flowchart TD\n  A[Inicio] --> B[Fin]',
      palette,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.width).toBeGreaterThan(0);
    expect(result.height).toBeGreaterThan(0);
    expect(result.svg).toContain('<svg');
    expect(result.svg).not.toContain('var(');
    expect(result.svg).toContain(palette.accent);
  });

  it('returns an error for empty source', () => {
    expect(renderTutorMermaid('   ', palette)).toEqual({
      ok: false,
      error: 'Diagrama vacío',
    });
  });
});
