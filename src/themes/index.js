import { saintsTheme } from './saints/config';
import { symbolsTheme } from './symbols/config';
import { biblicalPlacesTheme } from './biblical-places/config';
import { parablesTheme } from './parables/config';
import { miraclesTheme } from './miracles/config';

export const THEMES = [
  saintsTheme,
  symbolsTheme,
  biblicalPlacesTheme,
  parablesTheme,
  miraclesTheme,
];
export const DEFAULT_THEME_ID = saintsTheme.id;

export function getThemeById(themeId) {
  return THEMES.find((theme) => theme.id === themeId) || saintsTheme;
}

export function validateTheme(theme, phases) {
  const errors = [];
  if (!theme?.id) errors.push('Tema sem id.');
  if (!Array.isArray(theme?.items)) errors.push(`Tema ${theme?.id || ''} sem itens.`);

  const itemIds = new Set();
  (theme?.items || []).forEach((item) => {
    if (!item.id) errors.push(`Item sem id no tema ${theme.id}.`);
    if (itemIds.has(item.id)) errors.push(`Item duplicado: ${item.id}.`);
    itemIds.add(item.id);
    if (!item.name) errors.push(`Item ${item.id || '(sem id)'} sem nome.`);
    if (!item.image && !item.visual?.glyph && !item.emoji) {
      errors.push(`Item ${item.id || '(sem id)'} sem representação visual.`);
    }
  });

  const largestPhase = Math.max(...phases.map((phase) => phase.pairs));
  if ((theme?.items?.length || 0) < largestPhase) {
    errors.push(
      `Tema ${theme?.id || ''} precisa de ${largestPhase} itens e possui ${theme?.items?.length || 0}.`,
    );
  }
  return errors;
}
