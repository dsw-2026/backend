import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // `any` is used on purpose in the DAOs (generic entity data) and in the
      // MikroORM populate workaround; warn instead of blocking the build.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Express error handlers must declare (err, req, res, next) even when a
      // param is unused; ignore unused args that start with `_` or are `next`.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_|^next$', caughtErrors: 'none' },
      ],
    },
  },
])