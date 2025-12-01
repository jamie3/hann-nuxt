<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Referrals</h1>

    <!-- Search and Filters -->
    <div v-if="!pending && !error" class="mb-6 bg-white shadow-sm rounded-lg p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <!-- Sort by Referral Date -->
        <div>
          <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">
            Sort by Date
          </label>
          <select
            id="sort"
            v-model="sortOrder"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <!-- Filter by Type -->
        <div>
          <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">
            Referral Type
          </label>
          <select
            id="type-filter"
            v-model="typeFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Age
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Service
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Referral Date
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="referral in filteredReferrals"
              :key="referral.id"
              @click="navigateTo(`/referrals/${referral.id}`)"
              class="hover:bg-gray-50 cursor-pointer"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ referral.first_name }} {{ referral.last_name }}
                </div>
                <div v-if="referral.parents_guardians" class="text-sm text-gray-500">
                  Guardian: {{ referral.parents_guardians }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ referral.age }}
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
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ referral.requested_service }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ referral.primary_telephone }}</div>
                <div v-if="referral.email" class="text-sm text-gray-500">{{ referral.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  referral.referred_at ? new Date(referral.referred_at).toLocaleDateString() : 'N/A'
                }}
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
  </div>
</template>

<script setup lang="ts">
import type { Referral } from '~/server/types/referral-types';

definePageMeta({
  layout: 'default',
});

// Fetch referrals
const { data, error, pending, refresh } = await useFetch('/api/referrals');

// Filter and search state
const searchQuery = ref('');
const sortOrder = ref<'asc' | 'desc'>('desc');
const typeFilter = ref<'all' | 'professional' | 'self'>('all');
const statusFilter = ref<'all' | 'new' | 'opened' | 'closed'>('all');

// Filtered and sorted referrals
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

  // Apply sort by referral date
  referrals.sort((a, b) => {
    const dateA = a.referred_at ? new Date(a.referred_at).getTime() : 0;
    const dateB = b.referred_at ? new Date(b.referred_at).getTime() : 0;

    if (sortOrder.value === 'desc') {
      return dateB - dateA; // Newest first
    } else {
      return dateA - dateB; // Oldest first
    }
  });

  return referrals;
});

// Set page meta
useHead({
  title: 'Referrals - Hann Psychological Services',
});
</script>
