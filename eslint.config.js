import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default [
  js.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        URLSearchParams: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      // Stylistic
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'only-multiline'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
      '@stylistic/arrow-spacing': 'error',
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      // Quality
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'smart'],
    },
  },
  {
    ignores: ['node_modules/**'],
  },
];
