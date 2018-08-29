module.exports = {
    transform: {
        '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
    },
    testURL: 'http://localhost',
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
    collectCoverage: false,
    collectCoverageFrom: [
        '**/src/*.{ts}',
        '!**/src/interfaces.{ts}',
        '!**/src/demo.{ts}',
        "!**/node_modules/**",
        "!**/vendor/**"
    ],
    coverageDirectory: 'coverage',
}