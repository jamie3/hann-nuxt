<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">
        System Health Status
      </h1>

      <div v-if="pending" class="text-center py-8">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p class="mt-4 text-gray-600">Checking system health...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div class="flex items-center mb-2">
          <svg class="h-6 w-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-xl font-semibold text-red-800">System Unhealthy</h2>
        </div>
        <p class="text-red-700 mb-2">{{ error.statusMessage }}</p>
        <div v-if="error.data" class="mt-4 bg-red-100 p-3 rounded">
          <p class="text-sm text-red-800"><strong>Database:</strong> {{ error.data.database }}</p>
          <p class="text-sm text-red-800"><strong>Timestamp:</strong> {{ error.data.timestamp }}</p>
          <p v-if="error.data.error" class="text-sm text-red-800 mt-2">
            <strong>Error:</strong> {{ error.data.error }}
          </p>
        </div>
      </div>

      <div v-else-if="data" class="space-y-4">
        <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div class="flex items-center">
            <svg class="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h2 class="text-xl font-semibold text-green-800">System Healthy</h2>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Status</p>
            <p class="text-lg font-semibold text-gray-900 capitalize">{{ data.status }}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Service</p>
            <p class="text-lg font-semibold text-gray-900 capitalize">{{ data.service }}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Database</p>
            <p class="text-lg font-semibold text-gray-900 capitalize">{{ data.database }}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Last Check</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ new Date(data.timestamp).toLocaleString() }}
            </p>
          </div>
        </div>

        <button
          @click="refresh"
          class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Refresh Status
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { data, error, pending, refresh } = await useFetch('/api/health')
</script>
