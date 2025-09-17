// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui', 
    '@nuxt/image',
    '@vite-pwa/nuxt' // Добавляем PWA модуль
  ],
  css: ['~/assets/css/main.css'],
  
  // PWA конфигурация
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Троя Коды',
      short_name: 'Troya',
      description: 'Троя - запись кодов',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      id: '/',
      icons: [
        {
          src: 'logo.webp',
          sizes: '128x128',
          type: 'image/png'
        },
       
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 365 дней
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600 // Проверка обновлений каждый час
    },
    devOptions: {
      enabled: false,
      type: 'module'
    }
  },

  // Конфигурация приложения
  app: {
    head: {
      title: 'Троя коды',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'description', content: 'PWA приложение Troya' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Troya' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logo.webp' },
        { rel: 'apple-touch-icon', href: '/logo.webp' }
      ],
      htmlAttrs: {
        lang: 'ru'
      }
    }
  },

  // Оптимизация для PWA
  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  // Настройки сборки
  vite: {
    build: {
      target: 'esnext'
    }
  }
})