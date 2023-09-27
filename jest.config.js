module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.test.{ts,tsx}', '!**/node_modules/**', '!test/**'],
  coveragePathIgnorePatterns: [],
  setupFiles: ['<rootDir>/config/setupTests.ts'],
  setupFilesAfterEnv: ['<rootDir>/config/setupTestFramework.ts'],
  roots: ['<rootDir>/src/'],
  moduleNameMapper: {
    '\\.(svg)$': 'identity-obj-proxy',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [ '<rootDir>/node_modules/(?!@redhat-cloud-services)' ],
};
