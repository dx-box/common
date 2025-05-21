import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      'no-console': 'off',
      'no-debugger': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-duplicate-imports': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
    },
    settings: {},
  },
  prettier,
];
