<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeModal"
  >
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-900">Unlock User Account</h3>
      </div>

      <!-- Modal Body -->
      <div class="mt-4">
        <p class="text-sm text-gray-700 mb-4">
          Are you sure you want to unlock this user account? This will reset the failed login
          attempts counter to 0 and allow the user to log in again.
        </p>

        <div v-if="user" class="bg-gray-50 rounded-lg p-3 mb-4">
          <p class="text-sm font-medium text-gray-700">Username:</p>
          <p class="text-base text-gray-900">{{ user.username }}</p>
          <p class="text-sm font-medium text-gray-700 mt-2">Failed Attempts:</p>
          <p class="text-base text-red-600 font-semibold">{{ user.failed_login_attempts }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleUnlock"
            :disabled="isUnlocking"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isUnlocking ? 'Unlocking...' : 'Unlock Account' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/server/types/user-types';

interface Props {
  modelValue: boolean;
  user: User | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  unlocked: [];
}>();

const isUnlocking = ref(false);
const errorMessage = ref('');

const closeModal = () => {
  emit('update:modelValue', false);
  errorMessage.value = '';
};

const handleUnlock = async () => {
  if (!props.user) return;

  isUnlocking.value = true;
  errorMessage.value = '';

  try {
    await $fetch(`/api/users/${props.user.id}/unlock`, {
      method: 'POST',
    });

    emit('unlocked');
    closeModal();
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to unlock user account';
  } finally {
    isUnlocking.value = false;
  }
};
</script>
