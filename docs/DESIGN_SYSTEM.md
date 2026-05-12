# Design System — Jogo dos Santos

Starter design system: tokens under `src/theme/`, primitives under `src/components/ui/`. This doc covers the API and the migration path for the remaining screens.

## Token surface

Two import paths, intentionally:

- **New code** → `import { ... } from '../theme'` — nested semantic API.
- **Legacy code** (not yet migrated) → `import { colors, radii, spacing, shadow } from '../theme/colors'` — flat shim, unchanged behavior.

```js
// New code
import { colors, spacing, radii, elevation, textVariants, fontSize, duration } from '../theme';

colors.bg.app              // → '#FFF7E6'
colors.action.primary      // → '#F4B6C2'
colors.text.soft           // → '#7A6F66'
colors.chip.unlocked       // → '#E8F2F7'

spacing.md                 // → 16
radii.lg                   // → 24
elevation.sm               // → { shadowColor, shadowOpacity, ... }
textVariants.cta           // → { fontSize: 20, fontWeight: '800', letterSpacing: 1 }
duration.base              // → 280
```

### Files

| File | Exports |
|---|---|
| `src/theme/palette.js` | `palette` (raw hex) |
| `src/theme/semantic.js` | `colors` (nested aliases) |
| `src/theme/typography.js` | `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `textVariants` |
| `src/theme/spacing.js` | `spacing` |
| `src/theme/radii.js` | `radii` |
| `src/theme/elevation.js` | `elevation` (scale: none / sm / md / lg) |
| `src/theme/motion.js` | `duration`, `easing` |
| `src/theme/index.js` | barrel — import everything from here |
| `src/theme/colors.js` | **legacy shim** — flat API for unmigrated screens |

## Primitives

```js
import { Button, Text, Card, Chip } from '../components/ui';
```

### `<Button>`

```jsx
<Button variant="primary" size="lg" fullWidth onPress={onPlay}>Jogar Fases</Button>
<Button variant="secondary" size="lg" fullWidth onPress={onOpenGallery}>✦ Galeria</Button>
<Button variant="icon" onPress={onBack} accessibilityLabel="Voltar">‹</Button>
```

| Prop | Type | Default |
|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'icon'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` (ignored for icon) | `'lg'` |
| `fullWidth` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `accessibilityLabel` | `string` | — |

### `<Text>`

```jsx
<Text variant="display" color="primary">Jogo da Memória</Text>
<Text variant="display" color="accent">dos Santos</Text>
<Text variant="body" color="soft" italic>Aprenda brincando!</Text>
<Text variant="caption" color="soft" align="center">Para crianças e famílias 💛</Text>
```

| Prop | Type | Default |
|---|---|---|
| `variant` | `'display' \| 'h1' \| 'h2' \| 'body' \| 'caption' \| 'label' \| 'cta'` | `'body'` |
| `color` | `'primary' \| 'soft' \| 'onPrimary' \| 'onAccent' \| 'accent' \| 'error'` or raw hex | `'primary'` |
| `align` | `'auto' \| 'left' \| 'right' \| 'center'` | — |
| `italic` | `boolean` | `false` |

### `<Card>`

```jsx
<Card padding="md" radius="lg" shadow="sm">
  <Text variant="h2">Pontuação total: 0</Text>
  <Text variant="caption">Fases concluídas: 0/4</Text>
</Card>
```

| Prop | Type | Default |
|---|---|---|
| `variant` | `'surface' \| 'alt'` | `'surface'` |
| `padding` | spacing key or number | `'md'` |
| `radius` | radii key or number | `'lg'` |
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'sm'` |

### `<Chip>`

```jsx
<Chip variant="filter" state={selected === 'Mariana' ? 'active' : 'default'}
      label="Mariana" onPress={() => setSelected('Mariana')} />

<Chip variant="phase" state="completed" label="F1" sublabel="4x4" />

<Chip variant="stat" label="TOTAL" sublabel="0" />
```

| Prop | Type | Notes |
|---|---|---|
| `variant` | `'filter' \| 'phase' \| 'stat' \| 'meta'` | Picks the geometry + state palette |
| `state` | `'default' \| 'active' \| 'locked' \| 'unlocked' \| 'completed'` | Phase chips use locked/unlocked/active/completed; filter chips use default/active |
| `label` | `string` | Primary text |
| `sublabel` | `string` | Secondary text (stat values, phase grid sizes) |
| `onPress` | `() => void` | If omitted, renders as a non-interactive View |

## Migration guide — screens not yet on the new system

`HomeScreen` is migrated. The others still import from `../theme/colors` (flat API) and keep working via the shim. To migrate one:

1. Replace `import { colors, radii, shadow, spacing } from '../theme/colors'` with `import { colors, spacing, radii, elevation } from '../theme'`.
2. Replace nested color usage: `colors.bg` → `colors.bg.app`; `colors.primary` → `colors.action.primary`; `colors.text` → `colors.text.primary`; `colors.textSoft` → `colors.text.soft`; etc. (See the `colors.js` shim for the full mapping.)
3. Swap inline `<Text>` for `<Text variant="...">`.
4. Swap `<Pressable style={styles.cta}>` patterns for `<Button>`.
5. Swap chip patterns (FilterChips rows, phase chips in GameScreen, stat pills in Header, meta pills in SaintProfile) for `<Chip>`.
6. Smoke test on web (`npm run web`) — visual diff should be < 2px.

### Deferred (intentional, post-starter)

- `GameScreen` — Header (icon buttons + stat pills + phase chips), modals
- `GalleryScreen` — search input wrap, FilterChips, CONQUISTAS card
- `SaintProfileScreen` — hero, meta pills, patronage chips
- `ResultModal` + `CampaignCompleteModal` — CTAs, breakdown cards

Each is a self-contained migration once the primitives are battle-tested on Home.

## Figma alignment

Tokens are mirrored in `design-tokens/`:
- `tokens-studio.json` — import via the Tokens Studio plugin (recommended).
- `figma-variables.json` — REST API payload (Enterprise only).

See [design-tokens/README.md](../design-tokens/README.md) for the import steps. The Figma file layout (cover, foundations, components, screens) is documented in [docs/FIGMA_BUILD.md](FIGMA_BUILD.md).
