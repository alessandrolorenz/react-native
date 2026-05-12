# Design Tokens — Figma Import

Two token files are generated from `src/theme/`:

- **[tokens-studio.json](tokens-studio.json)** — for the [Tokens Studio for Figma](https://tokens.studio/) plugin. Free, works on any Figma plan. **This is the recommended path.**
- **[figma-variables.json](figma-variables.json)** — raw payload for the Figma Variables REST API (`POST /v1/files/:file_key/variables`). Requires a paid Figma Enterprise plan to write via REST.

Target Figma file: `vQz10dcNO5vJC69GXH1voT`
URL: <https://www.figma.com/design/vQz10dcNO5vJC69GXH1voT/Untitled>

---

## Path A — Tokens Studio plugin (recommended)

1. In Figma, open the file above.
2. Right-click canvas → **Plugins** → **Find more plugins** → search **"Tokens Studio for Figma"** → Run.
3. In the plugin panel, click the **gear icon** → **Tools** → **Load** → **File** → pick `design-tokens/tokens-studio.json`.
4. Two token sets appear in the left sidebar: `palette` and `light`. Enable both (`palette` provides raw values, `light` references them).
5. Click **Create styles** → check **Colors**, **Typography**, **Shadows** → **Create**.
6. Click **Create variables** → check **Colors**, **Numbers** → **Create**. (Variables persist across plugin restarts; styles get baked into the file's style library.)

Result: every color, typography variant, spacing/radius value, and shadow appears in the Figma file's local styles and variables, named to match the codebase (e.g. `color/action/primary`, `typography/cta`).

To re-sync after token changes in the codebase: regenerate `tokens-studio.json` (currently a hand-maintained mirror of `src/theme/`), then in the plugin → **Load** → re-import → **Create styles** / **Create variables** again. Existing styles update in place when names match.

---

## Path B — Variables REST API (paid Figma Enterprise only)

The REST endpoint requires Enterprise + a personal access token with `file_variables:write` scope.

The repo's `.env` already holds your token as `FIGMA_API_KEY`. Source it locally:

```powershell
# PowerShell — load .env into the session
Get-Content .env | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
    $env:($matches[1].Trim()) = $matches[2].Trim()
  }
}

# Then POST the payload
$body = Get-Content design-tokens/figma-variables.json -Raw
Invoke-RestMethod `
  -Uri "https://api.figma.com/v1/files/vQz10dcNO5vJC69GXH1voT/variables" `
  -Method POST `
  -Headers @{ "X-Figma-Token" = $env:FIGMA_API_KEY } `
  -ContentType "application/json" `
  -Body $body
```

If you don't have Enterprise, this returns 403. Use Path A instead — the result is equivalent for design work.

---

## What's in each file

Both files encode the same source of truth (the `src/theme/` modules):

| Category | Tokens Studio path | REST variables path |
|---|---|---|
| Raw colors (palette) | `palette/<hue>/<shade>` | Collection **Primitives** |
| Semantic colors | `light/color/<group>/<name>` | Collection **Semantic** (aliases to Primitives) |
| Typography variants | `light/typography/<variant>` | *(REST API doesn't support typography variables — use Tokens Studio path)* |
| Font sizes (raw) | `light/fontSize/<scale>` | Collection **Tokens** → `fontSize/*` |
| Spacing | `light/spacing/<scale>` | Collection **Tokens** → `spacing/*` |
| Radii | `light/radius/<scale>` | Collection **Tokens** → `radius/*` |
| Shadows | `light/shadow/<scale>` | *(REST API supports effect styles, not via this payload — use Tokens Studio path)* |
| Motion durations | `light/motion/duration/<scale>` | Collection **Tokens** → `duration/*` |

Tokens Studio is more complete. The REST payload covers colors and numeric tokens but skips typography and shadow effects (those live as styles in Figma, not variables).

---

## Verifying alignment to the codebase

Source of truth: `src/theme/palette.js`, `src/theme/semantic.js`, `src/theme/typography.js`, `src/theme/spacing.js`, `src/theme/radii.js`, `src/theme/elevation.js`, `src/theme/motion.js`.

If you change a value in code, update the matching entry in `tokens-studio.json` (and `figma-variables.json` if you're using Path B). A future improvement would be a `npm run tokens:build` script that derives these JSONs from the JS modules — out of scope for the starter system.
