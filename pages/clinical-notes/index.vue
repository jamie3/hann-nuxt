<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Clinical Notes</h1>
        <p class="mt-2 text-sm text-gray-600">View and manage all clinical notes</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="getClinicalNotes()"
          class="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
          title="Refresh"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </button>
        <button
          @click="showNewModal = true"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          New Clinical Note
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading clinical notes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Clinical Notes Table -->
    <div v-else-if="clinicalNotes.length > 0" class="bg-white shadow-sm rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Session Date
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Referral ID
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Content Preview
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="note in clinicalNotes" :key="note.id" class="hover:bg-gray-50 cursor-pointer">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(note.session_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              #{{ note.referral_id.substring(0, 8) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              <div class="max-w-xs truncate">
                {{ note.content }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(note.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <NuxtLink
                :to="`/clinical-notes/${note.id}`"
                class="text-blue-600 hover:text-blue-900"
              >
                View
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white shadow-sm rounded-lg p-8 text-center">
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
      <h3 class="mt-2 text-sm font-medium text-gray-900">No clinical notes</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new clinical note.</p>
    </div>

    <!-- New Clinical Note Modal -->
    <NewClinicalNoteModal v-model="showNewModal" @created="handleNoteCreated" />
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/dateTimeUtils';

definePageMeta({
  layout: 'default',
});

// Use the clinical notes composable
const { clinicalNotes, loading, error, getClinicalNotes } = useClinicalNotes();

// Modal state
const showNewModal = ref(false);

// Fetch clinical notes immediately
await getClinicalNotes();

// Handle note created
const handleNoteCreated = () => {
  getClinicalNotes();
};

// Set page meta
useHead({
  title: 'Clinical Notes',
});
</script>
