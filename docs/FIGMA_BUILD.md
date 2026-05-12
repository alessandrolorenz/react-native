# Figma File Build Guide

Step-by-step blueprint to build the Figma file at <https://www.figma.com/design/vQz10dcNO5vJC69GXH1voT/Untitled> into a usable design-system reference.

Tokens are auto-imported from `design-tokens/tokens-studio.json` (see [../design-tokens/README.md](../design-tokens/README.md)) — this guide covers the **frames and components** you'll build on top of them. Tokens are the source of truth; frames are documentation.

## Pages

Create five pages in this order (rename the default "Page 1" to "Cover"):

1. **Cover**
2. **1 · Foundations**
3. **2 · Components**
4. **3 · Screens**
5. **🗃 Archive** (optional, for retired designs)

## Page 1 — Cover

Single frame, 1440×900. Centered:

- Title: `Jogo dos Santos — Design System` (Heading 1, `color/text/primary`)
- Subtitle: `Starter v0.1`
- Tag row of chips: `React Native`, `Expo SDK 55`, `Light mode only`
- Footer: `Last updated <YYYY-MM-DD>` + link to the GitHub repo

## Page 2 — Foundations

One frame per topic, stacked vertically with `spacing/xl` (32px) gap.

### 2.1 Color

Two sections side by side:

**Palette** — 18 swatches in a 4-column grid (rectangles 120×120, label below):
- Row 1 (creams/gold): `cream/100`, `cream/200`, `gold/200`, `gold/500`
- Row 2 (rose/sky/peach): `rose/200`, `rose/400`, `sky/200`, `peach/200`
- Row 3 (state): `sage/200`, `chip/locked`, `chip/unlocked`, `chip/completed`
- Row 4 (neutrals/status): `neutral/900`, `neutral/600`, `white`, `error/500`
- Row 5 (overlays): `overlay/45`, `heroTint`

**Semantic** — 22 swatches grouped by namespace:
- `bg/*` — app, surface, surfaceAlt, overlay, heroTint
- `text/*` — primary, soft, onPrimary, onAccent
- `action/*` — primary, primaryPressed, secondary, accent, disabled
- `card/*` — back, backEdge, matched
- `chip/*` — locked, unlocked, completed, active, activeBorder
- `status/*` — error

Each swatch shows the resolved hex AND the alias (e.g. `action/primary → rose/200`).

### 2.2 Typography

Frame showing all 7 text variants, each rendered with sample copy:

| Variant | Sample | Spec |
|---|---|---|
| `display` | Jogo da Memória | 34/40, weight 800 |
| `h1` | Pontuação total | 24/32, weight 800 |
| `h2` | ✦ Galeria dos Santos | 20/24, weight 800 |
| `body` | Aprenda brincando! | 13/20, weight 600 |
| `caption` | Para crianças e famílias 💛 | 11/16, weight 600 |
| `label` | CATEGORIA | 10/16, weight 700, +1 letter-spacing, uppercase |
| `cta` | Jogar Fases | 20/24, weight 800, +1 letter-spacing |

### 2.3 Spacing

Visual rulers (Auto Layout frames with gap = scale value, label below):
`xxs:2`, `xs:4`, `sm:8`, `md:16`, `lg:24`, `xl:32`, `xxl:48`.

### 2.4 Radii

Six rounded squares (120×120) showing: `xs:4`, `sm:8`, `nested:12`, `md:16`, `lg:24`, `pill:999`.

### 2.5 Elevation

Three swatch cards (surface color, 200×120) with `elevation.sm` / `md` / `lg` applied. Label each with the y-offset/blur values.

### 2.6 Motion

Text table only (motion is hard to show in a static Figma frame):
- `duration.fast` — 180 ms (button press feedback)
- `duration.base` — 280 ms (card flip)
- `duration.slow` — 420 ms (modal entry)
- `duration.missDelay` — 700 ms (memory miss timer — game mechanic, not transition)

## Page 3 — Components

Build these as **Component Sets** (variants), one frame per family.

### 3.1 Button

Component Set: `Button`. Variants:
- `variant` — `primary` / `secondary` / `tertiary` / `icon`
- `size` — `sm` / `md` / `lg` (only for non-icon)
- `state` — `default` / `pressed` / `disabled`

Anatomy per variant (non-icon):
- Auto Layout horizontal, centered.
- Fill: `action/<variant>`
- Corner radius: `radius/lg` (24)
- Padding vertical: `spacing/sm` (sm), `spacing/md` (md), `spacing/md + spacing/xs` (lg)
- Padding horizontal: `spacing/md` (sm), `spacing/lg` (md, lg)
- Text: variant `cta`, color `text/onPrimary` (primary/secondary) or `text/onAccent` (tertiary)
- Drop shadow: `elevation.sm`

Anatomy `icon`:
- 44×44 circle, `bg/surface`, `radius/pill`, `elevation.sm`, glyph centered.

### 3.2 Chip

Component Set: `Chip`. Variants:
- `variant` — `filter` / `phase` / `stat` / `meta`
- `state` — `default` / `active` / `locked` / `unlocked` / `completed`

Build the matrix of variant × state per the resolution table in `src/components/ui/Chip.js`. Each variant has a distinct geometry (pill vs md radius) — separate the variants horizontally, states vertically.

### 3.3 Card

Component Set: `Card`. Variants:
- `variant` — `surface` / `alt`
- `shadow` — `none` / `sm` / `md` / `lg`

Default size 320×120 with placeholder children.

### 3.4 Memory Card (specialized — not a primitive)

Component Set: `MemoryCard`. Variants:
- `face` — `back` / `front` / `matched`

Back face:
- 80×80, `card/back` fill, `card/backEdge` 2px border, `radius/md`.
- Inner frame: 70% size, dashed 2px border `card/backEdge`, `radius/md`.
- Center glyph `✦`, fontSize 28, `white` 85% opacity.

Front face: image fill + emoji badge (white pill, radius pill, padding 6/2) bottom-right.
Matched: front face + 2px `card/matched` border.

### 3.5 SaintTile

200×220 frame:
- Image area 200×200 (white bg, `card/backEdge` 1px border, `radius/md`, `elevation.sm`).
- Caption: `body` text, 13/16, soft color, centered, marginTop 8.

### 3.6 Header (game stats bar)

Composition (not a single component — document as a frame):
- Icon button left (`Button/icon`) + Title center (`h2` text, `action/primaryPressed` color, subtitle `caption` soft) + Icon button right.
- Row of 5 stat pills (`Chip/stat`) below.

### 3.7 Text specimen

Specimen frame: one big text block per variant from §2.2, with the variant name as a tag chip beside it.

## Page 4 — Screens

Three frames, 390×844 (iPhone 14 Pro frame). Compose each from the components above:

### 4.1 Home
- `bg/app` background.
- Hero: ✨ emoji (56px) + display "Jogo da Memória" (text/primary) + display "dos Santos" (action/primaryPressed) + body italic "Aprenda brincando!" (text/soft).
- Two `Button/lg` (secondary "✦ Galeria dos Santos", primary "Jogar Fases"), full width, gap `spacing/md`.
- Caption footer: "Para crianças e famílias 💛".

### 4.2 Game
- Header (icon back / title / icon settings).
- 5 stat pills row.
- 4 phase chips row (`Chip/phase` — F1 active, F2/F3/F4 unlocked/locked).
- 4×4 grid of `MemoryCard/back`.

### 4.3 Gallery
- Header (icon back / title "✦ Galeria" / icon settings).
- Search input (`Card/surface` shadow sm, body text "Buscar santo…" soft).
- CONQUISTAS card (`Card/surface`, label "CONQUISTAS", h2 accent "Pontuação total: 0", caption soft "Fases concluídas: 0/4").
- Three filter rows (CATEGORIA / REGIÃO / ÉPOCA) — label above, horizontal scroll of `Chip/filter`.
- 2-col grid of `SaintTile`.

Annotate each layer in the frame with the token name (Figma's "Add comment" or arrow-with-label). This makes the screens self-documenting: a reader sees `bg/app`, `action/primary`, `spacing/md` written on the design.

## Naming convention

Match the codebase verbatim. Component names use PascalCase; variant/state values use camelCase; token paths use `slash/separated/lowercase` (e.g. `action/primaryPressed`). This makes Find-and-Replace round-trips between code and design symmetric.

## After you build it

1. Publish the Figma file as a **library** (right-click file → Publish library) so other Figma files can consume the components and styles.
2. Add a link from this repo's `README.md` to the Figma URL.
3. When you change a token in code, regenerate `design-tokens/tokens-studio.json` and re-import via the plugin — styles update in place if the names match.
