<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading referral...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">Failed to load referral. Please try again.</p>
    </div>

    <!-- Referral Details -->
    <div v-else-if="data?.referral" class="max-w-4xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <NuxtLink
            to="/referrals"
            class="text-blue-600 hover:text-blue-800 flex items-center mb-2"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Back to Referrals
          </NuxtLink>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ data.referral.first_name }} {{ data.referral.last_name }}
          </h1>
        </div>
        <span
          class="px-3 py-1 text-sm font-semibold rounded-full"
          :class="
            data.referral.referral_type === 'professional'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          "
        >
          {{ data.referral.referral_type }} referral
        </span>
      </div>

      <!-- Main Content -->
      <div class="bg-white shadow-sm rounded-lg overflow-hidden">
        <!-- Personal Information -->
        <div class="border-b border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(data.referral.date_of_birth).toLocaleDateString() }}
              </dd>
            </div>
            <div v-if="data.referral.parents_guardians">
              <dt class="text-sm font-medium text-gray-500">Parents / Guardians</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.referral.parents_guardians }}</dd>
            </div>
          </dl>
        </div>

        <!-- Contact Information -->
        <div class="border-b border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Primary Telephone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.referral.primary_telephone }}</dd>
            </div>
            <div v-if="data.referral.secondary_telephone">
              <dt class="text-sm font-medium text-gray-500">Secondary Telephone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.referral.secondary_telephone }}</dd>
            </div>
            <div v-if="data.referral.email">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.referral.email }}</dd>
            </div>
            <div v-if="data.referral.mailing_address">
              <dt class="text-sm font-medium text-gray-500">Mailing Address</dt>
              <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {{ data.referral.mailing_address }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Referrer Information (Professional Only) -->
        <div
          v-if="data.referral.referral_type === 'professional'"
          class="border-b border-gray-200 p-6"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Referrer Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="data.referral.referrer_name">
              <dt class="text-sm font-medium text-gray-500">Referrer Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.referral.referrer_name }}</dd>
            </div>
            <div v-if="data.referral.referrer_relationship">
              <dt class="text-sm font-medium text-gray-500">Relationship</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.referral.referrer_relationship }}</dd>
            </div>
            <div v-if="data.referral.referrer_email">
              <dt class="text-sm font-medium text-gray-500">Referrer Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.referral.referrer_email }}</dd>
            </div>
            <div v-if="data.referral.referrer_prefers_contact !== null">
              <dt class="text-sm font-medium text-gray-500">Prefers Pre-Contact</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ data.referral.referrer_prefers_contact ? 'Yes' : 'No' }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Service Information -->
        <div class="border-b border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Service Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Requested Service</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.referral.requested_service }}</dd>
            </div>
            <div v-if="data.referral.method_of_payment">
              <dt class="text-sm font-medium text-gray-500">Method of Payment</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ data.referral.method_of_payment }}</dd>
            </div>
          </dl>
        </div>

        <!-- Presenting Issues -->
        <div v-if="data.referral.presenting_issues" class="border-b border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Presenting Issues or Concerns</h2>
          <p class="text-sm text-gray-900 whitespace-pre-line">
            {{ data.referral.presenting_issues }}
          </p>
        </div>

        <!-- Metadata -->
        <div class="p-6 bg-gray-50">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Referral ID</dt>
              <dd class="mt-1 text-sm text-gray-900">#{{ data.referral.id }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Submitted On</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(data.referral.created_at).toLocaleString() }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

const route = useRoute();
const id = route.params.id;

// Fetch referral
const { data, error, pending } = await useFetch(`/api/referrals/${id}`);

// Set page meta
useHead({
  title: computed(() =>
    data.value?.referral
      ? `${data.value.referral.first_name} ${data.value.referral.last_name} - Referral Details`
      : 'Referral Details'
  ),
});
</script>
