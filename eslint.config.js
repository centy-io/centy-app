import config from 'eslint-config-agent'

export default [
  ...config,
  {
    // Disable rules from strictTypeChecked that conflict with project philosophy or require
    // large-scale refactoring. These should be addressed in separate issues.
    rules: {
      // Conflicts with project's ban on nullish coalescing (??) and optional chaining (?.)
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      // Next.js requires generateStaticParams to be async even without await
      '@typescript-eslint/require-await': 'off',
      // Common React event handler pattern: onClick={() => handler()}
      '@typescript-eslint/no-confusing-void-expression': 'off',
      // Promise-returning functions in React event handlers (e.g. onClick={asyncFn})
      '@typescript-eslint/no-misused-promises': 'off',
      // Template literal with non-string types (stylistic strictness)
      '@typescript-eslint/restrict-template-expressions': 'off',
      // Unhandled floating promises
      '@typescript-eslint/no-floating-promises': 'off',
      // Non-null assertions (!): banned by strictTypeChecked, used across codebase
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Type-unsafe operations involving any
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      // Unnecessary conditions - enabled; false positives suppressed inline
      // Empty functions (e.g. no-op callbacks)
      '@typescript-eslint/no-empty-function': 'off',
      // Miscellaneous stylistic rules from stylisticTypeChecked
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
      '@typescript-eslint/no-meaningless-void-operator': 'off',
      '@typescript-eslint/prefer-regexp-exec': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
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
