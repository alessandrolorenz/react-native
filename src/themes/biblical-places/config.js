import { BIBLICAL_PLACE_ITEMS } from './items';

export const biblicalPlacesTheme = {
  id: 'biblical-places',
  title: 'Lugares Bíblicos',
  displayTitle: 'dos Lugares Bíblicos',
  subtitle: 'Viaje pelas terras e histórias da Bíblia!',
  description: 'Descubra cidades, montes, rios e caminhos da história da salvação.',
  coverGlyph: '🗺️',
  items: BIBLICAL_PLACE_ITEMS,
  copy: {
    galleryButton: '✦ Galeria dos Lugares',
    galleryTitle: '✦ Galeria dos Lugares',
    searchPlaceholder: 'Buscar lugar…',
    emptySearch: 'Nenhum lugar encontrado.',
    profileStoryTitle: '✦ O QUE ACONTECEU AQUI?',
    factTitle: 'Você sabia?',
    resultSectionTitle: 'Conheça este lugar',
  },
  filters: [
    { key: 'period', label: 'Testamento' },
    { key: 'placeType', label: 'Tipo de lugar' },
    { key: 'journey', label: 'Jornada' },
  ],
  profile: {
    metaFields: [
      { key: 'placeType', label: 'Tipo' },
      { key: 'region', label: 'Região bíblica' },
      { key: 'period', label: 'Testamento' },
    ],
    tagField: { key: 'references', label: '✦ LEIA NA BÍBLIA' },
  },
  appearance: {
    cardBackGlyph: '✦',
  },
  completion: {
    kicker: '🎉 Viagem concluída! 🎉',
    title: 'Você percorreu os Lugares Bíblicos!',
    message:
      'Cada lugar guarda a memória de uma parte da história da salvação. Este foi o último lugar encontrado:',
    sectionTitle: () => 'Para recordar',
    sectionText: (item) => item.fact,
    finalMessage: () =>
      'Continue sua viagem pelas páginas da Bíblia e descubra novas histórias de fé! ✨',
  },
};
