//@ts-check

// import eslint from '@eslint/js';
// import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';

import { defineConfig } from 'eslint/config';

export default defineConfig(
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        ignores: ['node_modules/*', 'dist/*'],
    },
);
