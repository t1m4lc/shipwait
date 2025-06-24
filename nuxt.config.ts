import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/seo",
    "@nuxt/content",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "shadcn-nuxt",
    "@nuxtjs/supabase",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-gtag",
    "@nuxt/image",
    "@vueuse/motion/nuxt",
    "@unlok-co/nuxt-stripe",
    "@hebilicious/vue-query-nuxt",
  ],
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        { name: "format-detection", content: "telephone=no" },
        { name: "theme-color", content: "#3b82f6" },
        { name: "msapplication-TileColor", content: "#3b82f6" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#3b82f6" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        { rel: "dns-prefetch", href: "https://api.shipwait.com" },
      ],
    },
  },
  site: {
    url:
      process.env.NODE_ENV === "production"
        ? "https://www.shipwait.com"
        : "http://localhost:3000",
    name: "ShipWait",
    description:
      "Create landing pages and collect emails in minutes. Test your ideas and build only what people want.",
    defaultLocale: "en",
  },
  seo: {
    redirectToCanonicalSiteUrl: true,
  },
  schemaOrg: {
    identity: {
      type: "Organization",
      name: "ShipWait",
      url: "https://www.shipwait.com",
      logo: "https://www.shipwait.com/img/logo.png",
      sameAs: ["https://twitter.com/shipwait"],
    },
  },
  routeRules: {
    "/": { prerender: true },
    "/login": { prerender: true },
    "/register": { prerender: true },
    "/privacy": { prerender: true },
    "/terms": { prerender: true },
    "/confirm": { prerender: true },

    "/dashboard/**": {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      baseUrl:
        process.env.NODE_ENV === "production"
          ? "https://www.shipwait.com"
          : "http://localhost:3000",
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      // The @unlok-co/nuxt-stripe module will handle the public key via its own config
    },
    private: {
      supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
      // stripeWebhookSecret will be accessed via process.env directly in the webhook handler
    },
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: ["/dashboard(/*)?"],
      exclude: [],
      saveRedirectToCookie: true,
    },
  },
  stripe: {
    server: {
      key: process.env.STRIPE_SECRET_KEY, // Module uses this env var
      options: {
        apiVersion: "2025-04-30.basil",
      },
    },
    client: {
      key: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, // Module uses this env var
      options: {},
    },
  },
  gtag: {
    id: "G-79YH0XF4RZ",
    enabled: process.env.NODE_ENV === "production",
  },
  vueQuery: {
    // Nuxt module configuration for vue-query
    queryClientOptions: {
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          // You can add other default query options here
        },
      },
    },
    // You can also enable devtools if you install them separately
    // devtools: {
    //   initialIsOpen: false,
    // },
  },
  compatibilityDate: "2024-11-01",
  devtools: {
    enabled: process.env.NODE_ENV === "development",

    timeline: {
      enabled: true,
    },
  },
});
