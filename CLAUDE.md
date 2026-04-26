# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A React Native + Expo memory game ("Jogo da Memória dos Santos"): 4×4 grid, 8 saint pairs, win screen reveals one saint's story. Pure local app — no backend, auth, or analytics.

## Commands

```bash
npm install                      # install deps
npx expo start                   # dev server (press a=Android, i=iOS, w=web, or scan QR with Expo Go)
npm run android                  # = expo start --android
npm run ios                      # = expo start --ios
npm run web                      # = expo start --web
npm run generate:placeholders    # regenerate pastel PNG placeholders in assets/saints/ (no deps, Node-only)
```

There are no tests, linter, or typechecker configured in this repo.

## Architecture

**Stack**: Expo SDK 55, React 19, React Native 0.83, JavaScript (no TypeScript). Animations use the built-in `Animated` API with `useNativeDriver: true` — no Reanimated.

**Navigation** is plain `useState` in [App.js](App.js) (`'home' | 'game'`), wrapped in a class-component `ErrorBoundary` that surfaces render errors on screen. The README notes this is intentional for V1; swap to `@react-navigation/native` only when V2 grows.

**Game state** lives in a single `useReducer` inside [src/screens/GameScreen.js](src/screens/GameScreen.js). Three actions — `FLIP`, `RESOLVE_MISS`, `RESET` — keep transitions atomic. Key invariants enforced by the reducer:
- `busy: true` after a mismatch locks input until the 700ms flip-back timer fires `RESOLVE_MISS`.
- A card's identity is `cardId` (unique, for React keys); pair detection uses `matchKey` (= saint id).
- `matched` is a `Set<matchKey>`; win condition is `matched.size === PAIRS` (8).

**Deck building** ([src/utils/deck.js](src/utils/deck.js)): `buildDeck(saints, pairs=8)` shuffles saints, takes N, emits 2N cards (a/b for each saint), shuffles again. Passing a different `pairs` value is the seam for future grid sizes (3×4, 6×6).

**Card flip** ([src/components/Card.js](src/components/Card.js)): two absolutely-positioned faces with `backfaceVisibility: 'hidden'`, driven by a single `Animated.Value` interpolated to `rotateY` 0°↔180° on front and 180°↔360° on back. The component is `React.memo`-wrapped with a custom equality check on `isOpen / isMatched / disabled / size / cardId` — touch this comparator carefully when adding props.

**Content** ([src/data/saints.js](src/data/saints.js)) is the single source of truth. Each saint has `id, name, short_description, story[], fact, emoji, image`. Images use `require()` (a mix of `.webp` and `.png` — Metro on Expo SDK 55+ bundles webp natively). The shape is intentionally flat so V2 fields (`audio`, `locked`, `level`) can be added without breaking entries. Adding a saint = drop the image into `assets/saints/` and append an entry; the deck builder picks 8 at random per round.

## Conventions specific to this repo

- **Expo SDK transitive deps must be declared as direct deps** in `package.json` — `expo-asset`, `expo-constants`, `expo-file-system`, `expo-font`, `expo-keep-awake` are listed explicitly to avoid nested-install breakage on npm 10. Don't remove them when "cleaning up unused" deps.
- The placeholder generator script uses **only Node built-ins** (custom PNG encoder via `zlib` + `crc32`). Don't add npm deps to it.
- Card sizing in [GameBoard.js](src/components/GameBoard.js) is computed from `Dimensions.get('window').width` once at render — there is no orientation listener (the app is locked to portrait in [app.json](app.json)).
- V2 hooks scaffolded but **intentionally not wired** in V1: levels (only `PAIRS` constant exists), in-app purchases (no `locked` flag yet), i18n (strings inline in `saints.js`). See README.md "V2 hooks" before implementing.
