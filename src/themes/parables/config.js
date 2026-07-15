import { PARABLE_ITEMS } from './items';

export const parablesTheme = {
  id: 'parables',
  title: 'Parábolas de Jesus',
  displayTitle: 'das Parábolas de Jesus',
  subtitle: 'Descubra as histórias que Jesus contou!',
  description: 'Encontre ensinamentos sobre o Reino, a misericórdia e o amor.',
  coverGlyph: '🌱',
  items: PARABLE_ITEMS,
  copy: {
    galleryButton: '✦ Galeria das Parábolas',
    galleryTitle: '✦ Galeria das Parábolas',
    searchPlaceholder: 'Buscar parábola…',
    emptySearch: 'Nenhuma parábola encontrada.',
    profileStoryTitle: '✦ O QUE JESUS ENSINA?',
    factTitle: 'Para recordar',
    resultSectionTitle: 'Conheça esta parábola',
  },
  filters: [
    { key: 'gospel', label: 'Evangelho' },
    { key: 'teaching', label: 'Ensinamento' },
    { key: 'mainElement', label: 'Elemento' },
  ],
  profile: {
    metaFields: [
      { key: 'gospel', label: 'Evangelho' },
      { key: 'teaching', label: 'Ensinamento' },
      { key: 'mainElement', label: 'Elemento' },
    ],
    tagField: { key: 'references', label: '✦ LEIA NA BÍBLIA' },
  },
  appearance: {
    cardBackGlyph: '🌱',
  },
  completion: {
    kicker: '🎉 Ensinamentos descobertos! 🎉',
    title: 'Você conheceu as Parábolas de Jesus!',
    message:
      'As histórias de Jesus nos convidam a amar, confiar e colocar sua Palavra em prática. Esta foi a última parábola encontrada:',
    sectionTitle: () => 'Para recordar',
    sectionText: (item) => item.fact,
    finalMessage: () => 'Continue ouvindo Jesus e fazendo o bem com alegria! ✨',
  },
};
