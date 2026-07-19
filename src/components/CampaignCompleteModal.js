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

export default function CampaignCompleteModal({
  visible,
  theme,
  item,
  onBackHome,
  reduceMotion = false,
}) {
  const titleRef = useRef(null);
  useAccessibilityFocus(titleRef, visible ? item?.id : 'campaign-hidden', {
    enabled: visible,
    delayMs: reduceMotion ? 120 : 360,
  });

  if (!item) return null;

  const completion = theme.completion;
  const sectionTitle = completion.sectionTitle?.(item);
  const sectionText = completion.sectionText?.(item);
  const finalMessage = completion.finalMessage?.(item);
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
            <Text style={styles.kicker}>{completion.kicker}</Text>

            <Text ref={titleRef} style={styles.congratsTitle} accessibilityRole="header">
              {completion.title}
            </Text>

            <Text style={styles.congratsText}>
              {completion.message}
            </Text>

            <View
              style={styles.imageWrap}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
            >
              <ItemArtwork item={item} glyphStyle={styles.artworkGlyph} />
            </View>

            <Text style={styles.itemName}>{item.name}</Text>
            {item.shortDescription ? <Text style={styles.short}>{item.shortDescription}</Text> : null}

            {hasStory ? <View style={styles.storyCard}>
              <Text style={styles.storyTitle} accessibilityRole="header">
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

            {sectionText ? <View style={styles.completionCard}>
              {sectionTitle ? (
                <Text style={styles.completionTitle} accessibilityRole="header">
                  {sectionTitle}
                </Text>
              ) : null}
              <Text style={styles.completionText}>{sectionText}</Text>
            </View> : null}

            {finalMessage ? <Text style={styles.finalMessage}>{finalMessage}</Text> : null}

            <Pressable
              style={styles.cta}
              onPress={onBackHome}
              accessibilityRole="button"
              accessibilityLabel="Voltar ao início"
            >
              <Text style={styles.ctaText}>Voltar ao Início</Text>
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
    maxHeight: '95%',
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
    fontSize: 16,
    color: colors.primaryDark,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  congratsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 32,
  },
  congratsText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.md,
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
  artworkGlyph: { fontSize: 66 },
  itemName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
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
  storyCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: '700',
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
    marginBottom: spacing.md,
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
  completionCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow,
  },
  completionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  completionText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 23,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  finalMessage: {
    fontSize: 14,
    color: colors.textSoft,
    textAlign: 'center',
    marginBottom: spacing.md,
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
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
    letterSpacing: 0.5,
  },
});
