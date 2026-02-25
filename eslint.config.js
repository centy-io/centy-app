import config from 'eslint-config-agent'

export default [
  ...config,
  {
    ignores: [
      'out',
      '.next',
      '.open-next',
      '.wrangler',
      'node_modules',
      'coverage',
      'dist',
      'gen',
      'playwright-report',
      'next-env.d.ts',
    ],
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    // Environment constant files use hardcoded fallback values because webpack's DefinePlugin
    // only replaces process.env.VAR member expressions, not destructuring from process.env.
    // Hardcoded fallbacks ensure correct values when env vars are not set at build time.
    files: [
      'lib/constants/DAEMON_INSTALL_URL.ts',
      'lib/constants/DOCS_URL.ts',
      'lib/constants/CORS_DOCS_URL.ts',
      'lib/constants/GOOGLE_ANALYTICS_URL.ts',
      'lib/constants/SENTRY_DSN.ts',
      'lib/grpc/client/DEFAULT_DAEMON_URL.ts',
    ],
    rules: {
      'default/no-hardcoded-urls': 'off',
      'default/no-localhost': 'off',
    },
  },
  {
    // Test infrastructure - e2e tests and vitest setup don't need their own spec files
    files: [
      'e2e/**',
      '__tests__/setup.ts',
      'instrumentation.ts',
      'instrumentation-client.ts',
    ],
    rules: {
      'single-export/single-export': 'off',
    },
  },
]
