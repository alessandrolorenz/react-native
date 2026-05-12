// Barrel export — new code imports from '../theme' (folder).
// Legacy code keeps importing from '../theme/colors' (shim, flat API).
//
//   New:    import { colors, spacing, textVariants, elevation } from '../theme';
//           // colors.bg.app, colors.text.primary, colors.action.primary
//   Legacy: import { colors, spacing, radii, shadow } from '../theme/colors';
//           // colors.bg, colors.text, colors.primary

export { palette } from './palette';
export { colors } from './semantic';
export {
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textVariants,
} from './typography';
export { spacing } from './spacing';
export { radii } from './radii';
export { elevation } from './elevation';
export { duration, easing } from './motion';
