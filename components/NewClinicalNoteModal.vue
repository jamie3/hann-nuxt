<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeModal"
  >
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-900">New Clinical Note</h3>
      </div>

      <!-- Loading Referrals -->
      <div v-if="loadingReferrals" class="text-center py-8">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
        ></div>
        <p class="mt-4 text-gray-600">Loading referrals...</p>
      </div>

      <!-- Modal Body -->
      <form v-else @submit.prevent="handleSubmit" class="mt-4">
        <!-- Referral Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Referral <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.referralId"
            required
            :disabled="!!referralId"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a referral</option>
            <option v-for="referral in referrals" :key="referral.id" :value="referral.id">
              {{ referral.first_name }} {{ referral.last_name }} (#{{
                referral.id.substring(0, 8)
              }})
            </option>
          </select>
        </div>

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
            {{ isSubmitting ? 'Creating...' : 'Create Note' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  referralId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  created: [];
}>();

const { createClinicalNote } = useClinicalNotes();

const isSubmitting = ref(false);
const errorMessage = ref('');
const loadingReferrals = ref(false);
const referrals = ref<any[]>([]);

// Form data
const formData = ref<{
  referralId: string;
  sessionDate: string;
  content: string;
}>({
  referralId: props.referralId || '',
  sessionDate: new Date().toISOString().split('T')[0], // Today's date
  content: '',
});

// Load referrals when modal opens
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      // Reset form when modal opens
      formData.value = {
        referralId: props.referralId || '',
        sessionDate: new Date().toISOString().split('T')[0],
        content: '',
      };
      errorMessage.value = '';

      // Load referrals if not already loaded
      if (referrals.value.length === 0) {
        loadingReferrals.value = true;
        try {
          const { data, error } = await useFetch('/api/referrals');
          if (error.value) {
            errorMessage.value = 'Failed to load referrals';
          } else if (data.value) {
            referrals.value = (data.value as any).referrals || [];
          }
        } catch (err: any) {
          errorMessage.value = err.message || 'Failed to load referrals';
        } finally {
          loadingReferrals.value = false;
        }
      }
    }
  }
);

const closeModal = () => {
  emit('update:modelValue', false);
  errorMessage.value = '';
};

const handleSubmit = async () => {
  const referralId: string = formData.value.referralId || '';

  if (!referralId) {
    errorMessage.value = 'Please select a referral';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    await createClinicalNote({
      referralId,
      sessionDate: formData.value.sessionDate,
      content: formData.value.content,
    });

    emit('created');
    closeModal();
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to create clinical note. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
