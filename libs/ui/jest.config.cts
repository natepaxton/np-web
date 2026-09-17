module.exports = {
  displayName: 'ui',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/libs/ui',
  coverageReporters: ['lcov', 'text-summary', 'json-summary'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/test-setup.ts', '!src/index.ts', '!src/**/*.g.ts'],
  coverageThreshold: {
    global: { lines: 80, statements: 80, functions: 80, branches: 75 },
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
