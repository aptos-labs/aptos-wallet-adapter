import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import globals from "globals";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  // Base JS config
  js.configs.recommended,
  // Next.js and other configs via compat
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("turbo"),
  ...compat.extends("prettier"),
  // TypeScript and React file patterns
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react/jsx-key": "off",
    },
  },
  // TypeScript-specific: disable rules handled by TS compiler
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off", // TypeScript handles this
      "no-unused-vars": "off", // TypeScript handles this
      "no-redeclare": "off", // TypeScript handles this
    },
  },
];
