<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white shadow-sm rounded-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Professional Referral</h1>
        <p class="text-gray-600 mb-8">Dr. S. Gerald Hann Psychology</p>

        <form @submit="onSubmit" class="space-y-6">
          <!-- First Name -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
              First Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="firstName"
              type="text"
              id="firstName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.firstName }"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-500">
              {{ errors.firstName }}
            </p>
          </div>

          <!-- Last Name -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="lastName"
              type="text"
              id="lastName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.lastName }"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-500">
              {{ errors.lastName }}
            </p>
          </div>

          <!-- Date of Birth -->
          <div>
            <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span class="text-red-500">*</span>
            </label>
            <input
              v-model="dateOfBirth"
              type="date"
              id="dateOfBirth"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.dateOfBirth }"
            />
            <p v-if="errors.dateOfBirth" class="mt-1 text-sm text-red-500">
              {{ errors.dateOfBirth }}
            </p>
          </div>

          <!-- Parents / Guardians -->
          <div>
            <label for="parentsGuardians" class="block text-sm font-medium text-gray-700 mb-1">
              Parents / Guardians
            </label>
            <input
              v-model="parentsGuardians"
              type="text"
              id="parentsGuardians"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Primary Telephone -->
          <div>
            <label for="primaryTelephone" class="block text-sm font-medium text-gray-700 mb-1">
              Primary Telephone <span class="text-red-500">*</span>
            </label>
            <input
              v-model="primaryTelephone"
              type="tel"
              id="primaryTelephone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.primaryTelephone }"
            />
            <p v-if="errors.primaryTelephone" class="mt-1 text-sm text-red-500">
              {{ errors.primaryTelephone }}
            </p>
          </div>

          <!-- Secondary Telephone -->
          <div>
            <label for="secondaryTelephone" class="block text-sm font-medium text-gray-700 mb-1">
              Secondary Telephone
            </label>
            <input
              v-model="secondaryTelephone"
              type="tel"
              id="secondaryTelephone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Mailing Address -->
          <div>
            <label for="mailingAddress" class="block text-sm font-medium text-gray-700 mb-1">
              Mailing Address
            </label>
            <textarea
              v-model="mailingAddress"
              id="mailingAddress"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Referrer Name -->
          <div>
            <label for="referrerName" class="block text-sm font-medium text-gray-700 mb-1">
              Referrer Name
            </label>
            <input
              v-model="referrerName"
              type="text"
              id="referrerName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Referrer Relationship -->
          <div>
            <label for="referrerRelationship" class="block text-sm font-medium text-gray-700 mb-1">
              Referrer Relationship
            </label>
            <input
              v-model="referrerRelationship"
              type="text"
              id="referrerRelationship"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Referrer Email -->
          <div>
            <label for="referrerEmail" class="block text-sm font-medium text-gray-700 mb-1">
              Referrer Email
            </label>
            <input
              v-model="referrerEmail"
              type="email"
              id="referrerEmail"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Requested Therapy -->
          <div>
            <label for="requestedService" class="block text-sm font-medium text-gray-700 mb-1">
              Requested Therapy <span class="text-red-500">*</span>
            </label>
            <select
              v-model="requestedService"
              id="requestedService"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.requestedService }"
            >
              <option value="">Select a service</option>
              <option value="Child Therapy">Child Therapy</option>
              <option value="Adolescent Therapy">Adolescent Therapy</option>
              <option value="Adult Individual Therapy">Adult Individual Therapy</option>
              <option value="Couple Therapy">Couple Therapy</option>
              <option value="Family Therapy">Family Therapy</option>
              <option value="Assessment">Assessment</option>
              <option value="Consultation">Consultation</option>
            </select>
            <p v-if="errors.requestedService" class="mt-1 text-sm text-red-500">
              {{ errors.requestedService }}
            </p>
          </div>

          <!-- Presenting Issues -->
          <div>
            <label for="presentingIssues" class="block text-sm font-medium text-gray-700 mb-1">
              Presenting Issues or Concerns
            </label>
            <textarea
              v-model="presentingIssues"
              id="presentingIssues"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Method of Payment -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Method of Payment</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="methodOfPayment"
                  type="radio"
                  value="Private health insurance"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Private health insurance</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="methodOfPayment"
                  type="radio"
                  value="Government agency"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Government agency</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="methodOfPayment"
                  type="radio"
                  value="Employee assistance program"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">Employee assistance program</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="methodOfPayment"
                  type="radio"
                  value="3rd party payment provider"
                  class="mr-2"
                />
                <span class="text-sm text-gray-700">3rd party payment provider</span>
              </label>
            </div>
          </div>

          <!-- Referrer Prefers Contact -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Does the referrer prefer to speak with Dr. Hann before we contact the client?
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input v-model="referrerPrefersContact" type="radio" :value="true" class="mr-2" />
                <span class="text-sm text-gray-700">Yes</span>
              </label>
              <label class="flex items-center">
                <input v-model="referrerPrefersContact" type="radio" :value="false" class="mr-2" />
                <span class="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

          <!-- Turnstile -->
          <div>
            <NuxtTurnstile v-model="turnstileToken" />
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-md">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

definePageMeta({
  layout: 'login',
});

// Define validation schema
const schema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    parentsGuardians: z.string().optional(),
    primaryTelephone: z.string().min(1, 'Primary telephone is required'),
    secondaryTelephone: z.string().optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    mailingAddress: z.string().optional(),
    referrerName: z.string().optional(),
    referrerRelationship: z.string().optional(),
    referrerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
    requestedService: z.string().min(1, 'Requested service is required'),
    presentingIssues: z.string().optional(),
    methodOfPayment: z.string().optional(),
    referrerPrefersContact: z.boolean().optional(),
  })
);

// Initialize form
const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
});

// Define fields
const { value: firstName } = useField<string>('firstName');
const { value: lastName } = useField<string>('lastName');
const { value: dateOfBirth } = useField<string>('dateOfBirth');
const { value: parentsGuardians } = useField<string>('parentsGuardians');
const { value: primaryTelephone } = useField<string>('primaryTelephone');
const { value: secondaryTelephone } = useField<string>('secondaryTelephone');
const { value: email } = useField<string>('email');
const { value: mailingAddress } = useField<string>('mailingAddress');
const { value: referrerName } = useField<string>('referrerName');
const { value: referrerRelationship } = useField<string>('referrerRelationship');
const { value: referrerEmail } = useField<string>('referrerEmail');
const { value: requestedService } = useField<string>('requestedService');
const { value: presentingIssues } = useField<string>('presentingIssues');
const { value: methodOfPayment } = useField<string>('methodOfPayment');
const { value: referrerPrefersContact } = useField<boolean>('referrerPrefersContact');

// Messages
const errorMessage = ref<string>('');
const successMessage = ref<string>('');

// Turnstile token
const turnstileToken = ref<string>('');

// Handle form submission
const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await $fetch('/api/referral/professional', {
      method: 'POST',
      body: values,
    });

    // Navigate to success page
    await navigateTo('/referral/success');
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to submit referral. Please try again.';
  }
});
</script>
