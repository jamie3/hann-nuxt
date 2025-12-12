<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Referrals</h1>
        <p class="mt-2 text-sm text-gray-600">View and manage all referrals</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink
          to="/referral/self"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          New Self Referral
        </NuxtLink>
        <NuxtLink
          to="/referral/professional"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          New Professional Referral
        </NuxtLink>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 bg-white shadow-sm rounded-lg p-4">
      <div class="flex items-end gap-4">
        <!-- Search -->
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1"> Search </label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Name or email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Filter by Type -->
        <div>
          <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">
            Referral Type
          </label>
          <select
            id="type-filter"
            v-model="typeFilter"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="professional">Professional</option>
            <option value="self">Self</option>
          </select>
        </div>

        <!-- Filter by Status -->
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active (No Archived)</option>
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="opened">Opened</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <!-- Items per page -->
        <div>
          <label for="pageSize" class="block text-sm font-medium text-gray-700 mb-1">
            Items per page
          </label>
          <select
            id="pageSize"
            v-model.number="itemsPerPage"
            class="max-w-24 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="150">150</option>
            <option :value="200">200</option>
            <option :value="250">250</option>
          </select>
        </div>

        <!-- Refresh -->
        <button
          @click="refresh()"
          class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
        Showing {{ totalRecords }} referral{{ totalRecords !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading referrals...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">Failed to load referrals. Please try again.</p>
    </div>

    <!-- Referrals Table -->
    <div v-else-if="data?.referrals" class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                @click="handleSort('id')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                # {{ getSortIndicator('id') }}
              </th>
              <th
                @click="handleSort('updated_at')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Updated Date {{ getSortIndicator('updated_at') }}
              </th>
              <th
                @click="handleSort('last_name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Last Name {{ getSortIndicator('last_name') }}
              </th>
              <th
                @click="handleSort('first_name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                First Name {{ getSortIndicator('first_name') }}
              </th>
              <th
                @click="handleSort('gender')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Gender {{ getSortIndicator('gender') }}
              </th>
              <th
                @click="handleSort('date_of_birth')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Date of Birth {{ getSortIndicator('date_of_birth') }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Age
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Referral Age
              </th>
              <th
                @click="handleSort('referred_at')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Referral Date {{ getSortIndicator('referred_at') }}
              </th>
              <th
                @click="handleSort('referral_type')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Type {{ getSortIndicator('referral_type') }}
              </th>
              <th
                @click="handleSort('status')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Status {{ getSortIndicator('status') }}
              </th>
              <th
                @click="handleSort('opened_at')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Opened Date {{ getSortIndicator('opened_at') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(referral, index) in referrals" :key="referral.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ referral.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ referral.updated_at ? new Date(referral.updated_at).toLocaleDateString() : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <NuxtLink
                  :to="`/referrals/${referral.id}`"
                  class="text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer"
                >
                  {{ referral.last_name }}
                </NuxtLink>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <NuxtLink
                  :to="`/referrals/${referral.id}`"
                  class="text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer"
                >
                  {{ referral.first_name }}
                </NuxtLink>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ referral.gender || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{
                  referral.date_of_birth
                    ? new Date(referral.date_of_birth).toLocaleDateString()
                    : '-'
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ referral.age }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ referral.age_at_referral || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  referral.referred_at ? new Date(referral.referred_at).toLocaleDateString() : '-'
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="
                    referral.referral_type === 'professional'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  "
                >
                  {{ referral.referral_type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': referral.status === 'new',
                    'bg-blue-100 text-blue-800': referral.status === 'opened',
                    'bg-gray-100 text-gray-800': referral.status === 'closed',
                  }"
                >
                  {{ referral.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ referral.opened_at ? new Date(referral.opened_at).toLocaleDateString() : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="referrals.length > 0"
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200"
      >
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

      <!-- Empty State -->
      <div v-if="data.referrals.length === 0" class="text-center py-12">
        <p class="text-gray-500">No referrals found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

// Use the referralList composable
const {
  referrals: referralsList,
  loading,
  error: composableError,
  total,
  getReferrals,
} = useReferralList();

// Initialize state
const sortBy = ref('updated_at');
const sortOrder = ref<'asc' | 'desc'>('desc');
const searchQuery = ref('');
const debouncedSearch = ref('');
const typeFilter = ref<'all' | 'professional' | 'self'>('all');
const statusFilter = ref<'active' | 'all' | 'new' | 'opened' | 'closed' | 'archived'>('active');
const localPage = ref(1);
const itemsPerPage = ref(100);

// Computed values
const pending = computed(() => loading.value);
const error = computed(() => composableError.value);
const referrals = computed(() => referralsList.value);
const totalRecords = computed(() => total.value);
const currentPage = computed(() => localPage.value);
const totalPages = computed(() => Math.ceil(totalRecords.value / itemsPerPage.value));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, totalRecords.value)
);

// Mock data object for template compatibility
const data = computed(() => ({
  referrals: referrals.value,
  total: totalRecords.value,
}));

// Fetch data function
const fetchData = async () => {
  await getReferrals({
    page: localPage.value,
    limit: itemsPerPage.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    search: debouncedSearch.value,
    type: typeFilter.value,
    status: statusFilter.value,
  });
};

// Debounce search query
let searchTimeout: NodeJS.Timeout | null = null;
watch(searchQuery, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newValue;
  }, 300);
});

// Watch debounced search and filters
watch([debouncedSearch, typeFilter, statusFilter, itemsPerPage], () => {
  localPage.value = 1;
  fetchData();
});

// Watch sort changes
watch([sortBy, sortOrder], () => {
  fetchData();
});

// Refresh function
const refresh = () => {
  fetchData();
};

// Handle column sort
const handleSort = (column: string) => {
  if (sortBy.value === column) {
    // Toggle sort order if same column
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Set new column and default to descending
    sortBy.value = column;
    sortOrder.value = 'desc';
  }
};

// Get sort indicator for a column
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

// Initial fetch
await fetchData();

// Set page meta
useHead({
  title: 'Referrals - Hann Psychological Services',
});
</script>
