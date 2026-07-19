# Deploy guide — Jogo dos Santos

How to ship a feature and cut builds (Android and iOS) with Expo Application Services.

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
| `expo.version` | semver string, e.g. `"1.0.2"` | User-visible. Bump patch / minor / major to taste. |
| `expo.android.versionCode` | integer, e.g. `3` | **Must strictly increase** for every Play Store submission. Duplicates are rejected. |
| `expo.ios.buildNumber` | integer string, e.g. `"2"` | **Must strictly increase** for every TestFlight / App Store upload. Managed automatically by `autoIncrement` in the `production` profile. |

`eas.json` has `cli.appVersionSource: "local"`, so EAS reads these values straight from `app.json` — no other place to update.

Commit the version bump together with the changes it ships:

```bash
git add app.json
git commit -m "chore: bump to <new-version>"
git push origin main
```

---

## 3. Preview build (Android APK)

Use the **preview** profile for internal Android smoke tests — installable APK, no Play Store roundtrip:

```bash
npx eas-cli@latest build --profile preview --platform android
```

What to expect:

- The build runs in the Expo cloud. The terminal prints a URL of the form `https://expo.dev/accounts/alessandrolorenz/projects/jogo-dos-santos/builds/<uuid>`.
- Typical wait: **15–30 minutes**.
- One **EAS build credit** is consumed. Cancelling mid-build still burns the credit.
- The **first ever** Android build will prompt to generate a release keystore — accept; EAS stores it server-side for all future builds under this project.

The `preview` profile produces `buildType: apk` with `distribution: internal`.

---

## 4. Preview build (iOS Simulator)

Use the **ios-simulator** profile to produce a `.app` bundle that runs in Xcode Simulator.
**No Apple Developer account or code signing required.**

```bash
npx eas-cli@latest build --profile ios-simulator --platform ios --no-wait
```

What to expect:

- EAS builds the app in the cloud and produces a `.app.tar.gz` artifact.
- Typical wait: **20–40 minutes**.
- The Expo dashboard shows a download link when done.

**Installing on Xcode Simulator (macOS only):**

```bash
# 1. Download and extract the artifact
tar -xf <downloaded-file>.tar.gz

# 2. Boot a simulator if one is not already running
xcrun simctl boot "iPhone 16"

# 3. Install the app
xcrun simctl install booted Jogo\ dos\ Santos.app

# 4. Launch it
xcrun simctl launch booted com.jogodossantos.app
```

Limitations: the artifact cannot be installed on a real iPhone. For real-device testing, see section 5.

---

## 5. Internal distribution build (iOS, real device)

This produces a signed `.ipa` installable on registered iPhones without going through TestFlight.

**Prerequisites (one-time):**
1. An active **Apple Developer Program** membership ($99/year) — enroll at [developer.apple.com](https://developer.apple.com/programs/enroll/).
2. Register test devices:
   ```bash
   npx eas-cli@latest device:create
   ```
   EAS prints a URL — open it on the iPhone and follow the profile installation prompt.
3. Generate credentials (certificates + provisioning profiles). EAS automates this entirely:
   ```bash
   npx eas-cli@latest credentials --platform ios
   ```
   Choose **"Let EAS handle this"** when prompted. Credentials are stored server-side and reused automatically on future builds.

**Build command:**

```bash
npx eas-cli@latest build --profile preview --platform ios
```

**Installing on a registered device:**

When the build finishes, the Expo dashboard shows a QR code and a direct download link. On the registered iPhone:
1. Scan the QR code with the Camera app or open the link in Safari.
2. Tap **Install** when prompted.
3. Go to **Settings → General → VPN & Device Management**, find the developer certificate, and tap **Trust**.

---

## 6. TestFlight and App Store (iOS)

**Prerequisites (one-time, in addition to section 5):**
1. Create an **App Store Connect** entry for bundle ID `com.jogodossantos.app` at [appstoreconnect.apple.com](https://appstoreconnect.apple.com).
2. Generate a production certificate and store provisioning profile via `eas credentials --platform ios` (or let EAS handle it automatically on first `production` build).
3. Create an **App Store Connect API key** (Users & Access → Keys) and add it to EAS Submit:
   ```bash
   npx eas-cli@latest credentials --platform ios
   # Select "App Store Connect API Key" and follow prompts
   ```

**Build for TestFlight / App Store:**

```bash
npx eas-cli@latest build --profile production --platform ios
```

The `production` profile sets `distribution: "store"` and `autoIncrement: true` — the `buildNumber` in `app.json` is bumped automatically for each build.

**Submit to TestFlight:**

```bash
npx eas-cli@latest submit --profile production --platform ios
```

> `submit.production` in [eas.json](../eas.json) is currently empty. Populate it with your ASC API key details before running submit for the first time.

TestFlight review: ~1 business day. App Store review: ~1–3 business days.

---

## 7. Production build (Android — Play Store)

For a Play Store submission, use the **production** profile — produces an Android App Bundle (`.aab`):

```bash
npx eas-cli@latest build --profile production --platform android
```

> **Submit step not yet wired.** [eas.json](../eas.json) has an empty `submit.production` block. Before `npx eas-cli submit --profile production --platform android` will work, populate it with a Play Store service-account JSON. Defer this until the first store release is planned.

---

## 8. EAS Update — OTA (JS-only updates, future)

EAS Update lets you ship JavaScript-only fixes without triggering a full native rebuild or app store review. The OTA channels (`development`, `preview`, `production`) are already wired in [eas.json](../eas.json); only three steps remain to activate this.

**One-time setup (when ready):**

```bash
# 1. Install expo-updates
npx expo install expo-updates

# 2. Configure — adds expo.updates.url and expo.runtimeVersion to app.json automatically
npx eas-cli@latest update:configure
```

**Shipping a JS update:**

```bash
# Push to the preview channel (targets all preview builds)
npx eas-cli@latest update --branch preview --message "fix: card flip timing"

# Push to production channel
npx eas-cli@latest update --branch production --message "fix: score display"
```

Updates are downloaded silently on next app launch. Users do not need to re-install from the store.

---

## 9. Tag the release

After a successful build that you intend to keep, tag the commit:

```bash
git tag v<version>     # e.g. v1.0.2
git push origin v<version>
```

This makes the deployed commit trivially recoverable via `git checkout v<version>`.

---

## 10. iOS native compatibility reference

This app uses only Expo managed modules — no local CocoaPods setup or `ios/` directory is required. EAS generates the Xcode project server-side.

| Package | iOS support | Permissions required | Info.plist entries | Pods |
| --- | --- | --- | --- | --- |
| `expo-asset` | ✅ | none | none | via Expo managed |
| `expo-constants` | ✅ | none | none | via Expo managed |
| `expo-file-system` | ✅ | none (sandboxed paths) | none | via Expo managed |
| `expo-font` | ✅ | none | none | via Expo managed |
| `expo-keep-awake` | ✅ | none | none | via Expo managed |
| `expo-status-bar` | ✅ | none | none | via Expo managed |

No camera, microphone, location, contacts, or media library access is used. The iOS permission footprint is zero beyond what Expo injects by default (`NSCameraUsageDescription` etc. are **not** added).

**Icons and splash:** `assets/icon.png` (512×512) and `assets/splash.png` (1024×1024) are present and referenced correctly in `app.json`. EAS auto-generates all required iOS icon sizes and the launch image from these files.

---

## 11. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Not logged in` | `npx eas-cli@latest login` |
| `Project not linked` | `npx eas-cli@latest init` — should not happen; `extra.eas.projectId` is set in [app.json](../app.json). |
| Build stuck in queue | Check <https://status.expo.dev/>. The Hobby/Free tier has a separate (slower) queue from paid plans. |
| `versionCode … was already used` | Bump `expo.android.versionCode` in [app.json](../app.json) and rebuild. |
| `Invalid build number` (iOS) | Bump `expo.ios.buildNumber` in [app.json](../app.json); use `production` profile with `autoIncrement: true` to avoid this. |
| Local smoke-test passes but cloud build fails on JS bundle | Run `npx expo export --platform ios` locally to reproduce — bundling errors surface there before paying for a cloud build. |
| `No devices registered` (internal iOS) | Run `npx eas-cli@latest device:create` and register the target iPhone, then rebuild. |
| Simulator `.app` won't install | Ensure the simulator is booted (`xcrun simctl list`) and use the exact app name from the extracted folder. |

---

## Deferred / TODO

- **Play Store submit credentials** (see section 7) — populate `submit.production` in `eas.json` with a service-account JSON before the first automated Play Store upload.
- **App Store submit credentials** (see section 6) — add an App Store Connect API key to EAS before the first `eas submit --platform ios`.
- **EAS Update / OTA** — channels are wired in `eas.json`; activate by installing `expo-updates` and running `eas update:configure` (see section 8).
