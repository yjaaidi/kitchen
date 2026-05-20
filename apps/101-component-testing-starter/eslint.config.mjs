import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';
import vitest from '@vitest/eslint-plugin';

export default [
  ...nx.configs['flat/react'],
  ...baseConfig,
  vitest.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      'vitest/valid-title': 'off',
    },
  },
];
