import { SYMBOL_ITEMS } from './items';

export const symbolsTheme = {
  id: 'symbols',
  title: 'Símbolos da Fé',
  displayTitle: 'dos Símbolos da Fé',
  subtitle: 'Descubra os sinais que contam a nossa fé!',
  description: 'Conheça sinais presentes na Bíblia, na oração e na liturgia.',
  coverGlyph: '✝️',
  items: SYMBOL_ITEMS,
  copy: {
    galleryButton: '✦ Galeria dos Símbolos',
    galleryTitle: '✦ Galeria dos Símbolos',
    searchPlaceholder: 'Buscar símbolo…',
    emptySearch: 'Nenhum símbolo encontrado.',
    profileStoryTitle: '✦ O QUE SIGNIFICA?',
    factTitle: 'Você sabia?',
    resultSectionTitle: 'Conheça seu significado',
  },
  filters: [
    { key: 'category', label: 'Categoria' },
    { key: 'context', label: 'Onde encontramos' },
  ],
  profile: {
    metaFields: [
      { key: 'category', label: 'Categoria' },
      { key: 'context', label: 'Onde encontramos' },
    ],
  },
  appearance: {
    cardBackGlyph: '✦',
  },
  completion: {
    kicker: '🎉 Campanha Concluída! 🎉',
    title: 'Você descobriu os Símbolos da Fé!',
    message:
      'Cada sinal pode nos ajudar a recordar uma parte da fé. Este foi o último símbolo encontrado no seu caminho:',
    sectionTitle: () => 'Para recordar',
    sectionText: (item) => item.fact,
    finalMessage: () =>
      'Continue observando: você encontrará muitos desses sinais na Bíblia, na igreja e nas celebrações! ✨',
  },
};
