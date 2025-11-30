<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading referral...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Referral Details -->
    <div v-else-if="referral">
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
            {{ referral.first_name }} {{ referral.last_name }}
          </h1>
        </div>
        <span
          class="px-3 py-1 text-sm font-semibold rounded-full"
          :class="
            referral.referral_type === 'professional'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          "
        >
          {{ referral.referral_type }} referral
        </span>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Personal Information -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(referral.date_of_birth).toLocaleDateString() }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Age</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.age }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Age at Referral</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.age_at_referral }}</dd>
            </div>
            <div v-if="referral.parents_guardians">
              <dt class="text-sm font-medium text-gray-500">Parents / Guardians</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.parents_guardians }}</dd>
            </div>
          </dl>
        </div>

        <!-- Contact Information -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Primary Telephone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.primary_telephone }}</dd>
            </div>
            <div v-if="referral.secondary_telephone">
              <dt class="text-sm font-medium text-gray-500">Secondary Telephone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.secondary_telephone }}</dd>
            </div>
            <div v-if="referral.email">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.email }}</dd>
            </div>
            <div v-if="referral.mailing_address">
              <dt class="text-sm font-medium text-gray-500">Mailing Address</dt>
              <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {{ referral.mailing_address }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Referrer Information (Professional Only) -->
        <div
          v-if="referral.referral_type === 'professional'"
          class="bg-white shadow-sm rounded-lg p-6"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Referrer Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="referral.referrer_name">
              <dt class="text-sm font-medium text-gray-500">Referrer Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.referrer_name }}</dd>
            </div>
            <div v-if="referral.referrer_relationship">
              <dt class="text-sm font-medium text-gray-500">Relationship</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.referrer_relationship }}</dd>
            </div>
            <div v-if="referral.referrer_email">
              <dt class="text-sm font-medium text-gray-500">Referrer Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.referrer_email }}</dd>
            </div>
            <div v-if="referral.referrer_prefers_contact !== null">
              <dt class="text-sm font-medium text-gray-500">Prefers Pre-Contact</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ referral.referrer_prefers_contact ? 'Yes' : 'No' }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Service Information -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Service Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Requested Service</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.requested_service }}</dd>
            </div>
            <div v-if="referral.method_of_payment">
              <dt class="text-sm font-medium text-gray-500">Method of Payment</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ referral.method_of_payment }}</dd>
            </div>
          </dl>
        </div>

        <!-- Presenting Issues -->
        <div
          v-if="referral.presenting_issues"
          class="bg-white shadow-sm rounded-lg p-6 lg:col-span-3"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Presenting Issues or Concerns</h2>
          <p class="text-sm text-gray-900 whitespace-pre-line">
            {{ referral.presenting_issues }}
          </p>
        </div>

        <!-- Metadata -->
        <div class="bg-white shadow-sm rounded-lg p-6 lg:col-span-3">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Referral ID</dt>
              <dd class="mt-1 text-sm text-gray-900">#{{ referral.id }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Referral Date</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ referral.referred_at ? new Date(referral.referred_at).toLocaleString() : 'N/A' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Submitted On</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(referral.created_at).toLocaleString() }}
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
const id = route.params.id as string;

// Use the referral composable
const { referral, loading, error, getReferral } = useReferral();

// Fetch referral on mount
onMounted(async () => {
  await getReferral(id);
});

// Set page meta
useHead({
  title: computed(() =>
    referral.value
      ? `${referral.value.first_name} ${referral.value.last_name} - Referral Details`
      : 'Referral Details'
  ),
});
</script>
