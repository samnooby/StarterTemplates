import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['eslint.config.js', 'dist/', 'node_modules/', 'coverage/'] },
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': false, 'ts-ignore': true },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Use an `as const` object with a derived union type.',
        },
      ],
    },
  },
  {
    files: ['vite.config.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
);
