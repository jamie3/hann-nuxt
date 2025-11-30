<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Referrals</h1>

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
                Type
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
                Date
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="referral in data.referrals"
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
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ referral.requested_service }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ referral.primary_telephone }}</div>
                <div v-if="referral.email" class="text-sm text-gray-500">{{ referral.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(referral.created_at).toLocaleDateString() }}
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
definePageMeta({
  layout: 'default',
});

// Fetch referrals
const { data, error, pending, refresh } = await useFetch('/api/referrals');

// Set page meta
useHead({
  title: 'Referrals - Hann Psychological Services',
});
</script>
