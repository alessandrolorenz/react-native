// Semantic color aliases — what a token MEANS, not what it looks like.
// Components should consume these (colors.action.primary) rather than the
// raw palette. Swapping themes (dark mode, level packs) becomes a one-file
// change here without touching component styles.

import { palette } from './palette';

export const colors = {
  bg: {
    app: palette.cream100,
    surface: palette.white,
    surfaceAlt: palette.cream200,
    overlay: palette.overlay45,
    heroTint: palette.heroTint,
  },
  text: {
    primary: palette.neutral900,
    soft: palette.neutral600,
    accent: palette.rose700,
    onPrimary: palette.neutral900,
    onAccent: palette.neutral900,
    onDark: palette.white,
  },
  action: {
    primary: palette.rose200,
    primaryPressed: palette.rose400,
    secondary: palette.sky200,
    accent: palette.peach200,
    disabled: palette.gold200,
  },
  card: {
    back: palette.gold200,
    backEdge: palette.neutral600,
    matched: palette.sage200,
  },
  chip: {
    locked: palette.chipLocked,
    unlocked: palette.chipUnlocked,
    completed: palette.chipCompleted,
    active: palette.peach200,
    activeBorder: palette.rose700,
  },
  status: {
    error: palette.error500,
  },
};
