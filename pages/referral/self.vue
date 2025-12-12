<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white shadow-sm rounded-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Self Referral</h1>
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

          <!-- Gender -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">
              Gender <span class="text-red-500">*</span>
            </label>
            <select
              v-model="gender"
              id="gender"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.gender }"
            >
              <option value="">Select gender</option>
              <option v-for="genderOption in GENDERS" :key="genderOption" :value="genderOption">
                {{ genderOption }}
              </option>
            </select>
            <p v-if="errors.gender" class="mt-1 text-sm text-red-500">
              {{ errors.gender }}
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
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <!-- Address 1 -->
          <div>
            <label for="address1" class="block text-sm font-medium text-gray-700 mb-1">
              Address 1 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="address1"
              type="text"
              id="address1"
              placeholder="Street address"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.address1 }"
            />
            <p v-if="errors.address1" class="mt-1 text-sm text-red-500">
              {{ errors.address1 }}
            </p>
          </div>

          <!-- Address 2 -->
          <div>
            <label for="address2" class="block text-sm font-medium text-gray-700 mb-1">
              Address 2
            </label>
            <input
              v-model="address2"
              type="text"
              id="address2"
              placeholder="Apartment, suite, unit, etc."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- City -->
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
              City <span class="text-red-500">*</span>
            </label>
            <input
              v-model="city"
              type="text"
              id="city"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.city }"
            />
            <p v-if="errors.city" class="mt-1 text-sm text-red-500">
              {{ errors.city }}
            </p>
          </div>

          <!-- Country -->
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 mb-1">
              Country <span class="text-red-500">*</span>
            </label>
            <select
              v-model="country"
              id="country"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.country }"
            >
              <option value="">Select country</option>
              <option
                v-for="countryOption in COUNTRIES"
                :key="countryOption"
                :value="countryOption"
              >
                {{ countryOption }}
              </option>
            </select>
            <p v-if="errors.country" class="mt-1 text-sm text-red-500">
              {{ errors.country }}
            </p>
          </div>

          <!-- Province/State and Postal/Zip on same row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="provinceState" class="block text-sm font-medium text-gray-700 mb-1">
                {{
                  country === 'Canada'
                    ? 'Province'
                    : country === 'United States'
                      ? 'State'
                      : 'Province / State'
                }}
                <span class="text-red-500">*</span>
              </label>
              <select
                v-if="country === 'Canada' || country === 'United States'"
                v-model="provinceState"
                id="provinceState"
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.provinceState }"
              >
                <option value="">Select {{ country === 'Canada' ? 'province' : 'state' }}</option>
                <option
                  v-for="option in country === 'Canada' ? CANADIAN_PROVINCES : US_STATES"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
              <input
                v-else
                v-model="provinceState"
                type="text"
                id="provinceState"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.provinceState }"
              />
              <p v-if="errors.provinceState" class="mt-1 text-sm text-red-500">
                {{ errors.provinceState }}
              </p>
            </div>

            <div>
              <label for="postalZip" class="block text-sm font-medium text-gray-700 mb-1">
                {{
                  country === 'Canada'
                    ? 'Postal Code'
                    : country === 'United States'
                      ? 'Zip Code'
                      : 'Postal / Zip Code'
                }}
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="postalZip"
                type="text"
                id="postalZip"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.postalZip }"
              />
              <p v-if="errors.postalZip" class="mt-1 text-sm text-red-500">
                {{ errors.postalZip }}
              </p>
            </div>
          </div>

          <!-- Requested Service -->
          <div>
            <label for="requestedService" class="block text-sm font-medium text-gray-700 mb-1">
              Requested Service <span class="text-red-500">*</span>
            </label>
            <select
              v-model="requestedService"
              id="requestedService"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.requestedService }"
            >
              <option value="">Select a service</option>
              <option v-for="service in REQUESTED_SERVICES" :key="service" :value="service">
                {{ service }}
              </option>
            </select>
            <p v-if="errors.requestedService" class="mt-1 text-sm text-red-500">
              {{ errors.requestedService }}
            </p>
          </div>

          <!-- Presenting Issues -->
          <div>
            <label for="presentingIssues" class="block text-sm font-medium text-gray-700 mb-1">
              Presenting Issues or Concerns <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="presentingIssues"
              id="presentingIssues"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.presentingIssues }"
            ></textarea>
            <p v-if="errors.presentingIssues" class="mt-1 text-sm text-red-500">
              {{ errors.presentingIssues }}
            </p>
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
import { REQUESTED_SERVICES, GENDERS } from '~/types/referral-options';
import { COUNTRIES, CANADIAN_PROVINCES, US_STATES } from '~/types/address-options';

definePageMeta({
  layout: 'login',
});

// Define validation schema
const schema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.string().min(1, 'Gender is required'),
    parentsGuardians: z.string().optional(),
    primaryTelephone: z.string().min(1, 'Primary telephone is required'),
    secondaryTelephone: z.string().optional(),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    address1: z.string().min(1, 'Address is required'),
    address2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    provinceState: z.string().min(1, 'Province/State is required'),
    country: z.string().min(1, 'Country is required'),
    postalZip: z.string().min(1, 'Postal/Zip code is required'),
    requestedService: z.string().min(1, 'Requested service is required'),
    presentingIssues: z.string().min(1, 'Presenting issues or concerns is required'),
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
const { value: gender } = useField<string>('gender');
const { value: parentsGuardians } = useField<string>('parentsGuardians');
const { value: primaryTelephone } = useField<string>('primaryTelephone');
const { value: secondaryTelephone } = useField<string>('secondaryTelephone');
const { value: email } = useField<string>('email');
const { value: address1 } = useField<string>('address1');
const { value: address2 } = useField<string>('address2');
const { value: city } = useField<string>('city');
const { value: provinceState } = useField<string>('provinceState');
const { value: country } = useField<string>('country');
const { value: postalZip } = useField<string>('postalZip');
const { value: requestedService } = useField<string>('requestedService');
const { value: presentingIssues } = useField<string>('presentingIssues');

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
    await $fetch('/api/referral/self', {
      method: 'POST',
      body: {
        ...values,
        turnstileToken: turnstileToken.value,
      },
    });

    // Navigate to success page
    await navigateTo('/referral/success');
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to submit referral. Please try again.';
  }
});
</script>
