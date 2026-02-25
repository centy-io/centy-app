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
  {
    // Re-enable max-lines-per-function for test and spec files
    // eslint-config-agent disables this rule for test files, but we enforce it here
    files: [
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/*.test.{js,jsx,ts,tsx}',
      'e2e/**',
      '__tests__/**',
    ],
    rules: {
      'max-lines-per-function': [
        'error',
        { max: 70, skipBlankLines: true, skipComments: true },
      ],
    },
  },
]
