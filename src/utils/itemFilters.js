function getMetadataValue(item, key) {
  return item.metadata?.[key];
}

export function getDistinctValues(items, key) {
  const seen = new Set();
  items.forEach((item) => {
    const value = getMetadataValue(item, key);
    if (typeof value === 'string' && value !== '') seen.add(value);
  });
  return Array.from(seen).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function applyFilters(items, query, selectedFilters) {
  const normalizedQuery = (query || '').trim().toLocaleLowerCase('pt-BR');

  return items.filter((item) => {
    if (normalizedQuery && !item.name.toLocaleLowerCase('pt-BR').includes(normalizedQuery)) {
      return false;
    }

    return Object.entries(selectedFilters).every(([key, selected]) => {
      if (!selected) return true;
      const value = getMetadataValue(item, key);
      if (Array.isArray(value)) return value.includes(selected);
      return value === selected;
    });
  });
}
