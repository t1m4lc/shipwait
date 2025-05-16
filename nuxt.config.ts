import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "shadcn-nuxt",
    "@nuxtjs/supabase",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-gtag",
    "@nuxt/image",
  ],
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  routeRules: {
    "/": { prerender: true },
    "/login": { prerender: true },
    "/register": { prerender: true },
    "/privacy": { prerender: true },
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
    private: {
      supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
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
  gtag: {
    id: "G-79YH0XF4RZ",
    enabled: process.env.NODE_ENV === "production",
  },
  compatibilityDate: "2024-11-01",
  devtools: {
    enabled: process.env.NODE_ENV === "development",

    timeline: {
      enabled: true,
    },
  },
});
