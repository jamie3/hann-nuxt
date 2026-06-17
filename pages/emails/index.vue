<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Email Tracking</h1>
        <p class="mt-2 text-sm text-gray-600">Monitor all referral email deliveries</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink
          v-if="isAdmin"
          to="/email-templates"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Email Templates
        </NuxtLink>
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
    </div>

    <!-- Search Bar -->
    <div v-if="!pending && !error" class="mb-6 bg-white shadow-sm rounded-lg p-4">
      <div class="flex items-end gap-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
            Search by Recipient Email
          </label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Enter email address..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="w-56">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
          >
            <option value="">All statuses</option>
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ status.replace('_', ' ') }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-3 text-sm text-gray-600">
        Showing {{ filteredEmails.length }} of {{ data?.emails.length || 0 }} emails
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading emails...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">Failed to load emails. Please try again.</p>
    </div>

    <!-- Emails Table -->
    <div v-else-if="data?.emails" class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date Sent
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                First Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Subject
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Template
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                To
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Referral
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tag
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Event
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="email in paginatedEmails"
              :key="email.id"
              @click="navigateTo(`/emails/${email.id}`)"
              class="hover:bg-gray-50 cursor-pointer"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(email.created_at).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ email.last_name || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ email.first_name || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ email.subject || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span v-if="email.template_name" class="text-gray-900">
                  {{ email.template_name }}
                </span>
                <span v-else class="text-gray-400 italic">Manual</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ email.recipient_email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <NuxtLink
                  :to="`/referrals/${email.referral_id}`"
                  class="text-blue-600 hover:text-blue-900"
                >
                  #{{ email.referral_id }}
                </NuxtLink>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ email.tag || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-gray-100 text-gray-800': email.status === 'draft',
                    'bg-indigo-100 text-indigo-800': email.status === 'scheduled',
                    'bg-blue-100 text-blue-800': email.status === 'sent',
                    'bg-green-100 text-green-800': email.status === 'delivered',
                    'bg-purple-100 text-purple-800': email.status === 'opened',
                    'bg-cyan-100 text-cyan-800': email.status === 'clicked',
                    'bg-red-100 text-red-800':
                      email.status === 'bounced' || email.status === 'failed',
                    'bg-yellow-100 text-yellow-800': email.status === 'spam_complaint',
                  }"
                >
                  {{ email.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  email.clicked_at
                    ? new Date(email.clicked_at).toLocaleString()
                    : email.opened_at
                      ? new Date(email.opened_at).toLocaleString()
                      : email.delivered_at
                        ? new Date(email.delivered_at).toLocaleString()
                        : email.bounced_at
                          ? new Date(email.bounced_at).toLocaleString()
                          : email.spam_complaint_at
                            ? new Date(email.spam_complaint_at).toLocaleString()
                            : '-'
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredEmails.length > 0"
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
              <span class="font-medium">{{ Math.min(endIndex, filteredEmails.length) }}</span>
              of
              <span class="font-medium">{{ filteredEmails.length }}</span>
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
      <div v-if="data.emails.length === 0" class="text-center py-12">
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
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No emails sent yet</h3>
        <p class="mt-1 text-sm text-gray-500">
          Emails will appear here when referrals are submitted.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

// Show the templates link only to admins (the templates page is admin-only)
const { isAdmin } = useIsAdmin();

// Use the email list composable
const { data, loading, error, getEmails } = useEmailList();

// Create computed for pending to maintain template compatibility
const pending = computed(() => loading.value);

// Refresh function
const refresh = () => {
  currentPage.value = 1;
  getEmails();
};

// Search + status filtering
const searchQuery = ref('');
const statusFilter = ref('');

const statusOptions = [
  'draft',
  'scheduled',
  'sent',
  'delivered',
  'opened',
  'clicked',
  'bounced',
  'spam_complaint',
  'failed',
];

const filteredEmails = computed(() => {
  if (!data.value?.emails) return [];

  let result = data.value.emails;

  if (statusFilter.value) {
    result = result.filter((email) => email.status === statusFilter.value);
  }

  const query = searchQuery.value.toLowerCase().trim();
  if (query) {
    result = result.filter((email) => email.recipient_email.toLowerCase().includes(query));
  }

  return result;
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = 25;

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEmails.value.length / itemsPerPage))
);
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);
const paginatedEmails = computed(() =>
  filteredEmails.value.slice(startIndex.value, endIndex.value)
);

// Up to 5 page numbers, centred on the current page
const displayedPages = computed(() => {
  const pages: number[] = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  const lastPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);
  if (lastPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, lastPage - maxPagesToShow + 1);
  }
  for (let i = startPage; i <= lastPage; i++) pages.push(i);
  return pages;
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const goToPage = (page: number) => {
  currentPage.value = page;
};

// Reset to the first page whenever a filter changes
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1;
});

// Fetch data after component is mounted
onMounted(async () => {
  await getEmails();
});

useHead({
  title: 'Email Tracking - Hann Psychological Services',
});
</script>
