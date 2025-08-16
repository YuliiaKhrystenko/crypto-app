// eslint.config.js — ESLint v9 flat + Vue 3 + TS (type-aware) + Vitest
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default [
  { ignores: ['dist', 'node_modules', 'coverage', 'stats.html'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: { ...globals.browser, ...globals.es2021 },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
    },
  },
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: process.cwd(),
        ecmaVersion: 2021,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: { ...globals.browser, ...globals.es2021 },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,js}', 'tests/**/*'],
    languageOptions: { globals: globals.vitest },
  },
  {
    files: [
      '**/*.config.{js,ts}',
      'vite.config.ts',
      'vitest.config.ts',
      'postcss.config.js',
      'tailwind.config.js',
      'eslint.config.js',
    ],
    languageOptions: { globals: globals.node },
  },
]
