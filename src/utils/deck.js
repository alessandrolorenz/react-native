import { shuffle } from './shuffle';

// Build a shuffled deck of 2*pairs cards from the saints list.
// Each card carries a unique cardId (for React keys), a matchKey
// (saint id, used to detect pair matches), and the saint payload.
//
// `pairs` defaults to 8 to fill a 4x4 grid. Passing a different value
// makes future levels (3x4 = 6 pairs, 6x6 = 18 pairs, etc.) trivial.
export function buildDeck(saints, pairs = 8) {
  const picked = shuffle(saints).slice(0, pairs);
  const cards = [];
  picked.forEach((saint, i) => {
    cards.push({ cardId: `${saint.id}-a-${i}`, matchKey: saint.id, saint });
    cards.push({ cardId: `${saint.id}-b-${i}`, matchKey: saint.id, saint });
  });
  return shuffle(cards);
}
