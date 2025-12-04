<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">{{ error?.statusCode || 404 }}</h1>
      <p class="text-xl text-gray-600 mb-8">{{ error?.statusMessage || 'Page Not Found' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error?: {
    statusCode?: number;
    statusMessage?: string;
  };
}

const props = defineProps<Props>();
</script>
