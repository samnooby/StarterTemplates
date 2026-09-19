import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['eslint.config.js', '.next/', 'node_modules/', 'coverage/'] },
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    plugins: { '@next/next': nextPlugin },
    rules: { ...nextPlugin.configs['core-web-vitals'].rules },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': false, 'ts-ignore': true }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
      'no-restricted-syntax': [
        'error',
        { selector: 'TSEnumDeclaration', message: 'Use an `as const` object with a derived union type.' },
      ],
    },
  },
  {
    files: ['app/**/page.tsx', 'app/**/layout.tsx', 'app/**/route.ts', 'app/**/error.tsx', 'app/**/loading.tsx', 'app/**/not-found.tsx', 'middleware.ts', 'next.config.*'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
);
