// module.exports = {
//   preset: 'jest-preset-angular',
//   transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
// };

const { pathsToModuleNameMapper } = require('ts-jest');
const { defaultTransformerOptions } = require('jest-preset-angular/presets');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig');

module.exports = {
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  modulePaths: [compilerOptions.baseUrl],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['text-summary', 'lcov'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        ...defaultTransformerOptions,
        isolatedModules: true,
      },
    ],
  },
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!.*\\.mjs$)`],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths),
    '^lodash-es$': 'lodash',
  },
};
