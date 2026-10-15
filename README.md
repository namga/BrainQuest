# Brain Quest — Think Beyond

A polished 2D logic-puzzle prototype built with Phaser 3 + TypeScript + Vite, designed to run as a Web/PWA and to be wrapped for Android and iOS with Capacitor.

## Prototype features

- Responsive game landing screen with three themed worlds.
- Interactive pattern-recognition puzzles with multiple-choice answers.
- XP, stars, world unlocks, hints, daily challenge, and local progress saving.
- Animated feedback and lightweight ambient starfield.
- Premium preview screen (demo only; it does not take payments).
- PWA manifest and a basic service worker.
- GitHub Actions workflows for Web, Android debug APK, and unsigned iOS app bundle.

> This is an early prototype. It uses a small sample puzzle bank repeated across the world structure; it is not yet the full 60 hand-authored puzzles described in the design plan. Premium, account sync, cloud saves, real analytics, and production payment validation are not implemented.

## Run locally

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Build the web/PWA assets:

```bash
npm run build
npm run preview
```

## App name and versioned build files

- App display name: **Brain Quest** (configured in `capacitor.config.ts`).
- Version: read from `package.json` (currently `0.3.2`).
- Android artifact and downloaded APK filename include the app name and version, for example `Brain-Quest-v0.3.3-debug.apk`.
- The Android workflow also sets the native Android `versionName` and `versionCode` from the package version.
- After changing `package.json` version, commit and push to trigger a new versioned build.

## Android

The Android workflow creates the Capacitor Android project on the GitHub runner, builds a debug APK, and uploads it as an artifact.

To build locally with Android Studio installed:

```bash
npm install
npm run build
npx cap add android       # only the first time
npx cap sync android
npx cap open android
```

The GitHub Actions APK is a **debug APK** for testing, not a signed Play Store release. After a workflow completes, open **Actions → Build Android APK → run → Artifacts** and download the artifact named `Brain-Quest-v<version>-Android-debug`; the APK filename includes the same version.

## iOS

The iOS workflow runs on a macOS GitHub runner, creates the Capacitor iOS project, and builds an **unsigned `.app` bundle**. The artifact is useful for checking that the iOS project compiles, but it is not an installable IPA and cannot be distributed to devices as-is.

You previously indicated that you do not yet have a paid Apple Developer account. You can still test the workflow's unsigned build. To install on a real iPhone or distribute through TestFlight/App Store later, you will need Apple signing and provisioning; TestFlight/App Store distribution requires the appropriate Apple Developer membership.

To open the iOS project on a Mac:

```bash
npm install
npm run build
npx cap add ios           # only the first time
npx cap sync ios
npx cap open ios
```

Build through Xcode after selecting a valid signing team when you are ready for device installation.

## GitHub setup

1. Create an empty GitHub repository, for example `brain-quest`.
2. Extract this ZIP and upload/push all files, including the `.github/workflows` folder.
3. Ensure the default branch is `main` or `master`.
4. Open the **Actions** tab. The workflows run on push and can also be started with **Run workflow**.
5. Download each build from the workflow run's **Artifacts** section.

If GitHub Actions is disabled for the repository, enable it in repository settings.

## Technical notes

- App ID: `com.brainquest.puzzle`
- App name: `Brain Quest`
- Web build output: `dist/`
- Progress is saved locally in the browser/app WebView. Clearing app data can erase it.
- The prototype imports Google Fonts at runtime; fallback system fonts are provided. For fully offline visual consistency, bundle licensed font files locally in a later iteration.
- The iOS workflow deliberately disables code signing. Do not treat the unsigned artifact as a release IPA.

## Next steps before monetization

1. Expand and quality-check the puzzle bank; test every answer and difficulty curve.
2. Add real sound assets, app icons, privacy policy, and store screenshots.
3. Add consent-aware analytics and crash reporting only if needed.
4. Implement secure receipt verification before enabling real purchases.
5. Add cloud saves/accounts only after validating retention and payment demand.


## Prototype v0.2.0 update

- Fixed mobile layout overflow with safe-area-aware, scrollable modal layouts and narrower-screen rules.
- Added Settings with English/Vietnamese UI selection.
- Added 30 authored puzzle levels across three difficulty tiers and three worlds.
- Added a structural puzzle-bank audit (four unique options, valid answer index, and required hint/explanation).
- Added generated answer feedback tones and three selectable synthesized background music themes: Calm Piano, Focus Ambient, and Retro Arcade. Audio starts after user interaction to respect browser autoplay policies.
- Kept gameplay offline-first and saved language, sound, music and progress settings locally.

### Logic validation

The 60 puzzle records were structurally checked for four unique choices and valid answer indices. Each answer key was also manually reviewed against its written sequence/rule. This is a content-level review, not a substitute for player usability testing.

### Audio note

The prototype synthesizes tones with the Web Audio API, so it does not bundle licensed music files. Music requires a user interaction before playback in browsers and may be paused by device power-saving policies.


## v0.3.0 — mobile header and app icon fix
- Added PNG app icons at 192/512/1024 sizes, PWA favicon and Apple touch icon.
- Added Capacitor Assets generation steps to Android/iOS workflows so native launcher icons are generated during CI.
- Reworked narrow-screen header into a clear two-row layout, added safe-area spacing, larger touch targets, and raised Settings dialog z-index.


## v0.3.3 — versioned app builds
- Android APK filename and GitHub Actions artifact now include the app name and semantic version.
- Native Android versionName/versionCode are set from package.json.
- iOS unsigned artifact also includes the version in its artifact name.
