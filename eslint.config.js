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
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'import/order': 'off',
      'import/no-namespace': 'off',
      'single-export/single-export': 'off',
      'max-lines-per-function': 'off',
      'default/no-default-params': 'off',
      'security/detect-object-injection': 'off',
      'ddd/require-spec-file': 'off',
      'default/no-hardcoded-urls': 'off',
      'default/no-localhost': 'off',
      'error/no-literal-error-message': 'off',
      'error/require-custom-error': 'off',
      'error/no-generic-error': 'off',
      'error/no-throw-literal': 'off',
      'custom/jsx-classname-required': 'off',
    },
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
]
