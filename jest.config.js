module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    setupFilesAfterEnv: ['./src/tests/setup.js'],
    coverageDirectory: './coverage',
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
    verbose: true
};