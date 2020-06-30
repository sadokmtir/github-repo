module.exports = {
    extends: [
        'plugin:jest/recommended',
        'eslint:recommended',
        '../.eslintrc'
    ],
    env: {
        es6: true,
        jest: true
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
            pathRegex: /\.(spec|test)\.ts$/
        }
    }
};