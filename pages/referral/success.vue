<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white shadow-sm rounded-lg p-8 text-center">
        <!-- Success Icon -->
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6"
        >
          <svg
            class="h-10 w-10 text-green-600"
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

        <!-- Success Message -->
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Referral Submitted Successfully!</h1>
        <p class="text-lg text-gray-600 mb-8">
          Thank you for your referral. We have received your submission and will be in touch
          shortly.
        </p>

        <!-- Additional Information -->
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 text-left">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">What happens next?</h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc pl-5 space-y-1">
                  <li>Our team will review your referral</li>
                  <li>We will contact you within 1-2 business days</li>
                  <li>You will receive a confirmation email shortly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="text-gray-600 mb-8">
          <p class="mb-2">If you have any questions, please contact us:</p>
          <p class="font-medium text-gray-900">Dr. S. Gerald Hann Psychology</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/"
            class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </NuxtLink>
          <NuxtLink
            to="/referral/self"
            class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Another Referral
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'login',
});

useHead({
  title: 'Referral Submitted - Hann Psychological Services',
});
</script>
