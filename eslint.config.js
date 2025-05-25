import * as path from 'path';

export default [
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      parser: await (async () => {
        const { default: tseslintParser } = await import('@typescript-eslint/parser');
        return tseslintParser;
      })(),
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: path.resolve(),
      },
    },
    plugins: {
      '@typescript-eslint': await (async () => {
        const { default: tseslintPlugin } = await import('@typescript-eslint/eslint-plugin');
        return tseslintPlugin;
      })(),
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
    ignores: ['dist/**', 'node_modules/**', 'test/**'],
  },
];
