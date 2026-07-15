import { MIRACLE_ITEMS } from './items';

export const miraclesTheme = {
  id: 'miracles',
  title: 'Milagres de Jesus',
  displayTitle: 'dos Milagres de Jesus',
  subtitle: 'Descubra os sinais de amor e esperança!',
  description: 'Conheça encontros que revelam a compaixão e o poder de Jesus.',
  coverGlyph: '✨',
  items: MIRACLE_ITEMS,
  copy: {
    galleryButton: '✦ Galeria dos Milagres',
    galleryTitle: '✦ Galeria dos Milagres',
    searchPlaceholder: 'Buscar milagre…',
    emptySearch: 'Nenhum milagre encontrado.',
    profileStoryTitle: '✦ O QUE ACONTECEU?',
    factTitle: 'O que este sinal revela?',
    resultSectionTitle: 'Conheça este milagre',
  },
  filters: [
    { key: 'miracleType', label: 'Tipo' },
    { key: 'gospel', label: 'Evangelho' },
    { key: 'teaching', label: 'Mensagem' },
  ],
  profile: {
    metaFields: [
      { key: 'miracleType', label: 'Tipo' },
      { key: 'gospel', label: 'Evangelho' },
      { key: 'teaching', label: 'Mensagem' },
    ],
    tagField: { key: 'references', label: '✦ LEIA NA BÍBLIA' },
  },
  appearance: {
    cardBackGlyph: '✨',
  },
  completion: {
    kicker: '🎉 Sinais descobertos! 🎉',
    title: 'Você conheceu os Milagres de Jesus!',
    message:
      'Os sinais de Jesus revelam sua compaixão, convidam à confiança e anunciam vida nova. Este foi o último milagre encontrado:',
    sectionTitle: () => 'O que este sinal revela?',
    sectionText: (item) => item.fact,
    finalMessage: () =>
      'Continue caminhando com Jesus e levando esperança a quem encontrar! ✨',
  },
};
