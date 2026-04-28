import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SAINTS } from '../data/saints';
import { colors, radii, shadow, spacing } from '../theme/colors';

const HERO_SIZE = 220;
const FLIP_DURATION = 280;

// Full-screen profile with an auto-flipping hero card at the top.
// The flip recipe is copied from Card.js (rotateY 0deg<->180deg with
// backfaceVisibility: 'hidden') so the gallery feels visually continuous
// with the game cards. Heavy manuscript treatment: gold double border,
// corner glyphs, dashed dividers.
export default function SaintProfileScreen({ saintId, onBack }) {
  const saint = SAINTS.find((s) => s.id === saintId);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!saint) {
      onBack();
      return;
    }
    Animated.timing(rotation, {
      toValue: 1,
      duration: FLIP_DURATION,
      useNativeDriver: true,
    }).start();
  }, [saint, rotation, onBack]);

  if (!saint) return null;

  const frontInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const backInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const hasStory = saint.story && saint.story.length > 0 && saint.story[0] !== 'TODO';
  const hasFact = saint.fact && saint.fact !== 'TODO';
  const hasPatronage = saint.patronage && saint.patronage.length > 0;
  const metaPills = [
    { label: 'Festa', value: saint.feast_day },
    { label: 'Região', value: saint.region },
    { label: 'Época', value: saint.era },
  ].filter((p) => p.value);

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.iconBtn} accessibilityLabel="Voltar">
          <Text style={styles.icon}>‹</Text>
        </Pressable>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero flip card with double-border and corner glyphs */}
        <View style={styles.heroOuter}>
          <View style={styles.heroInner}>
            <View style={styles.heroFlip}>
              <Animated.View
                style={[
                  styles.heroFace,
                  styles.heroBack,
                  { transform: [{ rotateY: backInterpolate }] },
                ]}
              >
                <View style={styles.heroBackInner}>
                  <Text style={styles.heroBackGlyph}>✦</Text>
                </View>
              </Animated.View>
              <Animated.View
                style={[
                  styles.heroFace,
                  styles.heroFront,
                  { transform: [{ rotateY: frontInterpolate }] },
                ]}
              >
                <Image source={saint.image} style={styles.heroImage} resizeMode="cover" />
                <View style={styles.heroEmojiBadge}>
                  <Text style={styles.heroEmoji}>{saint.emoji}</Text>
                </View>
              </Animated.View>
            </View>
          </View>
          {/* Corner ornaments */}
          <Text style={[styles.cornerGlyph, styles.cornerTL]}>✦</Text>
          <Text style={[styles.cornerGlyph, styles.cornerTR]}>✦</Text>
          <Text style={[styles.cornerGlyph, styles.cornerBL]}>✦</Text>
          <Text style={[styles.cornerGlyph, styles.cornerBR]}>✦</Text>
        </View>

        <Text style={styles.name}>{saint.name}</Text>
        {saint.short_description && saint.short_description !== 'TODO' && (
          <Text style={styles.short}>{saint.short_description}</Text>
        )}

        {metaPills.length > 0 && (
          <View style={styles.metaRow}>
            {metaPills.map((pill) => (
              <View key={pill.label} style={styles.metaPill}>
                <Text style={styles.metaLabel}>{pill.label}</Text>
                <Text style={styles.metaValue}>{pill.value}</Text>
              </View>
            ))}
          </View>
        )}

        {hasPatronage && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>✦ PADROEIRO DE</Text>
            <View style={styles.patronageRow}>
              {saint.patronage.map((p) => (
                <View key={p} style={styles.patronageChip}>
                  <Text style={styles.patronageText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {hasStory && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>✦ HISTÓRIA</Text>
            <View style={styles.storyBlock}>
              {saint.story.map((line, i) => (
                <Text key={i} style={styles.storyLine}>
                  {line}
                </Text>
              ))}
            </View>
          </View>
        )}

        {hasStory && hasFact && <View style={styles.divider} />}

        {hasFact && (
          <View style={styles.factPill}>
            <Text style={styles.factLabel}>✦ Você sabia?</Text>
            <Text style={styles.fact}>{saint.fact}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    color: colors.text,
    lineHeight: 26,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },

  // Hero card with gold double-border and corner glyphs
  heroOuter: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    padding: 4,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.cardBackEdge,
    backgroundColor: 'rgba(232,201,160,0.08)',
  },
  heroInner: {
    borderRadius: radii.lg - 4,
    borderWidth: 1,
    borderColor: colors.cardBack,
    padding: spacing.sm,
  },
  heroFlip: {
    width: HERO_SIZE,
    height: HERO_SIZE,
  },
  heroFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: HERO_SIZE,
    height: HERO_SIZE,
    borderRadius: radii.md,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    ...shadow,
  },
  heroBack: {
    backgroundColor: colors.cardBack,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cardBackEdge,
  },
  heroBackInner: {
    width: '70%',
    height: '70%',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.cardBackEdge,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBackGlyph: {
    fontSize: 36,
    color: colors.white,
    opacity: 0.85,
  },
  heroFront: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroEmojiBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    ...shadow,
  },
  heroEmoji: { fontSize: 18 },

  cornerGlyph: {
    position: 'absolute',
    fontSize: 14,
    color: colors.cardBackEdge,
  },
  cornerTL: { top: -2, left: -2 },
  cornerTR: { top: -2, right: -2 },
  cornerBL: { bottom: -2, left: -2 },
  cornerBR: { bottom: -2, right: -2 },

  name: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  short: {
    fontSize: 16,
    color: colors.textSoft,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginBottom: spacing.md,
  },
  metaPill: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    margin: 4,
    minWidth: 90,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
  },

  section: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  patronageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  patronageChip: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.cardBackEdge,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    margin: 4,
  },
  patronageText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  storyBlock: {
    alignSelf: 'stretch',
  },
  storyLine: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 6,
  },
  divider: {
    alignSelf: 'stretch',
    height: 1,
    borderTopWidth: 1,
    borderColor: colors.cardBackEdge,
    borderStyle: 'dashed',
    marginVertical: spacing.md,
  },
  factPill: {
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  factLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  fact: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 21,
  },
});
