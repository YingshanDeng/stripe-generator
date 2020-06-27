module.exports = {
    extends: ['airbnb-typescript/base'],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        "indent": [1, 4],
        "@typescript-eslint/indent": [1, 4],
    },
};