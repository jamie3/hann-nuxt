<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="close"
  >
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
          >
            <svg
              class="h-6 w-6 text-green-600"
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
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          </div>
        </div>
        <div class="mt-2 px-1">
          <p class="text-sm text-gray-700">{{ message }}</p>
        </div>
        <div class="mt-6">
          <button
            @click="close"
            class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  title?: string;
  message: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const close = () => {
  emit('update:modelValue', false);
};
</script>
