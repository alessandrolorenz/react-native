import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import GalleryTile from '../components/GalleryTile';
import FilterChips from '../components/FilterChips';
import { applyFilters, getDistinctValues } from '../utils/itemFilters';
import { colors, radii, shadow, spacing } from '../theme/colors';
import { SAFE_AREA } from '../utils/safeArea';
import useAccessibilityFocus from '../hooks/useAccessibilityFocus';

const COLUMNS = 2;
const HORIZONTAL_PADDING = spacing.md;
const TILE_MARGIN = 4;

export default function GalleryScreen({ theme, onBack, onSelectItem }) {
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const titleRef = useRef(null);
  useAccessibilityFocus(titleRef, theme.id);

  const { width } = Dimensions.get('window');
  const tileSize =
    Math.floor((width - HORIZONTAL_PADDING * 2) / COLUMNS) - TILE_MARGIN * 2;

  const facetOptions = useMemo(
    () => Object.fromEntries(
      theme.filters.map((filter) => [
        filter.key,
        getDistinctValues(theme.items, filter.key),
      ]),
    ),
    [theme],
  );

  const filtered = useMemo(
    () => applyFilters(theme.items, query, selectedFilters),
    [theme.items, query, selectedFilters],
  );

  const handleSelect = (key, value) => {
    setSelectedFilters((current) => ({ ...current, [key]: value }));
  };

  const clearAll = () => {
    setQuery('');
    setSelectedFilters({});
  };

  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length;
  const showClearAll = !!query || activeFilterCount > 0;

  const filterRows = theme.filters.map((filter) => ({
    ...filter,
    options: facetOptions[filter.key] || [],
    selected: selectedFilters[filter.key] || null,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao início"
        >
          <Text style={styles.icon}>‹</Text>
        </Pressable>
        <Text ref={titleRef} style={styles.title} accessibilityRole="header">
          {theme.copy.galleryTitle}
        </Text>
        <View style={styles.iconBtnPlaceholder} accessible={false} />
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={theme.copy.searchPlaceholder}
          placeholderTextColor={colors.textSoft}
          style={styles.search}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          accessibilityLabel={`Buscar em ${theme.title}`}
          accessibilityHint="Digite parte do nome de um item"
        />
      </View>

      {theme.filters.length > 0 && (
        <View style={styles.filterControls}>
          <Pressable
            onPress={() => setFiltersOpen((v) => !v)}
            style={styles.filterToggle}
            accessibilityRole="button"
            accessibilityLabel={`Filtros${activeFilterCount > 0 ? `, ${activeFilterCount} ${activeFilterCount === 1 ? 'ativo' : 'ativos'}` : ''}`}
            accessibilityHint={filtersOpen ? 'Recolhe as opções de filtro' : 'Expande as opções de filtro'}
            accessibilityState={{ expanded: filtersOpen }}
          >
            <View style={styles.filterToggleLeft}>
              <Text style={styles.filterToggleLabel}>Filtros</Text>
              {activeFilterCount > 0 && (
                <Text style={styles.filterToggleBadge}>
                  ({activeFilterCount} {activeFilterCount === 1 ? 'ativo' : 'ativos'})
                </Text>
              )}
            </View>
            <Text style={styles.filterToggleChevron}>{filtersOpen ? '▾' : '▸'}</Text>
          </Pressable>
          {activeFilterCount > 0 && !filtersOpen && (
            <Pressable
              onPress={clearAll}
              style={styles.filterToggleClear}
              accessibilityRole="button"
              accessibilityLabel="Limpar todos os filtros"
            >
              <Text style={styles.filterToggleClearText}>✕ limpar</Text>
            </Pressable>
          )}
        </View>
      )}

      {filtersOpen && (
        <FilterChips
          rows={filterRows}
          onSelect={handleSelect}
          onClearAll={clearAll}
          showClearAll={showClearAll}
        />
      )}

      <Text style={styles.resultsSummary} accessibilityLiveRegion="polite">
        {filtered.length} {filtered.length === 1 ? 'item encontrado' : 'itens encontrados'}
      </Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>{theme.copy.emptySearch}</Text>
        ) : (
          filtered.map((item) => (
            <GalleryTile
              key={item.id}
              item={item}
              size={tileSize}
              onPress={() => onSelectItem(item.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + SAFE_AREA.paddingTop,
    paddingBottom: spacing.sm,
    zIndex: 10,
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
  title: {
    flex: 1,
    flexShrink: 1,
    paddingHorizontal: spacing.sm,
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 1,
    textAlign: 'center',
  },
  iconBtnPlaceholder: { width: 48, height: 48 },
  searchWrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  filterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  filterToggle: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  filterToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterToggleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterToggleBadge: {
    fontSize: 12,
    color: colors.textSoft,
    marginLeft: 6,
  },
  filterToggleChevron: {
    fontSize: 14,
    color: colors.textSoft,
    marginLeft: spacing.sm,
  },
  filterToggleClear: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  filterToggleClearText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.cardBackEdge,
    ...shadow,
  },
  resultsSummary: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    textAlign: 'right',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: HORIZONTAL_PADDING - TILE_MARGIN,
    paddingBottom: spacing.lg + SAFE_AREA.paddingBottom,
  },
  empty: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: spacing.xl,
    color: colors.textSoft,
    fontStyle: 'italic',
  },
});
