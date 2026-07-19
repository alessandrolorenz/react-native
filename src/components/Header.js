import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/colors';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function StatPill({ label, value }) {
  return (
    <View style={styles.pill} accessible={false} importantForAccessibility="no-hide-descendants">
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue}>{value}</Text>
    </View>
  );
}

export default function Header({
  titleRef,
  onBack,
  onRestart,
  moves,
  activePhase,
  totalScore,
  phasePoints,
  combo,
  elapsedSeconds,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          onPress={onBack}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao início"
        >
          <Text style={styles.icon}>‹</Text>
        </Pressable>

        <View
          ref={titleRef}
          style={styles.center}
          accessible
          accessibilityRole="header"
          accessibilityLabel={`${activePhase.label}, grade ${activePhase.rows} por ${activePhase.cols}`}
        >
          <Text style={styles.phaseLabel} accessible={false}>{activePhase.label}</Text>
          <Text style={styles.phaseMeta} accessible={false}>
            Grade {activePhase.rows}x{activePhase.cols}
          </Text>
        </View>

        <Pressable
          onPress={onRestart}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Reiniciar fase"
          accessibilityHint="Embaralha as cartas e zera o progresso desta partida"
        >
          <Text style={styles.icon}>↻</Text>
        </Pressable>
      </View>

      <View
        style={styles.statsRow}
        accessible
        accessibilityRole="summary"
        accessibilityLabel={`Resumo da partida. Total ${totalScore} pontos. Fase ${phasePoints} pontos. Tempo ${formatTime(elapsedSeconds)}. Combo ${combo}. ${moves} jogadas.`}
      >
        <StatPill label="Total" value={totalScore} />
        <StatPill label="Fase" value={phasePoints} />
        <StatPill label="Tempo" value={formatTime(elapsedSeconds)} />
        <StatPill label="Combo" value={combo} />
        <StatPill label="Jogadas" value={moves} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 48,
    height: 48,
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
  center: {
    alignItems: 'center',
  },
  phaseLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  phaseMeta: {
    fontSize: 12,
    color: colors.textSoft,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  pill: {
    minWidth: '18%',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  pillLabel: {
    fontSize: 11,
    color: colors.textSoft,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pillValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
});
