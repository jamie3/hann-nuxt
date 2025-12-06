<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading clinical note...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Clinical Note Details -->
    <div v-else-if="clinicalNote" class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <NuxtLink
          to="/clinical-notes"
          class="text-blue-600 hover:text-blue-800 flex items-center mb-2"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Clinical Notes
        </NuxtLink>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Clinical Note</h1>
            <p v-if="referralName" class="mt-2 text-2xl font-bold text-gray-800">
              {{ referralName }}
            </p>
          </div>
          <div class="flex gap-3">
            <NuxtLink
              :to="`/referrals/${clinicalNote.referral_id}`"
              class="px-4 py-2 border-2 border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              View Referral
            </NuxtLink>
            <button
              @click="handleEdit"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
              Edit Note
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
              Delete Note
            </button>
          </div>
        </div>
      </div>

      <!-- Clinical Note Content -->
      <div class="bg-white shadow-sm rounded-lg p-6">
        <!-- Session Date -->
        <div class="mb-6">
          <h2 class="text-sm font-medium text-gray-500 mb-1">Session Date</h2>
          <p class="text-lg font-semibold text-gray-900">
            {{ formatDate(clinicalNote.session_date) }}
          </p>
        </div>

        <!-- Content -->
        <div class="mb-6">
          <h2 class="text-sm font-medium text-gray-500 mb-2">Content</h2>
          <div class="prose max-w-none">
            <p class="text-gray-900 whitespace-pre-line">{{ clinicalNote.content }}</p>
          </div>
        </div>

        <!-- Metadata -->
        <div class="pt-6 border-t border-gray-200">
          <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span class="font-medium">Created:</span>
              {{ formatDateTimeFull(clinicalNote.created_at) }}
            </div>
            <div>
              <span class="font-medium">Last Updated:</span>
              {{ formatDateTimeFull(clinicalNote.updated_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditClinicalNoteModal
      v-model="showEditModal"
      :clinicalNote="clinicalNote"
      @updated="handleNoteUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteClinicalNoteModal
      v-model="showDeleteModal"
      :clinicalNoteId="id"
      @deleted="handleNoteDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { formatDate, formatDateTimeFull } from '~/utils/dateTimeUtils';
import type { ClinicalNote } from '~/server/types/clinical-note-types';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

const clinicalNote = ref<ClinicalNote | null>(null);
const referralName = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

// Fetch clinical note
const fetchClinicalNote = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch<{ success: boolean; clinicalNote: ClinicalNote }>(
      `/api/clinical-notes/${id}`
    );

    if (response && response.clinicalNote) {
      clinicalNote.value = response.clinicalNote;
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to load clinical note';
    clinicalNote.value = null;
  } finally {
    loading.value = false;
  }
};

// Fetch referral name
const fetchReferralName = async (referralId: string) => {
  try {
    const response = await $fetch<{ success: boolean; referral: any }>(
      `/api/referral/${referralId}`
    );

    if (response && response.referral) {
      referralName.value = `${response.referral.first_name} ${response.referral.last_name}`;
    }
  } catch (err) {
    console.error('Failed to fetch referral name:', err);
  }
};

// Fetch clinical note on mount
await fetchClinicalNote();

// Fetch referral name if note was loaded
if (clinicalNote.value?.referral_id) {
  await fetchReferralName(clinicalNote.value.referral_id);
}

// Set page meta
useHead({
  title: computed(() =>
    clinicalNote.value
      ? `Clinical Note - ${formatDate(clinicalNote.value.session_date)}`
      : 'Clinical Note'
  ),
});

// Handle edit action
const handleEdit = () => {
  showEditModal.value = true;
};

// Handle note updated
const handleNoteUpdated = () => {
  fetchClinicalNote();
};

// Handle delete - open modal
const handleDelete = () => {
  showDeleteModal.value = true;
};

// Handle note deleted
const handleNoteDeleted = () => {
  // Redirect to previous page after successful deletion
  router.back();
};
</script>
