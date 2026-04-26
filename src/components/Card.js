import React, { memo, useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radii, shadow } from '../theme/colors';

// Single memory card with a 3D flip animation.
// `isOpen` (matched OR currently flipped) drives a rotateY animation between
// 0deg (back face up) and 180deg (front face up). backfaceVisibility: 'hidden'
// keeps the hidden face from leaking through during the rotation.
function Card({ card, isOpen, isMatched, disabled, onPress, size }) {
  const rotation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isOpen ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [isOpen, rotation]);

  const frontInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const backInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const dimension = { width: size, height: size };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isOpen}
      style={[styles.cardWrapper, dimension]}
      accessibilityRole="button"
      accessibilityLabel={isOpen ? card.saint.name : 'Carta virada para baixo'}
    >
      {/* Back face (face-down state) */}
      <Animated.View
        style={[
          styles.face,
          styles.back,
          dimension,
          { transform: [{ rotateY: backInterpolate }] },
        ]}
      >
        <View style={styles.backInner}>
          <Text style={styles.backGlyph}>✦</Text>
        </View>
      </Animated.View>

      {/* Front face (saint reveal) */}
      <Animated.View
        style={[
          styles.face,
          styles.front,
          dimension,
          isMatched && styles.frontMatched,
          { transform: [{ rotateY: frontInterpolate }] },
        ]}
      >
        <Image source={card.saint.image} style={styles.image} resizeMode="cover" />
        <View style={styles.emojiBadge}>
          <Text style={styles.emoji}>{card.saint.emoji}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    margin: 4,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: radii.md,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    ...shadow,
  },
  back: {
    backgroundColor: colors.cardBack,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cardBackEdge,
  },
  backInner: {
    width: '70%',
    height: '70%',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.cardBackEdge,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: {
    fontSize: 28,
    color: colors.white,
    opacity: 0.85,
  },
  front: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frontMatched: {
    borderWidth: 2,
    borderColor: colors.matched,
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
});

// Memoized: only re-renders when its open/matched/disabled state changes.
export default memo(Card, (prev, next) =>
  prev.isOpen === next.isOpen &&
  prev.isMatched === next.isMatched &&
  prev.disabled === next.disabled &&
  prev.size === next.size &&
  prev.card.cardId === next.card.cardId,
);
