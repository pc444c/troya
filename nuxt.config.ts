export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxtjs/color-mode'],

  css: ['~/assets/css/main.css'],

  ui: {
  theme: {
    default: 'dark', // Всегда тёмная тема
  }
},

  colorMode: {
    preference: 'dark', // по умолчанию тёмная
    fallback: 'dark',   // если не поддерживается, то тоже тёмная
    classSuffix: ''     // чтобы классы были .dark, а не .dark-mode
  }
})