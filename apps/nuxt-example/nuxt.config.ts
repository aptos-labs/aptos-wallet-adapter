const isProd = process.env.NODE_ENV === "production";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServerHandlers: [],

  devServer: {
    port: 3001,
  },
  ssr: false, // Ensure static generation
  app: {
    baseURL: isProd ? "/aptos-wallet-adapter/nuxt-example" : "", // Must match your GitHub Pages repo path
    cdnURL: isProd ? "/aptos-wallet-adapter/nuxt-example" : "", // Ensures assets load from correct path
  },

  modules: ["@nuxt/eslint", "@nuxtjs/color-mode", "@nuxtjs/google-fonts"],
  plugins: ["~/plugins/buffer"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
      extensions: [".vue"],
    },
  ],

  nitro: {
    compressPublicAssets: true,
    preset: "static",
  },

  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  colorMode: {
    preference: "system",
    fallback: "light",
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
  },

  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        verbatimModuleSyntax: false,
        types: ["node"],
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        baseUrl: ".",
      },
    },
  },

  compatibilityDate: "2024-07-12",
});
