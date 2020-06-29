module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: [
        'test'
    ],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
        '**/test/unit/**/*.test.(ts|js)'

    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
};