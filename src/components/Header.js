import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/colors';

// Lightweight header used on the game screen.
// Left: back button (returns home). Right: restart icon (re-shuffles deck).
// Center: small move counter to give kids a gentle progress signal.
export default function Header({ onBack, onRestart, moves }) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onBack} style={styles.iconBtn} accessibilityLabel="Voltar">
        <Text style={styles.icon}>‹</Text>
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.movesLabel}>Jogadas</Text>
        <Text style={styles.movesValue}>{moves}</Text>
      </View>

      <Pressable onPress={onRestart} style={styles.iconBtn} accessibilityLabel="Reiniciar">
        <Text style={styles.icon}>↻</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
  movesLabel: {
    fontSize: 11,
    color: colors.textSoft,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  movesValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
});
