<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Email Tracking</h1>
        <p class="mt-2 text-sm text-gray-600">Monitor all referral email deliveries</p>
      </div>
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
              v-for="email in filteredEmails"
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
                    'bg-green-100 text-green-800': email.status === 'delivered',
                    'bg-blue-100 text-blue-800': email.status === 'sent',
                    'bg-purple-100 text-purple-800': email.status === 'opened',
                    'bg-indigo-100 text-indigo-800': email.status === 'clicked',
                    'bg-red-100 text-red-800': email.status === 'bounced',
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

// Use the email list composable
const { data, loading, error, getEmails } = useEmailList();

// Create computed for pending to maintain template compatibility
const pending = computed(() => loading.value);

// Refresh function
const refresh = () => {
  getEmails();
};

// Search functionality
const searchQuery = ref('');

const filteredEmails = computed(() => {
  if (!data.value?.emails) return [];

  if (!searchQuery.value.trim()) {
    return data.value.emails;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return data.value.emails.filter((email) => email.recipient_email.toLowerCase().includes(query));
});

// Fetch data after component is mounted
onMounted(async () => {
  await getEmails();
});

useHead({
  title: 'Email Tracking - Hann Psychological Services',
});
</script>
