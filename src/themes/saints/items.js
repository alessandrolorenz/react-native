import { SAINTS } from '../../data/saints';

// Keep the existing content file as the editorial source of truth while the
// game consumes one theme-neutral item shape.
export const SAINT_ITEMS = SAINTS.map((saint) => ({
  id: saint.id,
  name: saint.name,
  shortDescription: saint.short_description,
  story: saint.story,
  fact: saint.fact,
  emoji: saint.emoji,
  image: saint.image,
  metadata: {
    feastDay: saint.feast_day,
    patronage: saint.patronage,
    region: saint.region,
    category: saint.category,
    era: saint.era,
  },
}));
