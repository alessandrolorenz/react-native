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

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function Metric({ label, value }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function ResultModal({
  visible,
  saint,
  summary,
  hasNextPhase,
  onNextPhase,
  onPlayAgain,
  onBackHome,
}) {
  if (!saint || !summary) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.kicker}>Fase concluída!</Text>
            <Text style={styles.phaseTitle}>{summary.phaseLabel}</Text>

            <Metric label="Pontos da Fase" value={summary.totalPoints} />
            <View style={styles.metricRow}>
              <Metric label="Tempo" value={formatTime(summary.elapsedSeconds)} />
              <Metric label="Precisão" value={`${summary.accuracy}%`} />
            </View>
            <View style={styles.metricRow}>
              <Metric label="Melhor Combo" value={summary.bestCombo} />
              <Metric label="Jogadas" value={summary.attempts} />
            </View>

            <View style={styles.pointsBreakdown}>
              <Text style={styles.breakdownLine}>Base da fase: {summary.phasePoints}</Text>
              <Text style={styles.breakdownLine}>Bônus de conclusão: +{summary.completionBonus}</Text>
              <Text style={styles.breakdownLine}>Multiplicador de tempo: x{summary.timeMultiplier.toFixed(2)}</Text>
            </View>

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

            <View style={styles.actions}>
              {hasNextPhase && (
                <Pressable style={styles.cta} onPress={onNextPhase}>
                  <Text style={styles.ctaText}>Próxima fase</Text>
                </Pressable>
              )}
              <Pressable style={[styles.cta, styles.ctaAlt]} onPress={onPlayAgain}>
                <Text style={styles.ctaText}>Repetir fase</Text>
              </Pressable>
              <Pressable style={[styles.cta, styles.ctaHome]} onPress={onBackHome}>
                <Text style={styles.ctaText}>Voltar ao início</Text>
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
    marginBottom: spacing.sm,
  },
  phaseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  metricCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    minWidth: 120,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  metricRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pointsBreakdown: {
    alignSelf: 'stretch',
    backgroundColor: '#F7EEE2',
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  breakdownLine: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
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
});
