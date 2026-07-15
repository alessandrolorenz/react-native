import { shuffle } from './shuffle';

// Build a shuffled deck of 2*pairs cards from a theme item list.
// Each card carries a unique cardId (for React keys), a matchKey
// (item id, used to detect pair matches), and the item payload.
//
// `pairs` defaults to 8 to fill a 4x4 grid. Passing a different value
// makes future levels (3x4 = 6 pairs, 6x6 = 18 pairs, etc.) trivial.
export function buildDeck(items, pairs = 8) {
  if (items.length < pairs) {
    throw new Error(`O tema precisa de ${pairs} itens, mas possui apenas ${items.length}.`);
  }

  const picked = shuffle(items).slice(0, pairs);
  const cards = [];
  picked.forEach((item, i) => {
    cards.push({ cardId: `${item.id}-a-${i}`, matchKey: item.id, item });
    cards.push({ cardId: `${item.id}-b-${i}`, matchKey: item.id, item });
  });
  return shuffle(cards);
}
