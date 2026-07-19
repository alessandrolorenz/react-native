import React, { memo, useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ItemArtwork from './ItemArtwork';
import { colors, radii, shadow } from '../theme/colors';
import { duration } from '../theme';

// Single memory card with a 3D flip animation.
// `isOpen` (matched OR currently flipped) drives a rotateY animation between
// 0deg (back face up) and 180deg (front face up). backfaceVisibility: 'hidden'
// keeps the hidden face from leaking through during the rotation.
function Card({
  card,
  isOpen,
  isMatched,
  disabled,
  onPress,
  size,
  position,
  totalCards,
  row,
  column,
  reduceMotion,
  cardBackGlyph = '✦',
}) {
  const rotation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      rotation.stopAnimation();
      rotation.setValue(isOpen ? 1 : 0);
      return undefined;
    }

    const animation = Animated.timing(rotation, {
      toValue: isOpen ? 1 : 0,
      duration: duration.base,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [isOpen, reduceMotion, rotation]);

  const frontInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const backInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const dimension = { width: size, height: size };
  const positionLabel = `Carta ${position} de ${totalCards}, linha ${row}, coluna ${column}`;
  const accessibilityLabel = isMatched
    ? `${positionLabel}, ${card.item.name}, par encontrado`
    : isOpen
      ? `${positionLabel}, ${card.item.name}, revelada`
      : `${positionLabel}, virada para baixo`;
  const interactionDisabled = disabled || isOpen;

  return (
    <Pressable
      onPress={onPress}
      disabled={interactionDisabled}
      style={[styles.cardWrapper, dimension]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={interactionDisabled ? undefined : 'Toque duas vezes para revelar'}
      accessibilityState={{ disabled: interactionDisabled, selected: isOpen }}
      focusable
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
          <Text style={styles.backGlyph}>{cardBackGlyph}</Text>
        </View>
      </Animated.View>

      {/* Front face (theme item reveal) */}
      <Animated.View
        style={[
          styles.face,
          styles.front,
          dimension,
          isMatched && styles.frontMatched,
          { transform: [{ rotateY: frontInterpolate }] },
        ]}
      >
        <ItemArtwork item={card.item} glyphStyle={styles.itemGlyph} />
        {isMatched ? (
          <View style={styles.matchedBadge} importantForAccessibility="no-hide-descendants">
            <Text style={styles.matchedBadgeText}>✓</Text>
          </View>
        ) : null}
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
    color: colors.text,
  },
  front: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frontMatched: {
    borderWidth: 3,
    borderColor: colors.primaryDark,
  },
  matchedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchedBadgeText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  itemGlyph: {
    fontSize: 34,
  },
});

// Memoized: only re-renders when its open/matched/disabled state changes.
export default memo(Card, (prev, next) =>
  prev.isOpen === next.isOpen &&
  prev.isMatched === next.isMatched &&
  prev.disabled === next.disabled &&
  prev.size === next.size &&
  prev.position === next.position &&
  prev.totalCards === next.totalCards &&
  prev.row === next.row &&
  prev.column === next.column &&
  prev.reduceMotion === next.reduceMotion &&
  prev.cardBackGlyph === next.cardBackGlyph &&
  prev.card.cardId === next.card.cardId,
);
