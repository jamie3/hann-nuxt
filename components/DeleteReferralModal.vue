<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeModal"
  >
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-900">Delete Referral</h3>
      </div>

      <!-- Modal Body -->
      <div class="mt-4">
        <p class="text-sm text-gray-700 mb-4">
          Are you sure you want to delete this referral? This action cannot be undone.
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Type <span class="font-bold">Yes</span> to confirm:
          </label>
          <input
            v-model="confirmText"
            type="text"
            placeholder="Yes"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            @keyup.enter="handleDelete"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-between pt-4 border-t">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            :disabled="!isConfirmed || isDeleting"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete Referral' }}
          </button>
        </div>
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

const confirmText = ref('');
const isDeleting = ref(false);
const errorMessage = ref('');

// Check if user typed "Yes" exactly
const isConfirmed = computed(() => confirmText.value === 'Yes');

// Watch for modal opening to reset state
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      confirmText.value = '';
      errorMessage.value = '';
    }
  }
);

const closeModal = () => {
  emit('update:modelValue', false);
  confirmText.value = '';
  errorMessage.value = '';
};

const handleDelete = async () => {
  if (!isConfirmed.value) return;

  isDeleting.value = true;
  errorMessage.value = '';

  try {
    await $fetch(`/api/referral/${props.referralId}/delete`, {
      method: 'POST',
    });

    emit('deleted');
    closeModal();
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to delete referral. Please try again.';
  } finally {
    isDeleting.value = false;
  }
};
</script>
