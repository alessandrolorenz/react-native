// Soft pastel palette tuned for a child-friendly Catholic memory game.
// Centralizing tokens here keeps the visual language consistent across screens
// and makes future theming (dark mode, level packs) a single-file change.

export const colors = {
  bg: '#FFF7E6',         // warm cream background
  surface: '#FFFFFF',
  primary: '#F4B6C2',    // rose - main CTAs
  primaryDark: '#E08FA1',
  secondary: '#B5D8E8',  // sky blue - accents
  accent: '#FFD9A8',     // peach - highlights
  cardBack: '#E8C9A0',   // warm gold for face-down cards
  cardBackEdge: '#C9A87A',
  matched: '#CDE3D2',    // soft sage - matched card tint
  text: '#3F3A36',
  textSoft: '#7A6F66',
  textOnPrimary: '#FFFFFF',
  overlay: 'rgba(63, 58, 54, 0.45)',
  white: '#FFFFFF',
};

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// React Native shadow preset (works on iOS via shadow*, on Android via elevation).
export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};
