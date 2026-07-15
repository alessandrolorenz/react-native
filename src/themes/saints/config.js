import { getPrayerForSaint } from '../../data/prayers';
import { SAINT_ITEMS } from './items';

export const saintsTheme = {
  id: 'saints',
  title: 'Santos',
  displayTitle: 'dos Santos',
  subtitle: 'Aprenda brincando!',
  description: 'Conheça histórias inspiradoras de fé e amor.',
  coverGlyph: '✨',
  items: SAINT_ITEMS,
  copy: {
    galleryButton: '✦ Galeria dos Santos',
    galleryTitle: '✦ Galeria dos Santos',
    searchPlaceholder: 'Buscar santo…',
    emptySearch: 'Nenhum santo encontrado.',
    profileStoryTitle: '✦ HISTÓRIA',
    profileTagTitle: '✦ PADROEIRO DE',
    factTitle: 'Você sabia?',
    resultSectionTitle: 'Conheça sua história',
  },
  filters: [
    { key: 'category', label: 'Categoria' },
    { key: 'region', label: 'Região' },
    { key: 'era', label: 'Época' },
  ],
  profile: {
    metaFields: [
      { key: 'feastDay', label: 'Festa' },
      { key: 'region', label: 'Região' },
      { key: 'era', label: 'Época' },
    ],
    tagField: { key: 'patronage', label: '✦ PADROEIRO DE' },
  },
  appearance: {
    cardBackGlyph: '✦',
  },
  completion: {
    kicker: '🎉 Campanha Concluída! 🎉',
    title: 'Você concluiu todas as fases!',
    message:
      'Visite a Galeria para conhecer mais histórias dos santos. Este foi o último santo que apareceu no seu caminho:',
    sectionTitle: (item) => `Oração a ${item.name}`,
    sectionText: (item) => getPrayerForSaint(item.id),
    finalMessage: (item) =>
      `Que o exemplo e a intercessão de ${item.name} acompanhem você sempre em seu caminho! ✨`,
  },
};
