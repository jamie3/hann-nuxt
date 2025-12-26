<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Clinical Notes</h1>
        <p class="mt-2 text-sm text-gray-600">View and manage all clinical notes</p>
      </div>
      <div>
        <button
          @click="showNewModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          New Clinical Note
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div v-if="!loading && !error" class="mb-6 bg-white shadow-sm rounded-lg p-4">
      <div class="flex items-end gap-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1"> Search </label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Search by content, first name, or last name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="pageSize" class="block text-sm font-medium text-gray-700 mb-1">
            Items per page
          </label>
          <select
            id="pageSize"
            v-model.number="itemsPerPage"
            class="max-w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="150">150</option>
            <option :value="200">200</option>
            <option :value="250">250</option>
          </select>
        </div>
        <button
          @click="getClinicalNotes()"
          class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
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
      </div>

      <!-- Results Count -->
      <div class="mt-3 text-sm text-gray-600">
        Showing {{ endIndex - startIndex }} of {{ totalRecords }} clinical notes
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
              @click="handleSort('session_date')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Session Date {{ getSortIndicator('session_date') }}
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Last Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              First Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Content Preview
            </th>
            <th
              @click="handleSort('created_at')"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Created {{ getSortIndicator('created_at') }}
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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ note.last_name || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ note.first_name || '-' }}
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

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ totalRecords }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
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
const {
  clinicalNotes,
  loading,
  error,
  total,
  currentPage: composablePage,
  limit: composableLimit,
  getClinicalNotes,
} = useClinicalNotes();

// Modal state
const showNewModal = ref(false);

// Sorting state
const sortBy = ref<'session_date' | 'created_at'>('session_date');
const sortOrder = ref<'asc' | 'desc'>('desc');

// Search state
const searchQuery = ref('');
const searchTimeout = ref<NodeJS.Timeout | null>(null);

// Pagination state (local)
const localPage = ref(1);
const itemsPerPage = ref(100);

// Use server-provided values when available
const currentPage = computed(() => composablePage.value || localPage.value);
const totalRecords = computed(() => total.value);

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(totalRecords.value / itemsPerPage.value));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, totalRecords.value)
);

// Fetch data from server
const fetchData = async () => {
  await getClinicalNotes(
    localPage.value,
    itemsPerPage.value,
    sortBy.value,
    sortOrder.value,
    searchQuery.value
  );
};

// Watch search query with debounce
watch(searchQuery, () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    localPage.value = 1;
    fetchData();
  }, 300);
});

// Watch items per page changes
watch(itemsPerPage, () => {
  localPage.value = 1; // Reset to first page when changing page size
  fetchData();
});

// Sorting methods
const handleSort = (column: 'session_date' | 'created_at') => {
  if (sortBy.value === column) {
    // Toggle sort order if same column
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Set new column and default to descending
    sortBy.value = column;
    sortOrder.value = 'desc';
  }
  // Fetch with new sort
  fetchData();
};

const getSortIndicator = (column: string) => {
  if (sortBy.value !== column) return '';
  return sortOrder.value === 'asc' ? '↑' : '↓';
};

// Display up to 5 page numbers
const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

  // Adjust start if we're near the end
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    localPage.value++;
    fetchData();
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    localPage.value--;
    fetchData();
  }
};

const goToPage = (page: number) => {
  localPage.value = page;
  fetchData();
};

// Handle note created - refresh and reset to first page
const handleNoteCreated = () => {
  localPage.value = 1;
  fetchData();
};

// Fetch data after component is mounted
onMounted(async () => {
  await fetchData();
});

// Set page meta
useHead({
  title: 'Clinical Notes',
});
</script>
