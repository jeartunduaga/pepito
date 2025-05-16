module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    },
    moduleNameMapper: {
        '\\.(mp3|svg|css)$': '<rootDir>/__mocks__/fileMock.js'
    }
};
