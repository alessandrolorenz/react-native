import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SAINTS } from '../data/saints';
import SaintTile from '../components/SaintTile';
import FilterChips from '../components/FilterChips';
import { applyFilters, getDistinctValues } from '../utils/saintFilters';
import { colors, radii, shadow, spacing } from '../theme/colors';

const COLUMNS = 2;
const HORIZONTAL_PADDING = spacing.md;
const TILE_MARGIN = 4;

// Browsable codex of all saints. Search by name + filter by category / region /
// era. Tapping a tile pushes the profile screen via the parent App.js.
export default function GalleryScreen({ onBack, onSelectSaint }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [region, setRegion] = useState(null);
  const [era, setEra] = useState(null);

  const { width } = Dimensions.get('window');
  const tileSize =
    Math.floor((width - HORIZONTAL_PADDING * 2) / COLUMNS) - TILE_MARGIN * 2;

  // Saints are static at runtime — derive distinct facet values once.
  const facetOptions = useMemo(
    () => ({
      category: getDistinctValues(SAINTS, 'category'),
      region: getDistinctValues(SAINTS, 'region'),
      era: getDistinctValues(SAINTS, 'era'),
    }),
    [],
  );

  const filtered = useMemo(
    () => applyFilters(SAINTS, { query, category, region, era }),
    [query, category, region, era],
  );

  const handleSelect = (key, value) => {
    if (key === 'category') setCategory(value);
    else if (key === 'region') setRegion(value);
    else if (key === 'era') setEra(value);
  };

  const clearAll = () => {
    setQuery('');
    setCategory(null);
    setRegion(null);
    setEra(null);
  };

  const showClearAll = !!(query || category || region || era);

  const filterRows = [
    { key: 'category', label: 'Categoria', options: facetOptions.category, selected: category },
    { key: 'region', label: 'Região', options: facetOptions.region, selected: region },
    { key: 'era', label: 'Época', options: facetOptions.era, selected: era },
  ];

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.iconBtn} accessibilityLabel="Voltar">
          <Text style={styles.icon}>‹</Text>
        </Pressable>
        <Text style={styles.title}>✦ Galeria</Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar santo…"
          placeholderTextColor={colors.textSoft}
          style={styles.search}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      <FilterChips
        rows={filterRows}
        onSelect={handleSelect}
        onClearAll={clearAll}
        showClearAll={showClearAll}
      />

      <ScrollView contentContainerStyle={styles.grid}>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>Nenhum santo encontrado.</Text>
        ) : (
          filtered.map((saint) => (
            <SaintTile
              key={saint.id}
              saint={saint}
              size={tileSize}
              onPress={() => onSelectSaint(saint.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
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
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 1,
  },
  searchWrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: HORIZONTAL_PADDING - TILE_MARGIN,
    paddingBottom: spacing.lg,
  },
  empty: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: spacing.xl,
    color: colors.textSoft,
    fontStyle: 'italic',
  },
});
