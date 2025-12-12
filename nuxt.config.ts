// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils', '@nuxtjs/turnstile'],

  nitro: {
    experimental: {
      bodySizeLimit: '500mb',
    } as any,
  },

  turnstile: {
    siteKey: process.env.NUXT_TURNSTILE_SITE_KEY || '',
  },

  runtimeConfig: {
    turnstile: {
      // This can be overridden at runtime via the NUXT_TURNSTILE_SECRET_KEY
      // environment variable.
      secretKey: '',
    },
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || '',
      name: process.env.DATABASE_NAME || 'hann',
      caCertificate: process.env.DATABASE_CA_CERTIFICATE || '',
    },
    public: {
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    },
  },
});
