// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

const devTools = ['./vite.config.ts'];

module.exports = {
  env: { browser: true, es2020: true },
  extends: ["@aptos-labs/eslint-config-adapter"],
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.node.json'],
  },
  plugins: ['react-refresh'],
  root: true,
  rules: {
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: devTools }],
    'react-refresh/only-export-components': 'warn',
    'react/react-in-jsx-scope': 'off',
  },
};
