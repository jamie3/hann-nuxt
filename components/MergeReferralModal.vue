<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeModal"
  >
    <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Merge Referral</h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            :disabled="loading"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Current Referral Info -->
        <div class="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <p class="text-sm font-medium text-blue-900 mb-1">Primary Referral (Keep This One)</p>
          <p class="text-sm text-blue-800">
            <span class="font-semibold"
              >{{ currentReferral.first_name }} {{ currentReferral.last_name }}</span
            >
            <span v-if="currentReferral.date_of_birth" class="ml-2">
              • DOB: {{ formatDate(currentReferral.date_of_birth) }}
            </span>
            <span v-if="currentReferral.email" class="ml-2">• {{ currentReferral.email }}</span>
          </p>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <p class="text-sm text-gray-700 mb-4">
            Select a referral to merge into the primary referral. All clinical notes, files, emails,
            and credit card information from the secondary referral will be moved to the primary
            referral. The secondary referral will be archived.
          </p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
            <p class="text-sm text-yellow-800">
              <strong>Warning:</strong> This action cannot be undone. Make sure you're merging the
              correct referrals before proceeding.
            </p>
          </div>
        </div>

        <!-- Search and Select Referral -->
        <div class="mb-6">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            Search for Referral to Merge
          </label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            :disabled="loading"
          />

          <!-- Referral List -->
          <div
            v-if="filteredReferrals.length > 0"
            class="border border-gray-300 rounded-md max-h-60 overflow-y-auto"
          >
            <button
              v-for="referral in filteredReferrals"
              :key="referral.id"
              @click="selectReferral(referral)"
              :disabled="loading"
              class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors disabled:opacity-50"
              :class="{ 'bg-blue-50 hover:bg-blue-100': selectedReferral?.id === referral.id }"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ referral.first_name }} {{ referral.last_name }}
                  </p>
                  <p class="text-xs text-gray-600 mt-1">
                    <span v-if="referral.date_of_birth">
                      DOB: {{ formatDate(referral.date_of_birth) }}
                    </span>
                    <span v-if="referral.email" class="ml-2">{{ referral.email }}</span>
                    <span class="ml-2">• Status: {{ referral.status }}</span>
                  </p>
                </div>
                <div
                  v-if="selectedReferral?.id === referral.id"
                  class="ml-2 flex-shrink-0 text-blue-600"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
            </button>
          </div>
          <div
            v-else-if="searchQuery && !loadingReferrals"
            class="text-center py-8 text-gray-500 border border-gray-300 rounded-md"
          >
            <p class="text-sm">No referrals found matching "{{ searchQuery }}"</p>
          </div>
          <div v-else-if="loadingReferrals" class="text-center py-8">
            <div
              class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
            ></div>
            <p class="mt-2 text-sm text-gray-600">Loading referrals...</p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3">
          <button
            @click="closeModal"
            :disabled="loading"
            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="handleMerge"
            :disabled="!selectedReferral || loading"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Merging...</span>
            <span v-else>Merge Referrals</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/dateTimeUtils';
import type { Referral } from '~/server/types/referral-types';

const props = defineProps<{
  modelValue: boolean;
  currentReferral: Referral;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'merged'): void;
}>();

const searchQuery = ref('');
const selectedReferral = ref<Referral | null>(null);
const loading = ref(false);
const loadingReferrals = ref(false);
const error = ref('');
const referralsList = ref<Referral[]>([]);
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

// Fetch referrals when search query changes (with debounce)
const fetchReferrals = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    referralsList.value = [];
    return;
  }

  loadingReferrals.value = true;
  try {
    const response = await $fetch('/api/referrals', {
      params: {
        search: searchQuery.value,
        limit: 50,
      },
    });

    // Filter out the current referral
    referralsList.value = response.referrals.filter(
      (r: Referral) => r.id !== props.currentReferral.id
    );
  } catch (err) {
    console.error('Failed to fetch referrals:', err);
  } finally {
    loadingReferrals.value = false;
  }
};

watch(searchQuery, () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = setTimeout(() => {
    fetchReferrals();
  }, 300);
});

const filteredReferrals = computed(() => {
  return referralsList.value;
});

const selectReferral = (referral: Referral) => {
  selectedReferral.value = referral;
  error.value = '';
};

const handleMerge = async () => {
  if (!selectedReferral.value) return;

  // Confirm action
  const confirmed = confirm(
    `Are you sure you want to merge "${selectedReferral.value.first_name} ${selectedReferral.value.last_name}" into "${props.currentReferral.first_name} ${props.currentReferral.last_name}"?\n\nThis will move all clinical notes, files, emails, and credit card information to the primary referral. This action cannot be undone.`
  );

  if (!confirmed) return;

  loading.value = true;
  error.value = '';

  try {
    await $fetch(`/api/referral/${props.currentReferral.id}/merge`, {
      method: 'POST',
      body: {
        secondaryId: selectedReferral.value.id,
      },
    });

    emit('merged');
    closeModal();
  } catch (err: any) {
    console.error('Failed to merge referrals:', err);
    error.value = err.data?.message || err.statusMessage || 'Failed to merge referrals';
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  if (loading.value) return;
  emit('update:modelValue', false);
  // Reset state
  setTimeout(() => {
    searchQuery.value = '';
    selectedReferral.value = null;
    error.value = '';
    referralsList.value = [];
  }, 300);
};
</script>
