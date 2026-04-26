import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radii, shadow, spacing } from '../theme/colors';

// Shown when the player matches all pairs.
// Reveals one saint with image, name, story, and fun fact, plus a CTA to
// start a new round.
export default function ResultModal({ visible, saint, onPlayAgain }) {
  if (!saint) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.kicker}>Parabéns!</Text>

            <View style={styles.imageWrap}>
              <Image source={saint.image} style={styles.image} resizeMode="cover" />
              <View style={styles.emojiBadge}>
                <Text style={styles.emoji}>{saint.emoji}</Text>
              </View>
            </View>

            <Text style={styles.name}>{saint.name}</Text>
            <Text style={styles.short}>{saint.short_description}</Text>

            <View style={styles.storyBlock}>
              {saint.story.map((line, i) => (
                <Text key={i} style={styles.storyLine}>
                  {line}
                </Text>
              ))}
            </View>

            <View style={styles.factPill}>
              <Text style={styles.factLabel}>Você sabia?</Text>
              <Text style={styles.fact}>{saint.fact}</Text>
            </View>

            <Pressable style={styles.cta} onPress={onPlayAgain}>
              <Text style={styles.ctaText}>Jogar novamente</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '92%',
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadow,
  },
  scroll: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  kicker: {
    fontSize: 14,
    color: colors.primaryDark,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  imageWrap: {
    width: 160,
    height: 160,
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    ...shadow,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emojiBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    ...shadow,
  },
  emoji: { fontSize: 18 },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  short: {
    fontSize: 15,
    color: colors.textSoft,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  storyBlock: {
    alignSelf: 'stretch',
    marginBottom: spacing.md,
  },
  storyLine: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 4,
  },
  factPill: {
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  factLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  fact: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  cta: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    ...shadow,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
    letterSpacing: 0.5,
  },
});
