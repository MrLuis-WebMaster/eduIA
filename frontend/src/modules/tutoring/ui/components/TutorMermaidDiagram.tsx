import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { AppText, Box } from '@/design-system';

import {
  renderTutorMermaid,
  type TutorMermaidPalette,
} from '../tutorMermaid';

type TutorMermaidDiagramProps = {
  source: string;
  colors: TutorMermaidPalette;
  /** Shown under the diagram when rendering fails. */
  fallback?: string;
};

/**
 * Renders a Mermaid fence from the tutor as SVG inside the chat bubble.
 * Falls back to a labeled code snippet if the diagram cannot be drawn.
 */
export function TutorMermaidDiagram({
  source,
  colors,
  fallback,
}: TutorMermaidDiagramProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  const result = useMemo(
    () => renderTutorMermaid(source, colors),
    [source, colors],
  );

  if (!result.ok) {
    return (
      <Box className="my-2 overflow-hidden rounded-[10px] border border-border bg-background-secondary px-3 py-2.5">
        <AppText variant="caption" tone="muted" className="mb-1.5">
          Diagrama (no se pudo dibujar)
        </AppText>
        <AppText variant="mono" className="text-[12px] leading-[18px] text-foreground">
          {fallback ?? source.trim()}
        </AppText>
        {result.error ? (
          <AppText variant="caption" tone="muted" className="mt-1.5">
            {result.error}
          </AppText>
        ) : null}
      </Box>
    );
  }

  const scale =
    containerWidth > 0 ? Math.min(1, containerWidth / result.width) : 0;
  const drawWidth = result.width * scale;
  const drawHeight = result.height * scale;

  return (
    <View
      className="my-2 items-center overflow-hidden rounded-[10px] border border-border bg-background-secondary px-2 py-2"
      onLayout={(e) => {
        const next = Math.floor(e.nativeEvent.layout.width);
        if (next > 0 && next !== containerWidth) {
          setContainerWidth(next);
        }
      }}
      accessibilityRole="image"
      accessibilityLabel="Diagrama Mermaid">
      {scale > 0 ? (
        <SvgXml xml={result.svg} width={drawWidth} height={drawHeight} />
      ) : (
        <View style={{ height: 48 }} />
      )}
    </View>
  );
}
