<template>
  <div class="container mx-auto px-4 py-8">
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
      <h1 class="text-3xl font-bold text-gray-900">New Clinical Note</h1>
      <p class="mt-2 text-sm text-gray-600">Create a new clinical note for a referral</p>
    </div>

    <!-- Loading Referrals -->
    <div v-if="loadingReferrals" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading referrals...</p>
    </div>

    <!-- Form -->
    <div v-else class="bg-white shadow-sm rounded-lg p-6 max-w-2xl">
      <form @submit.prevent="handleSubmit">
        <!-- Referral Selection -->
        <div class="mb-6">
          <label for="referral" class="block text-sm font-medium text-gray-700 mb-2">
            Referral <span class="text-red-500">*</span>
          </label>
          <select
            id="referral"
            v-model="form.referralId"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div class="mb-6">
          <label for="sessionDate" class="block text-sm font-medium text-gray-700 mb-2">
            Session Date <span class="text-red-500">*</span>
          </label>
          <input
            id="sessionDate"
            v-model="form.sessionDate"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Content -->
        <div class="mb-6">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
            Content <span class="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            v-model="form.content"
            required
            rows="8"
            placeholder="Enter clinical note content..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p class="text-red-700">{{ error }}</p>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end gap-3">
          <NuxtLink
            to="/clinical-notes"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Creating...' : 'Create Clinical Note' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

const router = useRouter();

// Form state
const form = ref({
  referralId: '',
  sessionDate: new Date().toISOString().split('T')[0], // Today's date
  content: '',
});

const submitting = ref(false);
const error = ref<string | null>(null);

// Load referrals
const referrals = ref<any[]>([]);
const loadingReferrals = ref(true);

onMounted(async () => {
  try {
    const { data, error: fetchError } = await useFetch('/api/referrals');
    if (fetchError.value) {
      error.value = 'Failed to load referrals';
    } else if (data.value) {
      referrals.value = (data.value as any).referrals || [];
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load referrals';
  } finally {
    loadingReferrals.value = false;
  }
});

// Handle form submission
const handleSubmit = async () => {
  if (submitting.value) return;

  submitting.value = true;
  error.value = null;

  try {
    const response = await $fetch('/api/clinical-notes/create', {
      method: 'POST',
      body: {
        referralId: form.value.referralId,
        sessionDate: form.value.sessionDate,
        content: form.value.content,
      },
    });

    // Navigate to clinical notes list on success
    router.push('/clinical-notes');
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to create clinical note';
  } finally {
    submitting.value = false;
  }
};

// Set page meta
useHead({
  title: 'New Clinical Note',
});
</script>
