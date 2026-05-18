import baseConfig from '../eslint.config.mjs';

export default [
  ...baseConfig,
  { ignores: ['.docusaurus/**'] },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
