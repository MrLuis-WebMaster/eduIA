/**
 * Turns tutor LaTeX into markdown codespans that react-native-marked already
 * understands. Marked v15+ never calls a custom `codespan()` tokenizer for `$`,
 * so `$...$` must be rewritten to `` `«marker»tex` `` before lexing.
 */

/** Private-use markers stamped into codespans so the renderer can tell TeX from code. */
export const INLINE_MATH_PREFIX = '\uE000tex:';
export const DISPLAY_MATH_PREFIX = '\uE000dtex:';

const DELIMITED_MATH =
  /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)/g;

/**
 * Prepares tutor Markdown so inline/block math renders via the codespan path.
 */
export function prepareTutorMarkdown(content: string): string {
  return encodeMathAsCodespans(normalizeTutorMath(content));
}

export function normalizeTutorMath(content: string): string {
  if (!content || !content.includes('\\')) {
    return content;
  }

  const parts: string[] = [];
  let lastIndex = 0;
  DELIMITED_MATH.lastIndex = 0;

  for (const match of content.matchAll(DELIMITED_MATH)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(normalizeBareSegment(content.slice(lastIndex, index)));
    }
    parts.push(canonicalizeDelimiter(match[0]));
    lastIndex = index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(normalizeBareSegment(content.slice(lastIndex)));
  }

  return parts.join('');
}

export function encodeMathAsCodespans(content: string): string {
  if (!content.includes('$')) {
    return content;
  }

  // Keep fenced code (incl. mermaid) intact — `$` inside diagrams is not TeX.
  return mapOutsideFencedCode(content, (chunk) =>
    chunk
      .replace(/\$\$([\s\S]+?)\$\$/g, (_m, tex: string) => {
        return `\`${DISPLAY_MATH_PREFIX}${escapeCodespanBody(tex.trim())}\``;
      })
      .replace(/\$([^$\n]+?)\$/g, (_m, tex: string) => {
        return `\`${INLINE_MATH_PREFIX}${escapeCodespanBody(tex.trim())}\``;
      }),
  );
}

function mapOutsideFencedCode(
  content: string,
  transform: (chunk: string) => string,
): string {
  const parts: string[] = [];
  let lastIndex = 0;
  const fence = /```[\s\S]*?```/g;

  for (const match of content.matchAll(fence)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(transform(content.slice(lastIndex, index)));
    }
    parts.push(match[0]);
    lastIndex = index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(transform(content.slice(lastIndex)));
  }

  return parts.join('');
}

export function parseMathMarker(
  text: string,
): { tex: string; display: boolean } | null {
  if (text.startsWith(DISPLAY_MATH_PREFIX)) {
    return {
      tex: unescapeCodespanBody(text.slice(DISPLAY_MATH_PREFIX.length)),
      display: true,
    };
  }
  if (text.startsWith(INLINE_MATH_PREFIX)) {
    return {
      tex: unescapeCodespanBody(text.slice(INLINE_MATH_PREFIX.length)),
      display: false,
    };
  }
  return null;
}

function canonicalizeDelimiter(chunk: string): string {
  if (chunk.startsWith('\\(') && chunk.endsWith('\\)')) {
    return `$${chunk.slice(2, -2).trim()}$`;
  }
  if (chunk.startsWith('\\[') && chunk.endsWith('\\]')) {
    return `$$${chunk.slice(2, -2).trim()}$$`;
  }
  return chunk;
}

function normalizeBareSegment(text: string): string {
  const withParens = text.replace(/\(\s*(\\[^)]+?)\s*\)/g, (_m, inner: string) => {
    return `$${inner.trim()}$`;
  });

  return wrapOutsideDollars(withParens, wrapBareLatexCommands);
}

function wrapOutsideDollars(
  text: string,
  transform: (chunk: string) => string,
): string {
  const parts: string[] = [];
  let lastIndex = 0;
  const re = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g;

  for (const match of text.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(transform(text.slice(lastIndex, index)));
    }
    parts.push(match[0]);
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(transform(text.slice(lastIndex)));
  }

  return parts.join('');
}

function wrapBareLatexCommands(text: string): string {
  return text
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_m, a: string, b: string) => {
      return `$\\frac{${a}}{${b}}$`;
    })
    .replace(/\\sqrt\[([^\]]+)\]\{([^{}]+)\}/g, (_m, n: string, a: string) => {
      return `$\\sqrt[${n}]{${a}}$`;
    })
    .replace(/\\sqrt\{([^{}]+)\}/g, (_m, a: string) => {
      return `$\\sqrt{${a}}$`;
    })
    .replace(
      /\\(?:times|div|cdot|pm|mp|leq|geq|neq|approx|infty|ldots|cdots)\b/g,
      (cmd) => `$${cmd}$`,
    );
}

/** Backticks would break markdown codespans; use a private-use stand-in. */
function escapeCodespanBody(tex: string): string {
  return tex.replace(/`/g, '\uE001');
}

function unescapeCodespanBody(tex: string): string {
  return tex.replace(/\uE001/g, '`');
}
