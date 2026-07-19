// Raw color palette — hue + shade only, no semantic meaning.
// Semantic aliases live in src/theme/semantic.js and reference these.
// Add a new shade here before referencing it from semantic colors.

export const palette = {
  // Warm creams / golds (background + face-down cards)
  cream100: '#FFF7E6',
  cream200: '#F7EEE2',
  gold200: '#E8C9A0',
  gold500: '#C9A87A',

  // Rose / pink family (primary action)
  rose200: '#F4B6C2',
  rose400: '#E08FA1',
  rose700: '#B04F68',

  // Sky blue (secondary action)
  sky200: '#B5D8E8',

  // Peach (accent / highlight)
  peach200: '#FFD9A8',

  // Sage green (matched state)
  sage200: '#CDE3D2',

  // Phase chip backgrounds (state-coded)
  chipLocked: '#EBDDC8',
  chipUnlocked: '#E8F2F7',
  chipCompleted: '#DFF0DE',

  // Neutrals
  neutral900: '#3F3A36',
  neutral600: '#7A6F66',
  white: '#FFFFFF',

  // Overlays
  overlay45: 'rgba(63, 58, 54, 0.45)',
  heroTint: 'rgba(232, 201, 160, 0.08)',

  // Status
  error500: '#D33F49',
};
