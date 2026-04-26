# Jogo da Memória dos Santos

A child-friendly Catholic memory game built with **React Native + Expo**.

Players flip cards on a 4×4 grid to match pairs of saints. After all 8 pairs are matched, the app reveals one saint with a short story and fun fact.

## Quick start

```bash
npm install
npx expo start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Or scan the QR code with the **Expo Go** app on your phone

## Project structure

```
JOGO-DOS-SANTOS/
├── App.js                       app entry — screen switcher
├── index.js                     registers root component
├── app.json                     Expo config
├── babel.config.js
├── package.json
├── assets/
│   ├── icon.png                 generated placeholder
│   ├── splash.png               generated placeholder
│   ├── adaptive-icon.png        generated placeholder
│   └── saints/                  generated placeholders + README with style notes
├── scripts/
│   └── generate-placeholders.js one-shot PNG generator (no deps)
└── src/
    ├── components/
    │   ├── Card.js              flip animation, 3 visual states
    │   ├── GameBoard.js         4×4 layout
    │   ├── Header.js            back / restart / move counter
    │   └── ResultModal.js       win screen with saint reveal
    ├── screens/
    │   ├── HomeScreen.js
    │   └── GameScreen.js
    ├── data/
    │   └── saints.js            content — single source of truth
    ├── utils/
    │   ├── shuffle.js
    │   └── deck.js              buildDeck(saints, pairs)
    └── theme/
        └── colors.js            pastel palette, radii, shadow
```

## Replacing the placeholder art

The generated PNGs in `assets/saints/` are simple pastel placeholders so the app runs end-to-end today. Replace each file with a final illustration matching the style notes in `assets/saints/README.md` — same filename, no code changes needed.

To regenerate placeholders (e.g., after deleting a file):

```bash
npm run generate:placeholders
```

## Adding more saints

1. Drop a `<saint-id>.png` into `assets/saints/`.
2. Append an entry to `src/data/saints.js` with the same `id`.
3. Done — the deck builder picks 8 saints at random each round.

## V2 hooks (already scaffolded, not yet wired)

- **Levels** — `GameScreen` accepts a `level`-style prop today only via `PAIRS` constant; expose as a prop and map level → grid size.
- **In-app purchases** — add `locked: true` to a saint and a `usePremium()` hook that gates locked entries inside `buildDeck`.
- **i18n** — saint copy is centralized in `src/data/saints.js`; move strings to `src/data/strings.<locale>.js` to localize.

These are intentionally not implemented in V1 — see the project's plan for scope rationale.

## Tech notes

- Animations use the React Native `Animated` API with `useNativeDriver: true` — no Reanimated/Moti needed for V1, runs smoothly on low-end Android.
- Card components are `React.memo`-wrapped to avoid unnecessary re-renders.
- Game state uses a single `useReducer` to keep transitions atomic and predictable.
- No backend, no auth, no analytics — pure local app.
