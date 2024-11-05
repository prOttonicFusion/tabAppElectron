import base from 'eslint-config-prottonic/base.js'
import globals from 'globals'

export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
        ],
    },
    ...base,
    {
        languageOptions: {
            ecmaVersion: 2022,
            globals: { ...globals.node, ...globals.browser },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
    },
]
