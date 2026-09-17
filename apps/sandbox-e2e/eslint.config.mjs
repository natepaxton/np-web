import playwright from 'eslint-plugin-playwright';
import baseConfig from '../../eslint.config.mjs';

export default [
  playwright.configs['flat/recommended'],
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      // The login tests skip themselves when the Auth0 test password or the API is missing,
      // which is a deliberate opt-out rather than a disabled test.
      'playwright/no-skipped-test': ['warn', { allowConditional: true }],
    },
  },
];
