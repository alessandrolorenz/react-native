import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, elevation, radii, spacing, textVariants } from '../../theme';

// Variants:
//   primary   — rose action, white text (main CTAs)
//   secondary — sky action, white text (alternate CTAs like "Galeria")
//   tertiary  — peach accent, dark text (subtle calls to action)
//   icon      — 44×44 circular pill, white surface (back/settings buttons)
//
// Sizes apply to non-icon variants. Icon variant ignores `size` and uses 44×44.

const VARIANT_STYLES = {
  primary: { backgroundColor: colors.action.primary, textColor: colors.text.onPrimary },
  secondary: { backgroundColor: colors.action.secondary, textColor: colors.text.onPrimary },
  tertiary: { backgroundColor: colors.action.accent, textColor: colors.text.onAccent },
};

const SIZE_STYLES = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: textVariants.body.fontSize },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: textVariants.h2.fontSize },
  lg: { paddingVertical: spacing.md + spacing.xs, paddingHorizontal: spacing.lg, fontSize: textVariants.cta.fontSize },
};

export default function Button({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  onPress,
  disabled = false,
  accessibilityLabel,
  children,
  style,
}) {
  if (variant === 'icon') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.iconBase,
          pressed && styles.pressed,
          disabled && styles.disabled,
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <Text style={styles.iconGlyph}>{children}</Text>
      </Pressable>
    );
  }

  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const s = SIZE_STYLES[size] || SIZE_STYLES.lg;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: v.backgroundColor,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text
        style={[
          textVariants.cta,
          { fontSize: s.fontSize, color: v.textColor },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.sm,
  },
  fullWidth: { width: '100%' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  iconBase: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.sm,
  },
  iconGlyph: {
    fontSize: 20,
    color: colors.text.primary,
  },
});
