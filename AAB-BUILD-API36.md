# Brain Quest v0.4.6 — Android App Bundle, target API 36

This repository adds `.github/workflows/android-aab.yml`. Push to main/master or run it manually from GitHub Actions.

The workflow installs Android SDK platform 36, builds a debug AAB for testing and a release AAB artifact. The release artifact is unsigned unless Android release signing is configured; Google Play requires an appropriately signed release bundle. Do not upload the debug AAB to Play Console.

Target API: 36 (Android 16). Google Play requires API 36 or higher for new apps and updates starting 31 August 2026.

Workflow artifacts:
- `Brain-Quest-v0.4.6-API36-debug.aab` — for build/test validation, not Play release.
- `Brain-Quest-v0.4.6-API36-release-unsigned.aab` — must be signed before Play Console upload.

The workflow has not been run in this environment. Download the artifact only after the GitHub Actions job completes successfully.
