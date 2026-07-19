import React, { useRef } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ItemArtwork from './ItemArtwork';
import { colors, radii, shadow, spacing } from '../theme/colors';
import useAccessibilityFocus from '../hooks/useAccessibilityFocus';

export default function ResultModal({
  visible,
  theme,
  item,
  hasNextPhase,
  onNextPhase,
  onPlayAgain,
  onBackHome,
  reduceMotion = false,
}) {
  const titleRef = useRef(null);
  useAccessibilityFocus(titleRef, visible ? item?.id : 'result-hidden', {
    enabled: visible,
    delayMs: reduceMotion ? 120 : 360,
  });

  if (!item) return null;

  const hasStory = Array.isArray(item.story) && item.story.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduceMotion ? 'none' : 'fade'}
      onRequestClose={onBackHome}
    >
      <View
        style={styles.backdrop}
        accessibilityViewIsModal
        importantForAccessibility="yes"
      >
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.kicker}>✨ Fase concluída! ✨</Text>
            <Text ref={titleRef} style={styles.congrats} accessibilityRole="header">
              Você encontrou todos os pares!
            </Text>

            <View
              style={styles.imageWrap}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
            >
              <ItemArtwork item={item} glyphStyle={styles.artworkGlyph} />
            </View>

            <Text style={styles.name}>{item.name}</Text>
            {item.shortDescription ? <Text style={styles.short}>{item.shortDescription}</Text> : null}

            {hasStory ? <View style={styles.storyBlock}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                {theme.copy.resultSectionTitle}
              </Text>
              {item.story.map((line, i) => (
                <Text key={i} style={styles.storyLine}>
                  {line}
                </Text>
              ))}
            </View> : null}

            {item.fact ? <View style={styles.factPill}>
              <Text style={styles.factLabel} accessibilityRole="header">
                {theme.copy.factTitle}
              </Text>
              <Text style={styles.fact}>{item.fact}</Text>
            </View> : null}

            <View style={styles.actions}>
              {hasNextPhase && (
                <Pressable
                  style={styles.cta}
                  onPress={onNextPhase}
                  accessibilityRole="button"
                  accessibilityLabel="Ir para a próxima fase"
                >
                  <Text style={styles.ctaText}>Próxima fase</Text>
                </Pressable>
              )}
              <Pressable
                style={[styles.cta, styles.ctaAlt]}
                onPress={onPlayAgain}
                accessibilityRole="button"
                accessibilityLabel="Repetir esta fase"
              >
                <Text style={styles.ctaText}>Repetir fase</Text>
              </Pressable>
              <Pressable
                style={[styles.cta, styles.ctaHome]}
                onPress={onBackHome}
                accessibilityRole="button"
                accessibilityLabel="Voltar ao início"
              >
                <Text style={[styles.ctaText, styles.ctaHomeText]}>Voltar ao início</Text>
              </Pressable>
            </View>
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
    marginBottom: spacing.xs,
  },
  congrats: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  imageWrap: {
    width: 148,
    height: 148,
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    ...shadow,
  },
  artworkGlyph: { fontSize: 62 },
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
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: spacing.sm,
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
    minHeight: 48,
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    ...shadow,
  },
  ctaAlt: {
    backgroundColor: colors.secondary,
  },
  ctaHome: {
    backgroundColor: colors.primaryDark,
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
    letterSpacing: 0.5,
  },
  ctaHomeText: {
    color: colors.textOnDark,
  },
});
