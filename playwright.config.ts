import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  timeout: 30000,
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      // Allow 3% pixel difference for cross-platform font rendering variations
      // (macOS Core Text vs Linux FreeType produce slightly different anti-aliasing)
      maxDiffPixelRatio: 0.03,
      // Per-pixel color threshold (0-1 scale, 0.2 = 20% color tolerance)
      threshold: 0.2,
    },
  },

  use: {
    baseURL: 'http://localhost:5180',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: process.env.CI
    ? [
        // CI: Chromium only for faster builds, skip visual tests
        // Visual tests are skipped in CI due to OS-level font rendering differences
        // (macOS vs Linux produce different page heights even with identical fonts)
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
          testIgnore: '**/*.visual.spec.ts',
        },
      ]
    : [
        // Local: All browsers for comprehensive testing
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
        // Mobile viewport for visual testing
        {
          name: 'mobile-chrome',
          use: { ...devices['Pixel 5'] },
          testMatch: '**/*.visual.spec.ts',
        },
      ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5180',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  snapshotDir: './screenshots',
  snapshotPathTemplate:
    '{snapshotDir}/{testFileDir}/{testFileName}-{arg}-{projectName}{ext}',
})
