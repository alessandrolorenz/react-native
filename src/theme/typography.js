// Type system — scale + composed variants.
// Consume via <Text variant="..."> in src/components/ui/Text.js.
// Raw scales (fontSize, fontWeight, etc.) are exported for one-off needs,
// but prefer variants so styles stay consistent across screens.

export const fontSize = {
  xs: 10,
  sm: 11,
  base: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
  '5xl': 56,
  '6xl': 72,
};

export const fontWeight = {
  medium: '600',
  bold: '700',
  black: '800',
};

export const lineHeight = {
  tight: 16,
  snug: 20,
  normal: 24,
  relaxed: 32,
  heading: 40,
};

export const letterSpacing = {
  none: 0,
  narrow: 0.5,
  wide: 1,
  wider: 2,
};

export const textVariants = {
  display: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.heading,
  },
  h1: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.relaxed,
  },
  h2: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    lineHeight: lineHeight.normal,
  },
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.snug,
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.tight,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
  },
  cta: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.wide,
  },
};
