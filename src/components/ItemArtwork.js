import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow } from '../theme/colors';

export default function ItemArtwork({ item, imageStyle, glyphStyle, showBadge = true }) {
  const glyph = item.visual?.glyph || item.emoji || '✦';
  const backgroundColor = item.visual?.backgroundColor || colors.surface;

  return (
    <View
      style={[styles.artwork, { backgroundColor }]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      {item.image ? (
        <Image
          source={item.image}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
          accessible={false}
        />
      ) : (
        <Text
          style={[styles.glyph, glyph.length > 2 && styles.compactGlyph, glyphStyle]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {glyph}
        </Text>
      )}
      {showBadge && item.showEmojiBadge !== false && item.image && item.emoji ? (
        <View style={styles.emojiBadge}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  artwork: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  glyph: {
    fontSize: 42,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '700',
  },
  compactGlyph: {
    fontSize: 30,
  },
  emojiBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.pill,
    ...shadow,
  },
  emoji: {
    fontSize: 16,
  },
});
