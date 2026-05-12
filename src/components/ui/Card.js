import React from 'react';
import { View } from 'react-native';
import { colors, elevation, radii, spacing } from '../../theme';

// Generic surface container. Distinct from src/components/Card.js (the memory
// card with flip animation) — that one stays specialized.
//
// Use for: modal bodies, gallery cards, profile sections, the CONQUISTAS
// achievement card on Gallery, prayer/score cards in Campaign modal.

const ELEVATION_MAP = {
  none: elevation.none,
  sm: elevation.sm,
  md: elevation.md,
  lg: elevation.lg,
};

export default function Card({
  variant = 'surface', // 'surface' | 'alt' (cream100 alt for nested cards)
  padding = 'md',
  radius = 'lg',
  shadow = 'sm',
  children,
  style,
}) {
  const bg = variant === 'alt' ? colors.bg.surfaceAlt : colors.bg.surface;
  const paddingValue = spacing[padding] ?? padding;
  const radiusValue = radii[radius] ?? radius;

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          padding: paddingValue,
          borderRadius: radiusValue,
        },
        ELEVATION_MAP[shadow] || elevation.none,
        style,
      ]}
    >
      {children}
    </View>
  );
}
