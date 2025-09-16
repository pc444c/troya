// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/icon',
    '@nuxt/eslint',
    "@vuestic/nuxt",
    '@nuxtjs/tailwindcss'
  ],
  css: ['vuestic-ui/css'],
  vuestic: {
    config: {
     
    }
  }
})