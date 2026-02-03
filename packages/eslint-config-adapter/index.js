import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

// Base config for all packages (non-Next.js)
const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/no-require-imports": "off",
      "prefer-rest-params": "off",
      "prefer-const": "warn",
    },
  },
];

// Export base config as default for non-Next.js packages
export default baseConfig;

// Export for Next.js apps (to be used with eslint-config-next directly in apps)
export { baseConfig };
