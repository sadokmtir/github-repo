module.exports = {
    extends: 'eslint:recommended',
    env: {
        es6: true,
        jest: true
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
            pathRegex: /\.(spec|test)\.ts$/
        }
    },
};