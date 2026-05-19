const { swcAngularJestTransformer } = require('@jscutlery/swc-angular');

module.exports = {
  displayName: 'whiskmate',
  preset: '../../jest.preset.cjs',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup-jest.ts'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)?(x)'],
  coverageDirectory: '../../coverage/apps/whiskmate',
  transform: {
    '^.+\\.m?(t|j)sx?$': swcAngularJestTransformer(),
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
