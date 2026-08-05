import { renderMermaidSVG } from 'beautiful-mermaid';

export type TutorMermaidPalette = {
  bg: string;
  fg: string;
  line: string;
  accent: string;
  muted: string;
  surface: string;
  border: string;
};

export type TutorMermaidRenderResult =
  | {
      ok: true;
      svg: string;
      width: number;
      height: number;
    }
  | {
      ok: false;
      error: string;
    };

const MERMAID_LANG = /^mermaid\b/i;

const MERMAID_START =
  /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|xychart(?:-beta)?|quadrantChart|requirementDiagram|C4Context)\b/i;

/**
 * True when a fenced code block should be drawn as a Mermaid diagram
 * (language tag or recognizable first line when the model omits `mermaid`).
 */
export function isMermaidCodeBlock(
  language: string | undefined,
  text: string,
): boolean {
  if (language && MERMAID_LANG.test(language.trim())) {
    return true;
  }

  const firstLine = text.trim().split(/\r?\n/, 1)[0]?.trim() ?? '';
  return MERMAID_START.test(firstLine);
}

/**
 * beautiful-mermaid emits CSS variables / color-mix(); react-native-svg needs
 * concrete paint values. Strip the style block and inline the theme colors.
 */
export function flattenMermaidSvg(
  svg: string,
  colors: TutorMermaidPalette,
): string {
  const map: Record<string, string> = {
    '--bg': colors.bg,
    '--fg': colors.fg,
    '--line': colors.line,
    '--accent': colors.accent,
    '--muted': colors.muted,
    '--surface': colors.surface,
    '--border': colors.border,
    '--_text': colors.fg,
    '--_text-sec': colors.muted,
    '--_text-muted': colors.muted,
    '--_text-faint': colors.muted,
    '--_line': colors.line,
    '--_arrow': colors.accent,
    '--_node-fill': colors.surface,
    '--_node-stroke': colors.border,
    '--_inner-stroke': colors.border,
    '--_group-fill': colors.bg,
    '--_group-hdr': colors.surface,
    '--_key-badge': colors.surface,
  };

  return svg
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\sstyle="--[^"]*"/, '')
    .replace(/var\((--[a-zA-Z0-9_-]+)\)/g, (_m, name: string) => {
      return map[name] ?? colors.fg;
    });
}

export function parseSvgViewBox(
  svg: string,
): { width: number; height: number } | null {
  const match = svg.match(
    /viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/,
  );
  if (!match) return null;
  const width = Number(match[3]);
  const height = Number(match[4]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }
  return { width, height };
}

export function renderTutorMermaid(
  source: string,
  colors: TutorMermaidPalette,
): TutorMermaidRenderResult {
  const trimmed = source.trim();
  if (!trimmed) {
    return { ok: false, error: 'Diagrama vacío' };
  }

  try {
    const raw = renderMermaidSVG(trimmed, {
      bg: colors.bg,
      fg: colors.fg,
      line: colors.line,
      accent: colors.accent,
      muted: colors.muted,
      surface: colors.surface,
      border: colors.border,
      transparent: true,
      padding: 16,
      font: 'System',
    });
    const svg = flattenMermaidSvg(raw, colors);
    const box = parseSvgViewBox(svg);
    if (!box) {
      return { ok: false, error: 'No se pudo medir el diagrama' };
    }
    return { ok: true, svg, width: box.width, height: box.height };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'No se pudo renderizar el diagrama';
    return { ok: false, error: message };
  }
}
