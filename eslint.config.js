import config from 'eslint-config-agent'

// Remove the nullish coalescing ban from no-restricted-syntax — the project now
// embraces ?? via @typescript-eslint/prefer-nullish-coalescing.
const baseConfig = config.map(c => {
  if (!c.rules || !c.rules['no-restricted-syntax']) return c
  const [severity, ...restrictions] = c.rules['no-restricted-syntax']
  const filtered = restrictions.filter(
    r => !r.selector || !r.selector.includes('??')
  )
  if (filtered.length === restrictions.length) return c
  return {
    ...c,
    rules: { ...c.rules, 'no-restricted-syntax': [severity, ...filtered] },
  }
})

export default [
  ...baseConfig,
  {
    // Disable rules from strictTypeChecked that conflict with project philosophy or require
    // large-scale refactoring. These should be addressed in separate issues.
    rules: {
      // Optional chaining (?.) is fully supported in all target browsers and consistent with ?? usage
      'no-optional-chaining/no-optional-chaining': 'off',
      // Non-null assertions (!): banned by strictTypeChecked, all usages replaced with proper null checks
      '@typescript-eslint/no-non-null-assertion': 'error',
      // Miscellaneous stylistic rules from stylisticTypeChecked
      // Disabled: conflicts with no-confusing-void-expression + ignoreVoidOperator pattern
      '@typescript-eslint/no-meaningless-void-operator': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      // ignoreVoidOperator: void fn() is intentional in arrow shorthand event handlers
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreVoidOperator: true },
      ],
      // Numbers are safe and common in template literals
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
    },
  },
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
    // e2e utilities legitimately reference localhost and hardcoded URLs for test infrastructure
    files: ['e2e/**'],
    rules: {
      'default/no-localhost': 'off',
      'default/no-hardcoded-urls': 'off',
    },
  },
  {
    // Re-enable max-lines-per-function for test and spec files
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
  {
    // Re-enable max-lines for test and spec files
    files: [
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/*.test.{js,jsx,ts,tsx}',
      'e2e/**',
      '__tests__/**',
    ],
    rules: {
      'max-lines': [
        'error',
        { max: 100, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    // Shared spec utilities - test helper modules that provide factories and helpers to spec files
    files: ['**/*.spec-utils.{ts,tsx}'],
    rules: {
      'ddd/require-spec-file': 'off',
      'single-export/single-export': 'off',
    },
  },
]
