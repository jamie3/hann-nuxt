<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeModal"
  >
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-900">Edit Clinical Note</h3>
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
      <form @submit.prevent="handleSubmit" class="mt-4">
        <!-- Session Date -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Session Date <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.sessionDate"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Content -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Content <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.content"
            required
            rows="8"
            placeholder="Enter clinical note content..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
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
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClinicalNote } from '~/server/types/clinical-note-types';
import { utcToLocalDateString, localDateStringToUTC } from '~/utils/dateTimeUtils';

interface Props {
  modelValue: boolean;
  clinicalNote: ClinicalNote | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  updated: [];
}>();

const isSubmitting = ref(false);
const errorMessage = ref('');

// Form data
const formData = ref({
  sessionDate: '',
  content: '',
});

// Watch for clinical note changes and populate form
watch(
  () => props.clinicalNote,
  (note) => {
    if (note) {
      formData.value = {
        sessionDate: utcToLocalDateString(note.session_date),
        content: note.content,
      };
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit('update:modelValue', false);
  errorMessage.value = '';
};

const handleSubmit = async () => {
  if (!props.clinicalNote) return;

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    await $fetch(`/api/clinical-notes/${props.clinicalNote.id}/update`, {
      method: 'POST',
      body: {
        sessionDate: localDateStringToUTC(formData.value.sessionDate),
        content: formData.value.content,
      },
    });

    emit('updated');
    closeModal();
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to update clinical note. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
