<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeModal"
  >
    <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-900">Edit Referral</h3>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- First Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              v-model="formData.first_name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              v-model="formData.last_name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Date of Birth -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input
              v-model="formData.date_of_birth"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Primary Telephone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Primary Telephone *</label>
            <input
              v-model="formData.primary_telephone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Secondary Telephone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Secondary Telephone</label>
            <input
              v-model="formData.secondary_telephone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Parents/Guardians -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Parents/Guardians</label>
            <input
              v-model="formData.parents_guardians"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Referral Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Referral Type *</label>
            <select
              v-model="formData.referral_type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select type</option>
              <option value="self">Self</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <!-- Requested Service -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Requested Service *</label>
            <select
              v-model="formData.requested_service"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select a service</option>
              <option v-for="service in REQUESTED_SERVICES" :key="service" :value="service">
                {{ service }}
              </option>
            </select>
          </div>

          <!-- Referrer Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Referrer Name</label>
            <input
              v-model="formData.referrer_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Referrer Relationship -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Referrer Relationship</label
            >
            <input
              v-model="formData.referrer_relationship"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Referrer Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Referrer Email</label>
            <input
              v-model="formData.referrer_email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Method of Payment -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Method of Payment</label>
            <input
              v-model="formData.method_of_payment"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Mailing Address (full width) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Mailing Address</label>
            <input
              v-model="formData.mailing_address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Presenting Issues (full width) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Presenting Issues</label>
            <textarea
              v-model="formData.presenting_issues"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
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
import type { Referral } from '~/server/types/referral-types';
import { REQUESTED_SERVICES } from '~/server/types/requested-service';

interface Props {
  modelValue: boolean;
  referral: Referral | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  updated: [];
}>();

const { updateReferral } = useReferral();

const isSubmitting = ref(false);
const errorMessage = ref('');

// Form data
const formData = ref({
  first_name: '',
  last_name: '',
  date_of_birth: '',
  primary_telephone: '',
  secondary_telephone: '',
  email: '',
  parents_guardians: '',
  referral_type: '',
  requested_service: '',
  referrer_name: '',
  referrer_relationship: '',
  referrer_email: '',
  method_of_payment: '',
  mailing_address: '',
  presenting_issues: '',
});

// Watch for referral changes and populate form
watch(
  () => props.referral,
  (newReferral) => {
    if (newReferral) {
      formData.value = {
        first_name: newReferral.first_name,
        last_name: newReferral.last_name,
        date_of_birth: new Date(newReferral.date_of_birth).toISOString().split('T')[0],
        primary_telephone: newReferral.primary_telephone,
        secondary_telephone: newReferral.secondary_telephone || '',
        email: newReferral.email || '',
        parents_guardians: newReferral.parents_guardians || '',
        referral_type: newReferral.referral_type,
        requested_service: newReferral.requested_service,
        referrer_name: newReferral.referrer_name || '',
        referrer_relationship: newReferral.referrer_relationship || '',
        referrer_email: newReferral.referrer_email || '',
        method_of_payment: newReferral.method_of_payment || '',
        mailing_address: newReferral.mailing_address || '',
        presenting_issues: newReferral.presenting_issues || '',
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
  if (!props.referral) return;

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    await updateReferral(props.referral.id, formData.value);

    emit('updated');
    closeModal();
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to update referral. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
