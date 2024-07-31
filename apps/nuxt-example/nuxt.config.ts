// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServerHandlers: [],

  devServer: {
    port: 3001,
  },

  modules: ["@nuxtjs/color-mode", "@nuxtjs/google-fonts"],

  components: [
    {
      path: "~/components",
      pathPrefix: false,
      extensions: [".vue"],
    },
  ],

  nitro: {
    compressPublicAssets: true,
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
