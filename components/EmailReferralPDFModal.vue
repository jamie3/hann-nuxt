<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    @click.self="close"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Email Referral PDF</h3>
      </div>

      <!-- Body -->
      <div class="px-6 py-4">
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
            <p class="mt-1 text-sm text-gray-500">The PDF will be sent to this email address</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="close"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <svg
                v-if="loading"
                class="animate-spin h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ loading ? 'Sending...' : 'Send Email' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  defaultEmail?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  sent: [email: string];
}>();

const email = ref('');
const loading = ref(false);
const error = ref('');

// Watch for modal opening and set default email
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      email.value = props.defaultEmail || '';
      error.value = '';
    }
  }
);

const close = () => {
  if (!loading.value) {
    emit('update:modelValue', false);
  }
};

const handleSubmit = async () => {
  if (email.value) {
    emit('sent', email.value);
    close();
  }
};
</script>
