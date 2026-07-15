import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ItemArtwork from './ItemArtwork';
import { colors, radii, shadow, spacing } from '../theme/colors';

function GalleryTile({ item, size, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrapper, { width: size }]}
      accessibilityRole="button"
      accessibilityLabel={item.name}
    >
      <View style={[styles.imageFrame, { width: size, height: size }]}>
        <ItemArtwork item={item} glyphStyle={styles.glyph} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
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
  glyph: {
    fontSize: 58,
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

export default memo(GalleryTile, (prev, next) =>
  prev.item.id === next.item.id && prev.size === next.size,
);
