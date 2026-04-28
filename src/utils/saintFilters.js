// Pure helpers for the Saints Gallery screen.
// Mirror the convention in deck.js — no React, no side effects, just data in/out.

// Distinct non-empty values for a given field across the saints list.
// Used to derive filter chip options dynamically from the data.
export function getDistinctValues(saints, key) {
  const seen = new Set();
  saints.forEach((s) => {
    const value = s[key];
    if (typeof value === 'string' && value !== '') {
      seen.add(value);
    }
  });
  return Array.from(seen).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

// Filter saints by a free-text query (matched against name, case-insensitive)
// and up to three exact-match facets. When a facet is active, saints with an
// empty value for that field are excluded — this hides incomplete stub entries
// from filtered views but lets them appear in the unfiltered grid.
export function applyFilters(saints, { query, category, region, era }) {
  const q = (query || '').trim().toLowerCase();

  return saints.filter((s) => {
    if (q && !s.name.toLowerCase().includes(q)) return false;
    if (category && s.category !== category) return false;
    if (region && s.region !== region) return false;
    if (era && s.era !== era) return false;
    return true;
  });
}
