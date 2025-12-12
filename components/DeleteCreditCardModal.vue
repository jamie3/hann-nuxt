<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeModal"
  >
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-900">Delete Credit Card</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="mt-4">
        <div class="flex items-start space-x-3">
          <div
            class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
          >
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-700">
              Are you sure you want to delete this credit card? This action cannot be undone.
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-3 pt-4 mt-4 border-t">
        <button
          type="button"
          @click="closeModal"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleDelete"
          :disabled="isDeleting"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete Card' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  referralId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  deleted: [];
}>();

const isDeleting = ref(false);
const errorMessage = ref('');

const closeModal = () => {
  if (isDeleting.value) return;
  emit('update:modelValue', false);
  errorMessage.value = '';
};

const handleDelete = async () => {
  isDeleting.value = true;
  errorMessage.value = '';

  try {
    await $fetch(`/api/referral/${props.referralId}/credit-card`, {
      method: 'DELETE',
    });

    emit('deleted');
    closeModal();
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to delete credit card';
  } finally {
    isDeleting.value = false;
  }
};
</script>
