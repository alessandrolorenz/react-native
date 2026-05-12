import React from 'react';
import { Text as RNText } from 'react-native';
import { colors, textVariants } from '../../theme';

// Variants come from theme/typography.js. `color` is a semantic key under
// colors.text.* — defaults to primary. For one-off colors, pass `style={{ color }}`.

const COLOR_MAP = {
  primary: colors.text.primary,
  soft: colors.text.soft,
  onPrimary: colors.text.onPrimary,
  onAccent: colors.text.onAccent,
  accent: colors.action.primaryPressed,
  error: colors.status.error,
};

export default function Text({
  variant = 'body',
  color = 'primary',
  align,
  italic = false,
  children,
  style,
  ...rest
}) {
  const variantStyle = textVariants[variant] || textVariants.body;
  const resolvedColor = COLOR_MAP[color] || color; // allow raw hex passthrough

  return (
    <RNText
      style={[
        variantStyle,
        { color: resolvedColor },
        align && { textAlign: align },
        italic && { fontStyle: 'italic' },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
