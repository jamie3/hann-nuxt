<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <div class="text-center">
        <div v-if="isLoggingOut" class="space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 class="text-xl font-semibold text-gray-800">Logging out...</h2>
          <p class="text-gray-600">Please wait while we sign you out.</p>
        </div>

        <div v-else-if="error" class="space-y-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-800">Logout Failed</h2>
          <p class="text-gray-600">{{ error }}</p>
          <button
            @click="handleLogout"
            class="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Try Again
          </button>
        </div>

        <div v-else class="space-y-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              class="w-6 h-6 text-green-600"
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
          </div>
          <h2 class="text-xl font-semibold text-gray-800">Logged Out Successfully</h2>
          <p class="text-gray-600">You have been successfully logged out.</p>
          <p class="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'login',
});

// Use auth composable
const { performLogout, loading, error: authError } = useAuth();

const isLoggingOut = computed(() => loading.value);
const error = computed(() => authError.value);

const handleLogout = async () => {
  await performLogout();
};

// Automatically trigger logout when the page loads
onMounted(() => {
  handleLogout();
});
</script>
