<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Welcome {{ userName }}</h1>
      <p class="mt-2 text-sm text-gray-600">Overview of your referral system</p>
    </div>

    <!-- Stats Cards -->
    <div
      v-if="!statsLoading && !statsError"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      <!-- Total Professional Referrals -->
      <div class="bg-white shadow-sm rounded-lg p-6 border-l-4 border-blue-500">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="h-8 w-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Professional Referrals</dt>
              <dd class="text-3xl font-semibold text-gray-900">
                {{ stats?.totalProfessional || 0 }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Total Self Referrals -->
      <div class="bg-white shadow-sm rounded-lg p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="h-8 w-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Self Referrals</dt>
              <dd class="text-3xl font-semibold text-gray-900">{{ stats?.totalSelf || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Total New -->
      <div class="bg-white shadow-sm rounded-lg p-6 border-l-4 border-yellow-500">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="h-8 w-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">New</dt>
              <dd class="text-3xl font-semibold text-gray-900">{{ stats?.totalNew || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Total Opened -->
      <div class="bg-white shadow-sm rounded-lg p-6 border-l-4 border-indigo-500">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="h-8 w-8 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Opened</dt>
              <dd class="text-3xl font-semibold text-gray-900">{{ stats?.totalOpened || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Total Closed -->
      <div class="bg-white shadow-sm rounded-lg p-6 border-l-4 border-gray-500">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="h-8 w-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Closed</dt>
              <dd class="text-3xl font-semibold text-gray-900">{{ stats?.totalClosed || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Total Archived -->
      <div class="bg-white shadow-sm rounded-lg p-6 border-l-4 border-purple-500">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="h-8 w-8 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Archived</dt>
              <dd class="text-3xl font-semibold text-gray-900">{{ stats?.totalArchived || 0 }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- New Referrals List -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">New Referrals (Last 30 days)</h2>
          <NuxtLink to="/referrals" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All →
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="referralsLoading" class="text-center py-8">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
        ></div>
        <p class="mt-4 text-gray-600">Loading new referrals...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="referralsError" class="px-6 py-4">
        <p class="text-red-600">{{ referralsError }}</p>
      </div>

      <!-- Referrals List -->
      <div v-else-if="newReferrals.length > 0" class="overflow-x-auto">
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
                Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Referral Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Requested Service
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned To
              </th>
              <th class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="referral in newReferrals" :key="referral.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <NuxtLink
                  :to="`/referrals/${referral.id}`"
                  class="text-sm font-medium text-blue-600 hover:text-blue-900"
                >
                  {{ referral.last_name }}, {{ referral.first_name }}
                </NuxtLink>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  referral.referred_at ? new Date(referral.referred_at).toLocaleDateString() : '-'
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ referral.requested_service }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative">
                <div
                  v-if="editingReferralId !== referral.id"
                  @click="startEditingAssignment(referral)"
                  class="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                  :title="'Click to assign'"
                >
                  <span
                    v-if="!referral.assigned_to_name"
                    class="px-2 py-1 text-xs font-medium border border-gray-300 text-gray-600 rounded"
                  >
                    unassigned
                  </span>
                  <span v-else>{{ referral.assigned_to_name }}</span>
                </div>
                <select
                  v-else
                  v-model="selectedUserId"
                  @change="updateAssignment(referral)"
                  @blur="cancelEditing"
                  ref="assignmentSelect"
                  class="w-full min-w-[200px] px-3 py-2 bg-white border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option :value="null">Unassigned</option>
                  <option v-for="user in users" :key="user.id" :value="parseInt(user.id)">
                    {{ user.name || user.username }}
                  </option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <NuxtLink
                  :to="`/referrals/${referral.id}`"
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
      <div v-else class="px-6 py-8 text-center">
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">No new referrals</h3>
        <p class="mt-1 text-sm text-gray-500">There are currently no new referrals.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Referral } from '~/server/types/referral-types';
import { subDays } from 'date-fns';

definePageMeta({
  layout: 'default',
});

interface StatsResponse {
  success: boolean;
  stats: {
    totalProfessional: number;
    totalSelf: number;
    totalOpened: number;
    totalClosed: number;
    totalArchived: number;
    totalNew: number;
  };
}

// Get current user
const { user } = useUserSession();
const userName = computed(() => {
  // Use full name if available, otherwise fall back to username, then 'Guest'
  return (user.value as any)?.name || (user.value as any)?.username || 'Guest';
});

// Fetch statistics
const {
  data: statsData,
  error: statsError,
  pending: statsLoading,
} = await useFetch<StatsResponse>('/api/referrals/stats');

const stats = computed(() => statsData.value?.stats);

// Fetch new referrals using the composable
const {
  referrals,
  loading: referralsLoading,
  error: referralsError,
  getReferrals,
} = useReferralList();

// Calculate date 30 days ago using date-fns
const startDate = subDays(new Date(), 30).toISOString();

// Fetch new referrals from the last 30 days
await getReferrals({
  page: 1,
  limit: 10,
  sortBy: 'referred_at',
  sortOrder: 'desc',
  status: 'new',
  startDate: startDate,
});

const newReferrals = computed(() => referrals.value);

// Fetch users for assignment
const { users: usersList, getUsers } = useUsers();

// Sort users alphabetically by display name (name or username)
const users = computed(() => {
  return [...usersList.value].sort((a, b) => {
    const nameA = (a.name || a.username).toLowerCase();
    const nameB = (b.name || b.username).toLowerCase();
    return nameA.localeCompare(nameB);
  });
});

// Fetch users list for the assignment dropdown
await getUsers();

// Assignment editing state
const editingReferralId = ref<string | null>(null);
const selectedUserId = ref<number | null>(null);
const assignmentSelect = ref<HTMLSelectElement | null>(null);

// Assignment editing functions
const startEditingAssignment = (referral: any) => {
  editingReferralId.value = referral.id;
  selectedUserId.value = referral.assigned_to ? parseInt(referral.assigned_to) : null;
  // Focus the select element after it renders
  nextTick(() => {
    if (assignmentSelect.value) {
      assignmentSelect.value.focus();
    }
  });
};

const cancelEditing = () => {
  editingReferralId.value = null;
  selectedUserId.value = null;
};

const updateAssignment = async (referral: any) => {
  try {
    await $fetch(`/api/referral/${referral.id}/assign`, {
      method: 'POST',
      body: {
        userId: selectedUserId.value,
      },
    });

    // Calculate date 30 days ago using date-fns
    const startDate = subDays(new Date(), 30).toISOString();

    // Refresh the data to show updated assignment
    await getReferrals({
      page: 1,
      limit: 10,
      sortBy: 'referred_at',
      sortOrder: 'desc',
      status: 'new',
      startDate: startDate,
    });
    cancelEditing();
  } catch (error) {
    console.error('Failed to update assignment:', error);
    alert('Failed to update assignment. Please try again.');
    cancelEditing();
  }
};

useHead({
  title: 'Dashboard - Hann Psychological Services',
});
</script>
