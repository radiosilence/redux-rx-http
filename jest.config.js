module.exports = {
    transform: {
        '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
    },
    testRegex: '/__tests__/.*\\.(spec|test)\\.ts$',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
    ],
  verbose: true,
  setupFiles: [
      './__tests__/setup.js',
  ],
}