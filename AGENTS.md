# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project

A React Native + Expo memory game ("Jogo da Memória dos Santos"): a 4-phase campaign (4×4 → 5×4 → 6×4 → 7×4 grids) where each phase reveals one saint's story on win, and a final "campaign complete" screen with the saint's prayer. Pure local app — no backend, auth, or analytics.

## Commands

```bash
npm install                      # install deps
npx expo start                   # dev server (a=Android, i=iOS, w=web, or scan QR with Expo Go)
npm run android                  # = expo start --android
npm run ios                      # = expo start --ios
npm run web                      # = expo start --web
npm run generate:placeholders    # regenerate pastel PNG placeholders in assets/saints/ (Node built-ins only)
```

There are no tests, linter, or typechecker configured. Deploy/release notes (EAS builds, version bumps) live in [docs/DEPLOY.md](docs/DEPLOY.md).

## Architecture

**Stack**: Expo SDK 55, React 19, React Native 0.83, JavaScript (no TypeScript). Animations use the built-in `Animated` API with `useNativeDriver: true` — no Reanimated.

**Navigation** is plain `useState` in [App.js](App.js) — four screens (`'home' | 'game' | 'gallery' | 'profile'`) plus a `selectedSaintId` slot for the Gallery→Profile push. Everything is wrapped in a class-component `ErrorBoundary` that surfaces render errors on screen. The README notes this is intentional for V1; swap to `@react-navigation/native` only when V2 grows. Screens are decoupled — each takes plain callback props (`onBack`, `onOpenGallery`, `onSelectSaint`) so the eventual navigator swap won't touch screen internals.

**Campaign progress** lives in `App.js` as a single `progress` state object: `{ unlockedPhase, completedPhases, totalScore }`. `completedPhases[phaseId]` records `bestScore / bestCombo / bestAccuracy / bestTimeSeconds / lastSummary` — every win merges in *bests* (max of score/combo/accuracy, min of time), never overwrites. `handlePhaseComplete` is passed into `GameScreen` as `onPhaseComplete(summary)`; it also derives `unlockedPhase` and re-totals `totalScore` from the merged bests. There is no persistence yet — progress resets on app restart.

**Phases** ([src/data/phases.js](src/data/phases.js)) define the campaign: an array of `{ id, rows, cols, cards, pairs, label }`. This is the level seam — adding a phase = appending an entry. The reducer reads `pairs` from the active phase to build the deck and decide the win condition. The legacy `PAIRS=8` constant from V1 has been replaced by `activePhase.pairs`.

**Game state** lives in a single `useReducer` inside [src/screens/GameScreen.js](src/screens/GameScreen.js). Three actions — `START_PHASE`, `FLIP`, `RESOLVE_MISS` — keep transitions atomic. `START_PHASE` is dispatched both on phase change and on "play again" (it replaces the old `RESET`). Key invariants enforced by the reducer:
- `busy: true` after a mismatch locks input until the 700ms flip-back timer fires `RESOLVE_MISS`.
- A card's identity is `cardId` (unique, for React keys); pair detection uses `matchKey` (= saint id).
- `matched` is a `Set<matchKey>`; win condition is `matched.size === action.phasePairs` (the active phase's `pairs`, passed in with every `FLIP`).
- Scoring fields live in the same reducer: `attempts`, `comboStreak` (consecutive matches, reset on miss), `bestCombo`, `phasePoints`, `startedAtMs`, `completedAtMs`, `lastMatchedSaint`, `isWon`. Match-time scoring uses `getMatchScore(comboStreak)` and `applyMissPenalty(phasePoints)` from `utils/scoring`.
- The `phaseSummary` (and the `onPhaseComplete` callback) is fired exactly once per win via a `reportedSummaryRef` keyed on `phaseId + totalPoints + elapsedSeconds + startedAtMs` — re-renders after the win don't re-report.

**Scoring** ([src/utils/scoring.js](src/utils/scoring.js)) is pure and standalone. `getMatchScore(combo)` = 120 + (combo−1)×25; misses subtract 25 (floored at 0). On win, `buildPhaseSummary` adds a phase-completion bonus (`200 + phaseId×140`) then multiplies by a time-based multiplier vs. `phaseTargetSeconds` (1.4×, 1.2×, 1×, 0.85× tiers). Tuning thresholds is a single-file change here.

**Deck building** ([src/utils/deck.js](src/utils/deck.js)): `buildDeck(saints, pairs)` shuffles saints, takes N, emits 2N cards (a/b for each saint), shuffles again. Called with the active phase's `pairs`.

**Card flip** ([src/components/Card.js](src/components/Card.js)): two absolutely-positioned faces with `backfaceVisibility: 'hidden'`, driven by a single `Animated.Value` interpolated to `rotateY` 0°↔180° on front and 180°↔360° on back. The component is `React.memo`-wrapped with a custom equality check on `isOpen / isMatched / disabled / size / cardId` — touch this comparator carefully when adding props.

**Win flows** — two modals, mutually exclusive:
- [src/components/ResultModal.js](src/components/ResultModal.js) — shown after any non-final phase win. CTAs: next phase, play again, back home.
- [src/components/CampaignCompleteModal.js](src/components/CampaignCompleteModal.js) — shown only on the final phase win. Displays the matched saint's prayer (from [src/data/prayers.js](src/data/prayers.js), looked up by saint id via `getPrayerForSaint`) and the campaign total score. The `totalScore` shown is computed in `GameScreen` to include the current win even before `progress` re-renders, so the user sees the final number on the first frame.

**Gallery subsystem**:
- [src/screens/GalleryScreen.js](src/screens/GalleryScreen.js) — 2-column grid of every saint. Free-text name search + three exact-match facets (`category`, `region`, `era`). Tile size is computed from `Dimensions.get('window').width` once at render (same convention as `GameBoard.js`). Facet options are derived from the data via `useMemo` — `SAINTS` is static at runtime, so distinct values are computed once.
- [src/screens/SaintProfileScreen.js](src/screens/SaintProfileScreen.js) — full-screen profile pushed from the gallery.
- [src/components/SaintTile.js](src/components/SaintTile.js), [src/components/FilterChips.js](src/components/FilterChips.js) — presentational pieces of the gallery screen.
- [src/utils/saintFilters.js](src/utils/saintFilters.js) — pure helpers (`getDistinctValues`, `applyFilters`). Same no-React/no-side-effects convention as `deck.js`. When a facet is active, saints with an empty value for that field are excluded, so stub entries hide from filtered views but still appear in the unfiltered grid.

**Content** ([src/data/saints.js](src/data/saints.js)) is the single source of truth. Each saint has `id, name, short_description, story[], fact, emoji, image` plus gallery metadata: `feast_day` (string), `patronage` (string[]), `region` (string), `category` (one of: `Religioso | Mártir | Doutor da Igreja | Mariana | Leigo`), `era` (one of: `Antiguidade | Idade Média | Idade Moderna | Século XX | Século XXI`). Images use `require()` (a mix of `.webp` and `.png` — Metro on Expo SDK 55+ bundles webp natively). The shape is intentionally flat so further V2 fields (`audio`, `locked`, `level`) can be added without breaking entries. Empty strings / empty arrays in the metadata are intentional — they're skipped by Gallery's filter logic and Profile's meta pills, so stub entries degrade gracefully until content is filled in. Adding a saint = drop the image into `assets/saints/`, append an entry, and (optionally) add a prayer in `prayers.js` keyed by the same id.

## Design system (mid-migration)

Two parallel import paths intentionally coexist — see [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) for the full surface:

- **New code** → `import { colors, spacing, radii, elevation, textVariants } from '../theme'` (the folder barrel `src/theme/index.js`). `colors` is the nested *semantic* API: `colors.bg.app`, `colors.action.primary`, `colors.text.soft`, `colors.chip.unlocked`, etc.
- **Legacy code** → `import { colors, radii, shadow, spacing } from '../theme/colors'` — flat shim with the old V1 keys (`colors.bg`, `colors.primary`, `colors.text`, `colors.textSoft`). The shim still works; do not break it until every screen is migrated.

`src/theme/` files: `palette.js` (raw hex) → `semantic.js` (aliases) → `typography.js / spacing.js / radii.js / elevation.js / motion.js` → `index.js` (barrel). `colors.js` is the legacy shim only.

Primitives live in [src/components/ui/](src/components/ui/) — `Button`, `Text`, `Card`, `Chip`, exported via `src/components/ui/index.js`. Currently only `HomeScreen` is migrated; `GameScreen`, `GalleryScreen`, `SaintProfileScreen`, `Header`, and both modals still use the legacy shim and inline styles. When migrating a screen, follow the steps in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md#migration-guide--screens-not-yet-on-the-new-system).

Tokens are mirrored for Figma in [design-tokens/](design-tokens/) (`tokens-studio.json` for the Tokens Studio plugin; `figma-variables.json` for the Enterprise REST API). Figma file structure is documented in [docs/FIGMA_BUILD.md](docs/FIGMA_BUILD.md). Keep `design-tokens/` in sync when changing `palette.js` / `semantic.js` / `spacing.js` / `radii.js` / `typography.js`.

## Conventions specific to this repo

- **Expo SDK transitive deps must be declared as direct deps** in `package.json` — `expo-asset`, `expo-constants`, `expo-file-system`, `expo-font`, `expo-keep-awake` are listed explicitly to avoid nested-install breakage on npm 10. Don't remove them when "cleaning up unused" deps.
- The placeholder generator script uses **only Node built-ins** (custom PNG encoder via `zlib` + `crc32`). Don't add npm deps to it.
- Card sizing in [src/components/GameBoard.js](src/components/GameBoard.js) is computed from `Dimensions.get('window').width` once at render — there is no orientation listener (the app is locked to portrait in [app.json](app.json)).
- **Safe-area handling** is centralized in [src/utils/safeArea.js](src/utils/safeArea.js) as a `SAFE_AREA` object (`paddingTop`, `paddingBottom`) consumed by each screen's outer container. Don't hardcode notch/home-indicator padding inline; adjust the constants.
- **Reuse the design tokens** (`colors`, `spacing`, `radii`, `elevation`, `textVariants`) instead of inlining hex codes or magic numbers. New code prefers the nested API from `../theme`; legacy screens may keep the flat shim until migrated.
- V2 hooks scaffolded but **intentionally not wired** in V1: in-app purchases (no `locked` flag yet), i18n (strings inline in `saints.js`), persistence (progress lives in memory only). See README.md "V2 hooks" before implementing.
