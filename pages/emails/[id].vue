<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading email details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Email Details -->
    <div v-else-if="data?.email">
      <!-- Header -->
      <div class="mb-6">
        <NuxtLink to="/emails" class="text-blue-600 hover:text-blue-800 flex items-center mb-4">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Emails
        </NuxtLink>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Email Details</h1>
            <p class="mt-2 text-sm text-gray-600">Message ID: {{ data.email.message_id || '-' }}</p>
          </div>
          <span
            class="px-3 py-1 text-sm font-semibold rounded-full"
            :class="{
              'bg-green-100 text-green-800': data.email.status === 'delivered',
              'bg-blue-100 text-blue-800': data.email.status === 'sent',
              'bg-purple-100 text-purple-800': data.email.status === 'opened',
              'bg-indigo-100 text-indigo-800': data.email.status === 'clicked',
              'bg-red-100 text-red-800': data.email.status === 'bounced',
              'bg-yellow-100 text-yellow-800': data.email.status === 'spam_complaint',
            }"
          >
            {{ data.email.status }}
          </span>
        </div>
      </div>

      <!-- Email Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Info -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Email Information</h2>
          <dl class="space-y-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">From</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.email.from_email }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">To</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.email.recipient_email }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Referral</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <NuxtLink
                  :to="`/referrals/${data.email.referral_id}`"
                  class="text-blue-600 hover:text-blue-900"
                >
                  View Referral #{{ data.email.referral_id }}
                </NuxtLink>
              </dd>
            </div>
            <div v-if="data.email.tag">
              <dt class="text-sm font-medium text-gray-500">Tag</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.email.tag }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Sent At</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(data.email.created_at).toLocaleString() }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Delivery Status -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Delivery Status</h2>
          <dl class="space-y-3">
            <div v-if="data.email.delivered_at">
              <dt class="text-sm font-medium text-gray-500">Delivered At</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(data.email.delivered_at).toLocaleString() }}
              </dd>
            </div>
            <div v-if="data.email.opened_at">
              <dt class="text-sm font-medium text-gray-500">Opened At</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(data.email.opened_at).toLocaleString() }}
              </dd>
            </div>
            <div v-if="data.email.clicked_at">
              <dt class="text-sm font-medium text-gray-500">Clicked At</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(data.email.clicked_at).toLocaleString() }}
              </dd>
            </div>
            <div v-if="data.email.bounced_at">
              <dt class="text-sm font-medium text-gray-500">Bounced At</dt>
              <dd class="mt-1 text-sm text-red-600 font-semibold">
                {{ new Date(data.email.bounced_at).toLocaleString() }}
              </dd>
            </div>
            <div v-if="data.email.spam_complaint_at">
              <dt class="text-sm font-medium text-gray-500">Spam Complaint At</dt>
              <dd class="mt-1 text-sm text-yellow-600 font-semibold">
                {{ new Date(data.email.spam_complaint_at).toLocaleString() }}
              </dd>
            </div>
            <div v-if="data.email.details">
              <dt class="text-sm font-medium text-gray-500">Details</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.email.details }}</dd>
            </div>
          </dl>
        </div>

        <!-- Email Content -->
        <div
          v-if="data.email.email_content"
          class="bg-white shadow-sm rounded-lg p-6 lg:col-span-2"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Email Content</h2>
          <div
            class="prose max-w-none border border-gray-200 rounded-lg p-4"
            v-html="data.email.email_content"
          ></div>
        </div>

        <!-- Metadata -->
        <div v-if="data.email.metadata" class="bg-white shadow-sm rounded-lg p-6 lg:col-span-2">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
          <pre class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-auto">{{
            JSON.stringify(data.email.metadata, null, 2)
          }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/dateTimeUtils';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const id = route.params.id as string;

// Fetch email details
const { data, error, pending } = await useFetch(`/api/emails/${id}`);

useHead({
  title: computed(() =>
    data.value?.email
      ? `Email to ${data.value.email.recipient_email} - Email Tracking`
      : 'Email Details'
  ),
});
</script>
