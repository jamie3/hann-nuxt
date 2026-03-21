<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg mx-auto">
      <div class="bg-white shadow-sm rounded-lg p-8 text-center">
        <div class="flex justify-center mb-4">
          <div class="flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg
              class="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Payment Information Saved</h1>
        <p class="text-gray-600">
          Thank you! Your credit card information has been securely saved. You may now close this
          page.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'login',
});
</script>
