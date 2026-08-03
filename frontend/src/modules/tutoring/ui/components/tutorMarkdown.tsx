import { type ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import {
  Renderer,
  type MarkedStyles,
  type RendererInterface,
} from 'react-native-marked';

const BODY_SIZE = 15;
const BODY_LINE = 23;

type TutorMarkdownColors = {
  text: string;
  link: string;
  code: string;
  border: string;
  muted: string;
};

/**
 * Separates list marker styles from list-item content styles.
 * react-native-marked reuses `li` for both, and its default `flexShrink: 1`
 * collapses ordered markers into tiny “superscript” numbers.
 */
class TutorMarkdownRenderer extends Renderer implements RendererInterface {
  private markerColor: string;

  constructor(markerColor: string) {
    super();
    this.markerColor = markerColor;
  }

  list(
    ordered: boolean,
    li: ReactNode[],
    listStyle?: ViewStyle,
    _textStyle?: TextStyle,
    startIndex?: number,
  ): ReactNode {
    const markerTextStyle: TextStyle = {
      color: this.markerColor,
      fontSize: BODY_SIZE,
      lineHeight: BODY_LINE,
      fontWeight: ordered ? '600' : '400',
      flexGrow: 0,
      flexShrink: 0,
      includeFontPadding: false,
    };

    const markerBoxStyle: ViewStyle = {
      paddingRight: ordered ? 10 : 8,
      paddingTop: 1,
      minWidth: ordered ? 22 : 14,
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      ...listStyle,
    };

    return super.list(ordered, li, markerBoxStyle, markerTextStyle, startIndex);
  }

  listItem(children: ReactNode[], _styles?: ViewStyle): ReactNode {
    return super.listItem(children, {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      marginBottom: 12,
      paddingTop: 0,
    });
  }
}

export function createTutorMarkdownRenderer(textColor: string) {
  return new TutorMarkdownRenderer(textColor);
}

export function createTutorMarkdownTheme(colors: TutorMarkdownColors) {
  return {
    colors: {
      text: colors.text,
      link: colors.link,
      code: colors.code,
      border: colors.border,
    },
    spacing: {
      xs: 2,
      s: 4,
      m: 6,
      l: 10,
    },
  };
}

export function createTutorMarkdownStyles(colors: TutorMarkdownColors): MarkedStyles {
  return {
    text: {
      fontSize: BODY_SIZE,
      lineHeight: BODY_LINE,
      color: colors.text,
    },
    paragraph: {
      paddingVertical: 0,
      marginTop: 0,
      marginBottom: 10,
    },
    h1: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '700',
      marginTop: 4,
      marginBottom: 10,
      paddingBottom: 0,
      borderBottomWidth: 0,
      color: colors.text,
    },
    h2: {
      fontSize: 17,
      lineHeight: 23,
      fontWeight: '700',
      marginTop: 4,
      marginBottom: 8,
      paddingBottom: 0,
      borderBottomWidth: 0,
      color: colors.text,
    },
    h3: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
      marginTop: 2,
      marginBottom: 8,
      color: colors.text,
    },
    h4: {
      fontSize: BODY_SIZE,
      lineHeight: BODY_LINE,
      fontWeight: '700',
      marginTop: 2,
      marginBottom: 6,
      color: colors.text,
    },
    h5: {
      fontSize: BODY_SIZE,
      lineHeight: BODY_LINE,
      fontWeight: '700',
      marginVertical: 4,
      color: colors.text,
    },
    h6: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '700',
      marginVertical: 4,
      color: colors.muted,
    },
    strong: {
      fontWeight: '700',
      color: colors.text,
      fontSize: BODY_SIZE,
      lineHeight: BODY_LINE,
    },
    em: {
      fontStyle: 'italic',
      color: colors.text,
      fontSize: BODY_SIZE,
      lineHeight: BODY_LINE,
    },
    li: {
      fontSize: BODY_SIZE,
      lineHeight: BODY_LINE,
      color: colors.text,
      flexShrink: 0,
    },
    list: {
      marginBottom: 2,
    },
    link: {
      color: colors.link,
      fontStyle: 'normal',
      textDecorationLine: 'underline',
      fontSize: BODY_SIZE,
      lineHeight: BODY_LINE,
    },
    codespan: {
      color: colors.link,
      backgroundColor: colors.code,
      borderRadius: 4,
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 13,
      lineHeight: BODY_LINE,
    },
    code: {
      borderRadius: 10,
      padding: 12,
      marginVertical: 8,
      backgroundColor: colors.code,
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: colors.border,
      paddingLeft: 12,
      paddingVertical: 6,
      marginVertical: 8,
      opacity: 1,
    },
    hr: {
      marginVertical: 12,
      borderBottomColor: colors.border,
    },
  };
}
