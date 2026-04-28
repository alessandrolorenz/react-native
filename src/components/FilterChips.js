import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/colors';

// Three stacked horizontal chip rows (Categoria / Região / Época) plus a
// clear-all link. Filter values are derived dynamically by the parent and
// passed in as `rows`. Selecting a chip toggles it (tap-again deselects).
//
// Props:
//   rows:        { key, label, options, selected }[]  — one entry per facet
//   onSelect:    (key, value) => void                  — value can be null to clear
//   onClearAll:  () => void
//   showClearAll: boolean
export default function FilterChips({ rows, onSelect, onClearAll, showClearAll }) {
  return (
    <View style={styles.container}>
      {rows.map((row) =>
        row.options.length === 0 ? null : (
          <View key={row.key} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {row.options.map((option) => {
                const active = row.selected === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => onSelect(row.key, active ? null : option)}
                    style={[styles.chip, active && styles.chipActive]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ),
      )}

      {showClearAll && (
        <Pressable onPress={onClearAll} style={styles.clearBtn} accessibilityRole="button">
          <Text style={styles.clearText}>✕ limpar filtros</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  row: {
    marginBottom: spacing.sm,
  },
  rowLabel: {
    fontSize: 11,
    color: colors.textSoft,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
    marginLeft: 2,
  },
  scrollContent: {
    paddingRight: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.cardBackEdge,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.textOnPrimary,
  },
  clearBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  clearText: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '700',
  },
});
