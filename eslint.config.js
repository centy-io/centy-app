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
      'single-export/single-export': 'off',
      'ddd/require-spec-file': 'off',
    },
  },
  {
    files: [
      'components/organizations/CreateOrganization.tsx',
      'components/organizations/CreateOrgIssue/CreateOrgIssueForm.tsx',
      'components/project/ProjectsGrid/ProjectsGrid.tsx',
      'components/proto-form/AutoFieldRenderer.tsx',
      'components/proto-form/renderers/MapFieldRenderer.tsx',
      'components/proto-form/renderers/MessageListFieldRenderer.tsx',
      'components/settings/DaemonSettings/DaemonHelpSection.tsx',
    ],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
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
