# Unify fonts to enable visual testing in CI/CD

Currently visual tests are skipped in CI/CD (testIgnore: '\*_/_.visual.spec.ts') because font rendering differs between environments, causing false positives in visual regression tests.

To enable visual testing in CI/CD, we should:

1. Use self-hosted web fonts (e.g., @fontsource packages like Noto Sans or Inter) instead of system fonts
2. Ensure consistent font loading across all environments
3. Update playwright.config.ts to include visual tests in CI once fonts are unified

This will allow us to catch visual regressions automatically in the pipeline.
