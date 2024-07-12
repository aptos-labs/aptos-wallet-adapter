import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import typescript2, { RPT2Options } from "rollup-plugin-typescript2";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { resolve } from "path";

const typescript2Options: RPT2Options = {
  check: false,
  include: ["src/components/**/*.vue"],
  tsconfigOverride: {
    compilerOptions: {
      outDir: "dist",
      sourceMap: true,
      declaration: true,
      declarationMap: true,
    },
  },
  exclude: ["vite.config.ts"],
};

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
    cssInjectedByJsPlugin(),
    typescript2({ ...typescript2Options }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "WalletAdapterVue",
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.ts"),
      },
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
      },
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
