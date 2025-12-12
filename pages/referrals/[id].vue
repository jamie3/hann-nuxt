<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading referral...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Referral Details -->
    <div v-else-if="referral">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <NuxtLink
              to="/referrals"
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
              Back to Referrals
            </NuxtLink>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold text-gray-900">
                {{ referral.first_name }} {{ referral.last_name }}
              </h1>

              <!-- Referral Type Badge -->
              <span
                class="px-3 py-1 text-sm font-semibold rounded-full"
                :class="
                  referral.referral_type === 'professional'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                "
              >
                {{ referral.referral_type === 'professional' ? 'Professional' : 'Self' }}
              </span>

              <!-- Status Badge -->
              <span
                class="px-3 py-1 text-sm font-semibold rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': referral.status === 'new',
                  'bg-blue-100 text-blue-800': referral.status === 'opened',
                  'bg-gray-100 text-gray-800': referral.status === 'closed',
                }"
              >
                {{ referral.status }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- Edit Button -->
            <button
              @click="openEditModal"
              :disabled="referral.status === 'closed'"
              class="px-4 py-2 border-2 border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              :title="
                referral.status === 'closed' ? 'Cannot edit closed referrals' : 'Edit Referral'
              "
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
              Edit Referral
            </button>

            <!-- Download PDF Button -->
            <a
              :href="`/api/referral/${id}/pdf`"
              download
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 flex items-center gap-2"
              title="Download Referral PDF"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Download Referral PDF
            </a>

            <!-- Email PDF Button -->
            <button
              @click="openEmailPDFModal"
              class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 flex items-center gap-2"
              title="Email Referral PDF"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              Email Referral PDF
            </button>

            <!-- Delete Button -->
            <button
              @click="openDeleteModal"
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
              Delete Referral
            </button>

            <!-- Open Button (visible when status is 'new' or 'closed') -->
            <button
              v-if="referral.status === 'new' || referral.status === 'closed'"
              @click="handleOpenReferral"
              :disabled="isUpdating"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                ></path>
              </svg>
              {{ isUpdating ? 'Opening...' : 'Open Referral' }}
            </button>

            <!-- Close Button (visible when status is 'new' or 'opened') -->
            <button
              v-if="referral.status === 'new' || referral.status === 'opened'"
              @click="handleCloseReferral"
              :disabled="isUpdating"
              class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              {{ isUpdating ? 'Closing...' : 'Close Referral' }}
            </button>
          </div>
        </div>

        <!-- Date Information -->
        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
          <div v-if="referral.referred_at">
            <span class="font-medium">Referral Date:</span>
            {{ formatDate(referral.referred_at) }}
          </div>
          <div v-if="referral.opened_at">
            <span class="font-medium">Opened At:</span>
            {{ formatDate(referral.opened_at) }}
          </div>
          <div v-if="referral.closed_at">
            <span class="font-medium">Closed At:</span>
            {{ formatDate(referral.closed_at) }}
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Information -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ referral.date_of_birth ? formatDate(referral.date_of_birth) : '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Gender</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.gender || '-' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Age</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.age }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Age at Referral</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.age_at_referral }}</dd>
            </div>
            <div v-if="referral.parents_guardians">
              <dt class="text-sm font-medium text-gray-500">Parents / Guardians</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.parents_guardians }}</dd>
            </div>
          </dl>
        </div>

        <!-- Contact Information -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Primary Telephone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.primary_telephone }}</dd>
            </div>
            <div v-if="referral.secondary_telephone">
              <dt class="text-sm font-medium text-gray-500">Secondary Telephone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.secondary_telephone }}</dd>
            </div>
            <div v-if="referral.email">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.email }}</dd>
            </div>
            <div v-if="referral.mailing_address">
              <dt class="text-sm font-medium text-gray-500">Mailing Address</dt>
              <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {{ referral.mailing_address }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Referrer Information (Professional Only) -->
        <div
          v-if="referral.referral_type === 'professional'"
          class="bg-white shadow-sm rounded-lg p-6"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Referrer Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="referral.referrer_name">
              <dt class="text-sm font-medium text-gray-500">Referrer Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.referrer_name }}</dd>
            </div>
            <div v-if="referral.referrer_relationship">
              <dt class="text-sm font-medium text-gray-500">Relationship</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.referrer_relationship }}</dd>
            </div>
            <div v-if="referral.referrer_email">
              <dt class="text-sm font-medium text-gray-500">Referrer Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.referrer_email }}</dd>
            </div>
            <div v-if="referral.referrer_prefers_contact !== null">
              <dt class="text-sm font-medium text-gray-500">Prefers Pre-Contact</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ referral.referrer_prefers_contact ? 'Yes' : 'No' }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Service Information -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Service Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Requested Service</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.requested_service }}</dd>
            </div>
            <div v-if="referral.method_of_payment">
              <dt class="text-sm font-medium text-gray-500">Method of Payment</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.method_of_payment }}</dd>
            </div>
          </dl>
        </div>

        <!-- Presenting Issues -->
        <div
          v-if="referral.presenting_issues"
          class="bg-white shadow-sm rounded-lg p-6 lg:col-span-3"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Presenting Issues or Concerns</h2>
          <p class="text-sm text-gray-900 whitespace-pre-line">
            {{ referral.presenting_issues }}
          </p>
        </div>

        <!-- Clinical Notes -->
        <div class="bg-white shadow-sm rounded-lg p-6 lg:col-span-3">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Clinical Notes</h2>
            <div class="flex gap-2">
              <button
                v-if="clinicalNotes.length > 0"
                @click="toggleAllNotes"
                class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
              >
                {{ allNotesExpanded ? 'Collapse All' : 'Expand All' }}
              </button>
              <button
                @click="openNewNoteModal"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                New Clinical Note
              </button>
            </div>
          </div>

          <!-- Notes Loading -->
          <div v-if="notesLoading" class="text-center py-4">
            <div
              class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
            ></div>
            <p class="mt-2 text-sm text-gray-600">Loading clinical notes...</p>
          </div>

          <!-- Notes List -->
          <div v-else-if="clinicalNotes.length === 0" class="text-center py-8 text-gray-500">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <p class="mt-2 text-sm">No clinical notes yet</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="note in clinicalNotes"
              :key="note.id"
              class="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-900">
                      {{ formatDate(note.session_date) }}
                    </span>
                    <span class="text-xs text-gray-500">
                      • Created {{ formatDate(note.created_at) }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleNote(note.id)"
                    class="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    {{ expandedNotes.has(note.id) ? 'Collapse' : 'Expand' }}
                  </button>
                  <NuxtLink
                    :to="`/clinical-notes/${note.id}`"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </NuxtLink>
                </div>
              </div>
              <p
                class="text-sm text-gray-700 whitespace-pre-line"
                :class="{ 'line-clamp-3': !expandedNotes.has(note.id) }"
              >
                {{ note.content }}
              </p>
            </div>
          </div>
        </div>

        <!-- Files -->
        <div class="bg-white shadow-sm rounded-lg p-6 lg:col-span-3">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Files</h2>
            <label
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer"
            >
              <input type="file" @change="handleFileSelect" class="hidden" :disabled="uploading" />
              {{ uploading ? 'Uploading...' : 'Upload File' }}
            </label>
          </div>

          <!-- File Upload Error -->
          <div v-if="fileError" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p class="text-red-700 text-sm">{{ fileError }}</p>
          </div>

          <!-- Files List -->
          <div v-if="filesLoading" class="text-center py-4">
            <div
              class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
            ></div>
            <p class="mt-2 text-sm text-gray-600">Loading files...</p>
          </div>

          <div v-else-if="files.length === 0" class="text-center py-8 text-gray-500">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
            <p class="mt-2 text-sm">No files uploaded yet</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="file in files"
              :key="file.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div class="flex items-center space-x-3 flex-1 min-w-0">
                <svg
                  class="h-8 w-8 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ file.file_name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ formatFileSize(file.file_size) }} • Uploaded
                    {{ formatDate(file.created_at) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="handleDownload(file.id, file.file_name)"
                  class="p-2 text-blue-600 hover:text-blue-800"
                  title="Download"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="handleDelete(file.id)"
                  class="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditReferralModal
      v-model="showEditModal"
      :referral="referral"
      @updated="handleReferralUpdated"
    />

    <!-- Delete Modal -->
    <DeleteReferralModal
      v-model="showDeleteModal"
      :referralId="id"
      @deleted="handleReferralDeleted"
    />

    <!-- New Clinical Note Modal -->
    <NewClinicalNoteModal
      v-model="showNewNoteModal"
      :referralId="id"
      @created="handleNoteCreated"
    />

    <!-- Email PDF Modal -->
    <EmailReferralPDFModal
      v-model="showEmailPDFModal"
      :defaultEmail="referral?.email || ''"
      @sent="handleEmailPDFSent"
    />
  </div>
</template>

<script setup lang="ts">
import { formatDate, formatDateTimeFull } from '~/utils/dateTimeUtils';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const id = route.params.id as string;

// Use the referral composable
const { referral, loading, error, getReferral, openReferral, closeReferral } = useReferral();

// Use the files composable
const {
  files,
  loading: filesLoading,
  error: fileError,
  uploading,
  getFilesByReferralId,
  uploadFile,
  deleteFile,
  downloadFile,
  formatFileSize,
} = useFiles();

// Use the clinical notes composable
const { clinicalNotes, loading: notesLoading, getClinicalNotesByReferralId } = useClinicalNotes();

// State for updating
const isUpdating = ref(false);

// State for emailing PDF
const isEmailing = ref(false);

// Edit modal state
const showEditModal = ref(false);

// Delete modal state
const showDeleteModal = ref(false);

// New note modal state
const showNewNoteModal = ref(false);

// Email PDF modal state
const showEmailPDFModal = ref(false);

// Open edit modal
const openEditModal = () => {
  showEditModal.value = true;
};

// Open delete modal
const openDeleteModal = () => {
  showDeleteModal.value = true;
};

// Open new note modal
const openNewNoteModal = () => {
  showNewNoteModal.value = true;
};

// Open email PDF modal
const openEmailPDFModal = () => {
  showEmailPDFModal.value = true;
};

// Handle referral deleted
const handleReferralDeleted = () => {
  // Redirect to referrals list after successful deletion
  navigateTo('/referrals');
};

// Handle referral updated
const handleReferralUpdated = () => {
  getReferral(id);
};

// Handle clinical note created
const handleNoteCreated = () => {
  getClinicalNotesByReferralId(id);
};

// Fetch referral immediately (works on both SSR and client)
await getReferral(id);

// Fetch files for this referral
if (id) {
  await getFilesByReferralId(id);
}

// Fetch clinical notes for this referral
if (id) {
  await getClinicalNotesByReferralId(id);
}

// Set page meta
useHead({
  title: computed(() =>
    referral.value
      ? `${referral.value.first_name} ${referral.value.last_name} - Referral Details`
      : 'Referral Details'
  ),
});

// Handle opening referral
const handleOpenReferral = async () => {
  if (!id || isUpdating.value) return;

  isUpdating.value = true;
  try {
    await openReferral(id);
  } catch (err: any) {
    console.error('Failed to open referral:', err);
    alert(err.data?.message || 'Failed to open referral');
  } finally {
    isUpdating.value = false;
  }
};

// Handle closing referral
const handleCloseReferral = async () => {
  if (!id || isUpdating.value) return;

  isUpdating.value = true;
  try {
    await closeReferral(id);
  } catch (err: any) {
    console.error('Failed to close referral:', err);
    alert(err.data?.message || 'Failed to close referral');
  } finally {
    isUpdating.value = false;
  }
};

// Handle file selection
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file || !id) return;

  const result = await uploadFile(id, file);

  // Reset the input
  target.value = '';

  if (result) {
    // File uploaded successfully
    console.log('File uploaded:', result);
  }
};

// Handle file download
const handleDownload = (fileId: string, fileName: string) => {
  downloadFile(fileId, fileName);
};

// Handle file delete
const handleDelete = async (fileId: string) => {
  if (!confirm('Are you sure you want to delete this file?')) return;

  const success = await deleteFile(fileId);

  if (success) {
    console.log('File deleted successfully');
  }
};

// Handle email PDF sent from modal
const handleEmailPDFSent = async (email: string) => {
  if (!id || isEmailing.value) return;

  isEmailing.value = true;
  try {
    await $fetch(`/api/referral/${id}/email-pdf`, {
      method: 'POST',
      body: { email },
    });

    alert('Referral PDF has been emailed successfully!');
  } catch (err: any) {
    console.error('Failed to email PDF:', err);
    alert(err.data?.message || 'Failed to email PDF');
  } finally {
    isEmailing.value = false;
  }
};

// Clinical notes expand/collapse functionality
const expandedNotes = ref<Set<string>>(new Set());

// Toggle individual note
const toggleNote = (noteId: string) => {
  if (expandedNotes.value.has(noteId)) {
    expandedNotes.value.delete(noteId);
  } else {
    expandedNotes.value.add(noteId);
  }
};

// Check if all notes are expanded
const allNotesExpanded = computed(() => {
  return clinicalNotes.value.length > 0 && expandedNotes.value.size === clinicalNotes.value.length;
});

// Toggle all notes
const toggleAllNotes = () => {
  if (allNotesExpanded.value) {
    // Collapse all
    expandedNotes.value.clear();
  } else {
    // Expand all
    clinicalNotes.value.forEach((note) => {
      expandedNotes.value.add(note.id);
    });
  }
};
</script>
