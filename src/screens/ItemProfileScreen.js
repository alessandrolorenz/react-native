import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ItemArtwork from '../components/ItemArtwork';
import { colors, radii, shadow, spacing } from '../theme/colors';
import { SAFE_AREA } from '../utils/safeArea';
import { duration } from '../theme';
import useAccessibilityFocus from '../hooks/useAccessibilityFocus';
import useReducedMotion from '../hooks/useReducedMotion';

const HERO_SIZE = 220;

export default function ItemProfileScreen({ theme, itemId, onBack }) {
  const item = theme.items.find((candidate) => candidate.id === itemId);
  const rotation = useRef(new Animated.Value(0)).current;
  const titleRef = useRef(null);
  const reduceMotion = useReducedMotion();
  useAccessibilityFocus(titleRef, itemId);

  useEffect(() => {
    if (!item) {
      onBack();
      return;
    }
    if (reduceMotion) {
      rotation.stopAnimation();
      rotation.setValue(1);
      return undefined;
    }

    const animation = Animated.timing(rotation, {
      toValue: 1,
      duration: duration.base,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [item, reduceMotion, rotation, onBack]);

  if (!item) return null;

  const frontInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });
  const backInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const metaPills = (theme.profile?.metaFields || [])
    .map((field) => ({ ...field, value: item.metadata?.[field.key] }))
    .filter((field) => typeof field.value === 'string' && field.value);
  const tagField = theme.profile?.tagField;
  const tags = tagField ? item.metadata?.[tagField.key] || [] : [];
  const hasStory = Array.isArray(item.story) && item.story.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Voltar à galeria"
        >
          <Text style={styles.icon}>‹</Text>
        </Pressable>
        <View style={styles.iconBtnPlaceholder} accessible={false} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View
          style={styles.heroOuter}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          <Animated.View
            style={[styles.heroFace, styles.heroBack, { transform: [{ rotateY: backInterpolate }] }]}
          >
            <View style={styles.heroBackInner}>
              <Text style={styles.heroBackGlyph}>{theme.appearance?.cardBackGlyph || '✦'}</Text>
            </View>
          </Animated.View>
          <Animated.View
            style={[styles.heroFace, styles.heroFront, { transform: [{ rotateY: frontInterpolate }] }]}
          >
            <ItemArtwork item={item} glyphStyle={styles.heroGlyph} />
          </Animated.View>
        </View>

        <Text ref={titleRef} style={styles.name} accessibilityRole="header">{item.name}</Text>
        {item.shortDescription ? <Text style={styles.short}>{item.shortDescription}</Text> : null}

        {metaPills.length > 0 ? (
          <View style={styles.metaRow}>
            {metaPills.map((pill) => (
              <View
                key={pill.key}
                style={styles.metaPill}
                accessible
                accessibilityLabel={`${pill.label}: ${pill.value}`}
              >
                <Text style={styles.metaLabel} accessible={false}>{pill.label}</Text>
                <Text style={styles.metaValue} accessible={false}>{pill.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {tags.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} accessibilityRole="header">{tagField.label}</Text>
            <View style={styles.tagRow}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {hasStory ? (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} accessibilityRole="header">
              {theme.copy.profileStoryTitle}
            </Text>
            {item.story.map((line, index) => (
              <Text key={index} style={styles.storyLine}>{line}</Text>
            ))}
          </View>
        ) : null}

        {item.fact ? (
          <View style={styles.factPill}>
            <Text style={styles.factLabel} accessibilityRole="header">
              ✦ {theme.copy.factTitle}
            </Text>
            <Text style={styles.fact}>{item.fact}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + SAFE_AREA.paddingTop,
    paddingBottom: spacing.sm,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPlaceholder: { width: 48, height: 48 },
  icon: { fontSize: 24, color: colors.text, lineHeight: 26 },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + SAFE_AREA.paddingBottom,
    alignItems: 'center',
  },
  heroOuter: {
    width: HERO_SIZE,
    height: HERO_SIZE,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  heroFace: {
    position: 'absolute',
    width: HERO_SIZE,
    height: HERO_SIZE,
    borderRadius: radii.lg,
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
  heroBackGlyph: { fontSize: 36, color: colors.text },
  heroFront: { backgroundColor: colors.white },
  heroGlyph: { fontSize: 86 },
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
  },
  metaValue: { fontSize: 13, color: colors.text, textAlign: 'center' },
  section: { alignSelf: 'stretch', marginTop: spacing.md },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  tagChip: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.cardBackEdge,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  storyLine: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 6,
  },
  factPill: {
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  factLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  fact: { fontSize: 15, color: colors.text, lineHeight: 21 },
});
