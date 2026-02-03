import aptosConfig from "@aptos-labs/eslint-config-adapter";

export default [
  ...aptosConfig,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/out/**",
      "**/.next/**",
      "**/.nuxt/**",
    ],
  },
];
