// LEGACY SHIM — kept so screens that haven't been migrated still compile.
// New code should import from '../theme' (folder) which exposes the semantic
// nested API (colors.bg.app, colors.action.primary, etc.).
//
// Migration path: when a screen is rewritten to use the new <Button>/<Text>/<Chip>
// primitives from src/components/ui/, switch its import from '../theme/colors'
// to '../theme'. Once every screen is migrated, this file can be deleted.

import { palette } from './palette';
import { elevation } from './elevation';

export const colors = {
  bg: palette.cream100,
  surface: palette.white,
  primary: palette.rose200,
  primaryDark: palette.rose700,
  secondary: palette.sky200,
  accent: palette.peach200,
  cardBack: palette.gold200,
  cardBackEdge: palette.neutral600,
  matched: palette.sage200,
  text: palette.neutral900,
  textSoft: palette.neutral600,
  textOnPrimary: palette.neutral900,
  textOnDark: palette.white,
  overlay: palette.overlay45,
  white: palette.white,
};

export { radii } from './radii';
export { spacing } from './spacing';

export const shadow = elevation.sm;
