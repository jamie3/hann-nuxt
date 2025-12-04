<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Referrals</h1>
      <div class="flex gap-3">
        <NuxtLink
          to="/referral/self"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          New Self Referral
        </NuxtLink>
        <NuxtLink
          to="/referral/professional"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          New Professional Referral
        </NuxtLink>
      </div>
    </div>

    <!-- Search and Filters -->
    <div v-if="!pending && !error" class="mb-6 bg-white shadow-sm rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
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
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="opened">Opened</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mt-3 text-sm text-gray-600">
        Showing {{ filteredReferrals.length }} of {{ data?.referrals.length || 0 }} referrals
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
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(referral, index) in filteredReferrals"
              :key="referral.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  referral.updated_at ? new Date(referral.updated_at).toLocaleDateString() : 'N/A'
                }}
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
                {{
                  referral.date_of_birth
                    ? new Date(referral.date_of_birth).toLocaleDateString()
                    : 'N/A'
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ referral.age }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ referral.age_at_referral || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  referral.referred_at ? new Date(referral.referred_at).toLocaleDateString() : 'N/A'
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
                {{ referral.opened_at ? new Date(referral.opened_at).toLocaleDateString() : 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openReferralDetail(referral.id)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  View
                </button>
                <button @click="openEditModal(referral)" class="text-blue-600 hover:text-blue-900">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="data.referrals.length === 0" class="text-center py-12">
        <p class="text-gray-500">No referrals found.</p>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditReferralModal
      v-model="showEditModal"
      :referral="selectedReferral"
      @updated="handleReferralUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import type { Referral } from '~/server/types/referral-types';

definePageMeta({
  layout: 'default',
});

// Sorting state
const sortBy = ref('updated_at');
const sortOrder = ref<'asc' | 'desc'>('desc');

// Fetch referrals with sorting
const { data, error, pending, refresh } = await useFetch('/api/referrals', {
  query: {
    sortBy,
    sortOrder,
  },
  watch: [sortBy, sortOrder],
});

// Filter and search state
const searchQuery = ref('');
const typeFilter = ref<'all' | 'professional' | 'self'>('all');
const statusFilter = ref<'all' | 'new' | 'opened' | 'closed'>('all');

// Edit modal state
const showEditModal = ref(false);
const selectedReferral = ref<Referral | null>(null);

// Open referral detail page
const openReferralDetail = (id: string) => {
  navigateTo(`/referrals/${id}`);
};

// Open edit modal
const openEditModal = (referral: any) => {
  selectedReferral.value = referral as Referral;
  showEditModal.value = true;
};

// Handle referral updated
const handleReferralUpdated = () => {
  refresh();
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

// Filtered referrals (sorting is handled server-side)
const filteredReferrals = computed(() => {
  if (!data.value?.referrals) return [];

  let referrals = [...data.value.referrals];

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    referrals = referrals.filter((referral) => {
      const fullName = `${referral.first_name} ${referral.last_name}`.toLowerCase();
      const email = referral.email?.toLowerCase() || '';
      return fullName.includes(query) || email.includes(query);
    });
  }

  // Apply type filter
  if (typeFilter.value !== 'all') {
    referrals = referrals.filter((referral) => referral.referral_type === typeFilter.value);
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    referrals = referrals.filter((referral) => referral.status === statusFilter.value);
  }

  return referrals;
});

// Set page meta
useHead({
  title: 'Referrals - Hann Psychological Services',
});
</script>
