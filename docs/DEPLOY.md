# Deploy guide — Jogo dos Santos

How to ship a feature and cut a new Android build to Expo.

Project dashboard: <https://expo.dev/accounts/alessandrolorenz/projects/jogo-dos-santos>

---

## Prerequisites

- Node 20+ and npm (already required by the repo).
- An Expo account in the `alessandrolorenz` organization.
- `eas-cli` is **not** a project dependency — every command below uses `npx eas-cli@latest`, which downloads on first run and pins to the latest CLI.
- Verify you're signed in before any build:
  ```bash
  npx eas-cli@latest whoami
  ```
  If the command prints nothing or errors, run `npx eas-cli@latest login` (interactive).

---

## 1. Shipping a feature

1. **Branch** off `main` for non-trivial work — `git checkout -b feat/<short-name>`. Single-line fixes can go directly on `main`.
2. **Implement and smoke-test locally**:
   ```bash
   npx expo start
   ```
   Press `a` for an Android emulator/device, `i` for iOS (Expo Go), or `w` for web. Confirm the golden path works before continuing.
3. **Update docs** if architecture, commands, or conventions changed:
   - [CLAUDE.md](../CLAUDE.md) — guidance loaded into Claude Code sessions
   - [README.md](../README.md) — public-facing project notes
4. **Commit** in logical units with imperative verbs (`add`, `update`, `fix`, `remove`). One commit per concern is better than one giant commit.
5. **Merge** to `main` — open a PR (preferred for shared work) or push directly if solo.
6. **Bump the version**, then **build** (next two sections).

---

## 2. Version bump

Edit [app.json](../app.json) before every build that will be distributed:

| Field | Format | Rule |
| --- | --- | --- |
| `expo.version` | semver string, e.g. `"1.0.1"` | User-visible. Bump patch / minor / major to taste. |
| `expo.android.versionCode` | integer, e.g. `2` | **Must strictly increase** for every Play Store submission. Duplicates are rejected. |

`eas.json` has `cli.appVersionSource: "local"`, so EAS reads these values straight from `app.json` — no other place to update.

Commit the version bump together with the changes it ships:

```bash
git add app.json
git commit -m "chore: bump to <new-version>"
git push origin main
```

---

## 3. Preview build (Android APK)

Use the **preview** profile for internal smoke tests — installable APK, no Play Store roundtrip:

```bash
npx eas-cli@latest build --profile preview --platform android
```

What to expect:

- The build runs in the Expo cloud. The terminal prints a URL of the form `https://expo.dev/accounts/alessandrolorenz/projects/jogo-dos-santos/builds/<uuid>`.
- Typical wait: **15–30 minutes**.
- One **EAS build credit** is consumed. Cancelling mid-build still burns the credit.
- The **first ever** Android build will prompt to generate a release keystore — accept; EAS stores it server-side for all future builds under this project.

The `preview` profile (from [eas.json](../eas.json)) produces `buildType: apk` with `distribution: internal`.

---

## 4. Distributing a preview build

When the build finishes, the dashboard page shows:

- A **direct APK download link** — paste it into Slack / WhatsApp / email.
- A **QR code** — scan it from an Android device's browser; tap the downloaded `.apk` to install. You may need to enable "Install unknown apps" for the source browser.

The same build can be reinstalled later from the same URL until you delete it from the dashboard.

---

## 5. Production build (Play Store)

For a Play Store submission, use the **production** profile — produces an Android App Bundle (`.aab`):

```bash
npx eas-cli@latest build --profile production --platform android
```

> **Submit step not yet wired.** [eas.json](../eas.json) has an empty `submit.production` block. Before `npx eas-cli submit --profile production --platform android` will work, populate it with a Play Store service-account JSON. Defer this until the first store release is planned.

---

## 6. Tag the release

After a successful build that you intend to keep, tag the commit:

```bash
git tag v<version>     # e.g. v1.0.1
git push origin v<version>
```

This makes the deployed commit trivially recoverable via `git checkout v<version>`.

---

## 7. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Not logged in` | `npx eas-cli@latest login` |
| `Project not linked` | `npx eas-cli@latest init` — should not happen; `extra.eas.projectId` is set in [app.json](../app.json). |
| Build stuck in queue | Check <https://status.expo.dev/>. The Hobby/Free tier has a separate (slower) queue from paid plans. |
| `versionCode … was already used` | Bump `expo.android.versionCode` in [app.json](../app.json) and rebuild. |
| Local smoke-test passes but cloud build fails on JS bundle | Run `npx expo export --platform android` locally to reproduce — bundling errors surface there before paying for a cloud build. |

---

## Deferred / TODO

- **iOS build profile**. [eas.json](../eas.json) currently has no iOS configuration. Add an `ios` block per profile and provide Apple Developer credentials when iOS distribution is needed.
- **EAS Update (OTA)** for JS-only fixes without a full rebuild. Requires:
  1. `npx expo install expo-updates`
  2. Add `expo.runtimeVersion` (e.g. `{ "policy": "appVersion" }`) and `expo.updates.url` in [app.json](../app.json)
  3. `npx eas-cli@latest update:configure`
  4. Ship JS updates with `npx eas-cli@latest update --branch production --message "<summary>"`
- **Play Store submit credentials** (see section 5).
