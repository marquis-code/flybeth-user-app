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
    },
  },

  devServer: {
    port: 3001,
    host: 'localhost' // or '0.0.0.0' to allow external access
  },

  app: {
    head: {
      title: "Doctor dey consulting | Admin Dashboard",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },

        // ✅ SEO meta
        {
          name: "description",
          content:
            "Doctor dey consulting — Book verified doctors, schedule medical appointments, and access secure telehealth and in-clinic consultations. Seamless healthcare access in Nigeria.",
        },
        {
          name: "keywords",
          content:
            "doctor booking, medical appointments, telehealth, online consultation, Nigeria healthcare, book doctors online, telemedicine, Doctor dey consulting",
        },
        { name: "author", content: "Doctor dey consulting" },

        // ✅ Open Graph (for social previews)
        { property: "og:title", content: "Doctor dey consulting — Book Doctors & Medical Consultations" },
        {
          property: "og:description",
          content:
            "Find trusted medical professionals and book appointments instantly with Doctor dey consulting. Access telemedicine and in-person care securely.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://drconnect.ng" },
        { property: "og:image", content: "https://drconnect.ng/og-image.jpg" },

        // ✅ Twitter meta
        { name: "twitter:card", content: "summary_large_image" },
        { property: "twitter:url", content: "https://drconnect.ng" },
        { name: "twitter:title", content: "Doctor dey consulting — Online Doctor Booking & Telehealth" },
        {
          name: "twitter:description",
          content:
            "Book verified doctors online and access secure telehealth services with Doctor dey consulting.",
        },
        { name: "twitter:image", content: "https://drconnect.ng/og-image.jpg" },
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
  ],

  sitemap: {
    hostname: 'https://lolaapril.com',
    gzip: true,
    routes: [
      '/',
      '/auth/login',
      '/auth/register',
      '/features',
      '/pricing',
      '/about',
      '/contact',
    ],
  },

  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/dashboard', '/admin'],
    Sitemap: 'https://lolaapril.com/sitemap.xml',
  },

  seo: {
    enabled: true,
    meta: {
      title: 'LolaApril Business Suite - All-in-One Salon & Spa Management Platform',
      description: 'Stop losing clients to no-shows and chaos. LolaApril helps salons, spas, and wellness businesses manage bookings, teams, finances, and multi-location operations from one intelligent dashboard. Trusted by 500+ businesses across Nigeria.',
      keywords: 'salon management software, spa booking system, wellness business platform, appointment scheduling, staff management, salon POS, multi-location management, Nigeria salon software, beauty business management, no-show reduction, KYC verification, automated reminders',
      ogTitle: 'LolaApril Business Suite - All-in-One Salon & Spa Management Platform',
      ogDescription: 'Manage bookings, teams, finances, and multi-location operations for your salon, spa, or wellness business. Reduce no-shows by 32% and save 4 hours daily.',
      ogImage: '/img/og-image.jpg',
      twitterCard: 'summary_large_image',
    },
  },

  compatibilityDate: "2025-11-01"
});