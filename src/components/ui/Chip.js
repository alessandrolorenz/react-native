import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import { colors, radii, spacing } from '../../theme';

// Unified chip primitive. Replaces 4+ ad-hoc chip patterns across the app:
//   filter — pill, white surface; active keeps pastel fill with dark text and a strong border
//   phase  — md radius, state-coded background (locked/unlocked/active/completed)
//   stat   — md radius, white bg, uppercase label + bold value (Header pills)
//   meta   — pill, surface bg, gold border (ItemProfile metadata)

const VARIANT_BASE = {
  filter: {
    minHeight: 48,
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  phase: {
    minHeight: 48,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
  },
  stat: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  meta: {
    minHeight: 48,
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
};

function resolveColors(variant, state) {
  if (variant === 'phase') {
    switch (state) {
      case 'locked':
        return { bg: colors.chip.locked, text: 'soft' };
      case 'unlocked':
        return { bg: colors.chip.unlocked, text: 'primary' };
      case 'completed':
        return { bg: colors.chip.completed, text: 'primary' };
      case 'active':
      default:
        return { bg: colors.chip.active, text: 'primary' };
    }
  }
  if (variant === 'filter') {
    if (state === 'active') {
      return { bg: colors.action.primary, border: colors.chip.activeBorder, text: 'onPrimary' };
    }
    return { bg: colors.bg.surface, border: colors.card.backEdge, text: 'primary' };
  }
  if (variant === 'stat') {
    return { bg: colors.bg.surface, text: 'primary' };
  }
  // meta
  return { bg: colors.bg.surface, border: colors.card.backEdge, text: 'primary' };
}

export default function Chip({
  variant = 'filter',
  state = 'default',
  label,
  sublabel,
  onPress,
  accessibilityLabel,
  style,
}) {
  const base = VARIANT_BASE[variant] || VARIANT_BASE.filter;
  const { bg, border, text } = resolveColors(variant, state);

  const containerStyle = [
    base,
    { backgroundColor: bg },
    border && { borderColor: border },
    style,
  ];

  const content = (
    <>
      {variant === 'stat' && sublabel ? (
        <Text variant="label" color="soft" align="center">{label}</Text>
      ) : null}
      <Text
        variant={variant === 'stat' ? 'body' : 'caption'}
        color={text}
        align={variant === 'stat' ? 'center' : 'auto'}
      >
        {variant === 'stat' && sublabel ? sublabel : label}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...containerStyle, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityState={{ selected: state === 'active' }}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
});
