<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Hann Psychological Services
          </h1>
          <p class="text-xl text-gray-600">
            Full-stack Nuxt 4 application with authentication and database
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="grid md:grid-cols-2 gap-6 mb-12">
          <NuxtLink
            to="/login"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center mb-4">
              <svg
                class="h-8 w-8 text-blue-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                ></path>
              </svg>
              <h2 class="text-2xl font-semibold text-gray-900">Login</h2>
            </div>
            <p class="text-gray-600">
              Access your account with username and password authentication
            </p>
          </NuxtLink>

          <NuxtLink
            to="/health"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center mb-4">
              <svg
                class="h-8 w-8 text-green-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h2 class="text-2xl font-semibold text-gray-900">Health Check</h2>
            </div>
            <p class="text-gray-600">Monitor system health and database connectivity status</p>
          </NuxtLink>
        </div>

        <!-- Tech Stack -->
        <div class="bg-white rounded-lg shadow-md p-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Tech Stack</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="font-semibold text-gray-900">Nuxt 4</p>
              <p class="text-sm text-gray-600">SSR Framework</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="font-semibold text-gray-900">Kysely</p>
              <p class="text-sm text-gray-600">Type-safe SQL</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="font-semibold text-gray-900">PostgreSQL</p>
              <p class="text-sm text-gray-600">Database</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="font-semibold text-gray-900">Tailwind</p>
              <p class="text-sm text-gray-600">CSS Framework</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="font-semibold text-gray-900">vee-validate</p>
              <p class="text-sm text-gray-600">Form Validation</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="font-semibold text-gray-900">Zod</p>
              <p class="text-sm text-gray-600">Schema Validation</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="font-semibold text-gray-900">nuxt-auth-utils</p>
              <p class="text-sm text-gray-600">Authentication</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="font-semibold text-gray-900">bcrypt</p>
              <p class="text-sm text-gray-600">Password Hashing</p>
            </div>
          </div>
        </div>

        <!-- Features List -->
        <div class="mt-8 bg-white rounded-lg shadow-md p-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">Features</h3>
          <ul class="space-y-3">
            <li class="flex items-start">
              <svg
                class="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-700">User authentication with session management</span>
            </li>
            <li class="flex items-start">
              <svg
                class="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-700">Kysely migrations for database schema management</span>
            </li>
            <li class="flex items-start">
              <svg
                class="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-700">Server-side rendering (SSR) with API routes</span>
            </li>
            <li class="flex items-start">
              <svg
                class="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-700">Form validation with vee-validate and zod</span>
            </li>
            <li class="flex items-start">
              <svg
                class="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-700">Health monitoring and status checking</span>
            </li>
            <li class="flex items-start">
              <svg
                class="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span class="text-gray-700">Tailwind CSS for modern, responsive design</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

// Redirect to referrals page
navigateTo('/referrals', { replace: true });

// Set page meta
useHead({
  title: 'Hann Psychological Services - Full-stack Application',
  meta: [
    {
      name: 'description',
      content: 'Full-stack Nuxt 4 application with authentication, database, and modern tooling',
    },
  ],
});
</script>
