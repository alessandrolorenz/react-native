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
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue}>{value}</Text>
    </View>
  );
}

export default function Header({
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
        <Pressable onPress={onBack} style={styles.iconBtn} accessibilityLabel="Voltar">
          <Text style={styles.icon}>‹</Text>
        </Pressable>

        <View style={styles.center}>
          <Text style={styles.phaseLabel}>{activePhase.label}</Text>
          <Text style={styles.phaseMeta}>Grade {activePhase.rows}x{activePhase.cols}</Text>
        </View>

        <Pressable onPress={onRestart} style={styles.iconBtn} accessibilityLabel="Reiniciar fase">
          <Text style={styles.icon}>↻</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
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
    fontSize: 10,
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
