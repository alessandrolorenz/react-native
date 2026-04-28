import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow, spacing } from '../theme/colors';

// Dumb gallery tile: square saint portrait + two-line name caption underneath.
// No flip animation here — tap routes to SaintProfileScreen which runs the
// hero flip. Keeps tile layout simple (caption flows below the image without
// fighting backfaceVisibility).
function SaintTile({ saint, size, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrapper, { width: size }]}
      accessibilityRole="button"
      accessibilityLabel={saint.name}
    >
      <View style={[styles.imageFrame, { width: size, height: size }]}>
        <Image source={saint.image} style={styles.image} resizeMode="cover" />
        <View style={styles.emojiBadge}>
          <Text style={styles.emoji}>{saint.emoji}</Text>
        </View>
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {saint.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 4,
    alignItems: 'center',
  },
  imageFrame: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBackEdge,
    overflow: 'hidden',
    ...shadow,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emojiBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  emoji: {
    fontSize: 16,
  },
  name: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
    minHeight: 32,
  },
});

export default memo(SaintTile, (prev, next) =>
  prev.saint.id === next.saint.id && prev.size === next.size,
);
