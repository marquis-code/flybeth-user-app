import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,

  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
      paystackPublicKey: process.env.NUXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SlIe6FOWpTToNxe7GNqR7K9UbWopqhPgQ3rrJBuG3iqQdEhP7nf3VJ2JDxHaL2g9YMiLpqo9TiXsW6AiyDfNXQ00i1AqxHyG',
      googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
    },
  },

  devServer: {
    port: 3001,
    host: 'localhost' // or '0.0.0.0' to allow external access
  },

  app: {
    head: {
      title: "Flybeth | Premium Flights & Stays Aggregator",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },

        {
          name: "description",
          content:
            "Flybeth — Book cheap flights, luxury hotels, and vacation rentals. Aggregating the best deals from Hotelbeds, Amadeus, and Duffel for a seamless travel experience.",
        },
        {
          name: "keywords",
          content:
            "cheap flights, hotel booking, travel aggregator, vacation rentals, Flybeth, Hotelbeds, Amadeus travel, Duffel flights",
        },
        { name: "author", content: "Flybeth" },

        // ✅ Open Graph (for social previews)
        { property: "og:title", content: "Flybeth — Book Flights, Hotels & Stays" },
        {
          property: "og:description",
          content:
            "Find the best travel deals globally. Book cheap flights, luxury hotels, and vacation rentals with Flybeth.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://flybeth.com" },
        { property: "og:image", content: "https://flybeth.com/og-image.jpg" },

        // ✅ Twitter meta
        { name: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://flybeth.com" },
        { name: "twitter:title", content: "Flybeth — Online Flight & Hotel Booking" },
        {
          name: "twitter:description",
          content:
            "Book verified travel deals online and access secure booking services with Flybeth.",
        },
        { name: "twitter:image", content: "https://flybeth.com/og-image.jpg" },
      ],

      link: [
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],

      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
          type: "text/javascript",
        },
      ],
    },
  },

  build: {
    transpile: ["lucide-vue-next"],
  },

  css: ["/assets/css/main.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxtjs/seo",
    "@nuxtjs/i18n",
  ],

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'es', iso: 'es-ES', file: 'es.json', name: 'Español' },
      { code: 'fr', iso: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'de', iso: 'de-DE', file: 'de.json', name: 'Deutsch' },
      { code: 'ar', iso: 'ar-SA', file: 'ar.json', name: 'العربية', dir: 'rtl' },
      { code: 'zh', iso: 'zh-CN', file: 'zh.json', name: '中文' },
      { code: 'ja', iso: 'ja-JP', file: 'ja.json', name: '日本語' },
      { code: 'pt', iso: 'pt-BR', file: 'pt.json', name: 'Português' },
      { code: 'it', iso: 'it-IT', file: 'it.json', name: 'Italiano' },
      { code: 'ko', iso: 'ko-KR', file: 'ko.json', name: '한국어' },
      { code: 'tr', iso: 'tr-TR', file: 'tr.json', name: 'Türkçe' },
      { code: 'hi', iso: 'hi-IN', file: 'hi.json', name: 'हिन्दी' }
    ],
    defaultLocale: 'en',
    langDir: 'lang/',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true
    }
  },

  sitemap: {
    hostname: 'https://flybeth.com',
    gzip: true,
    routes: [
      '/',
      '/auth/login',
      '/auth/register',
    ],
  },

  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/dashboard', '/admin'],
    Sitemap: 'https://flybeth.com/sitemap.xml',
  },

  seo: {
    enabled: true,
    meta: {
      title: 'Flybeth - Your Gateway to Global Travel',
      description: 'Find and book the best travel deals globally. Aggregated from top-tier providers like Hotelbeds, Amadeus, and Duffel.',
      keywords: 'flights, hotels, vacations, travel, flybeth',
      ogTitle: 'Flybeth - Your Gateway to Global Travel',
      ogDescription: 'Find and book the best travel deals globally. Aggregated from top-tier providers like Hotelbeds, Amadeus, and Duffel.',
      ogImage: '/img/og-image.jpg',
      twitterCard: 'summary_large_image',
    },
  },

  site: {
    url: 'https://flybeth.com',
    name: 'Flybeth',
  },

  compatibilityDate: "2025-11-01"
});