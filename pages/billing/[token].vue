<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg mx-auto">
      <!-- Loading state while validating token -->
      <div v-if="pageState === 'loading'" class="text-center py-16">
        <div
          class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
        ></div>
        <p class="mt-4 text-gray-600">Verifying your payment link…</p>
      </div>

      <!-- Credit card form -->
      <div v-else-if="pageState === 'form'" class="bg-white shadow-sm rounded-lg p-8">
        <!-- Clinic header -->
        <div class="mb-6 pb-6 border-b border-gray-100">
          <div class="flex items-center gap-3 mb-2">
            <div
              class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-lg flex-shrink-0"
            >
              H
            </div>
            <div>
              <p class="font-semibold text-gray-900">Dr. S. Gerald Hann, R.Psych</p>
              <p class="text-sm text-gray-500">Registered Psychologist</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed">
            Dr. S. Gerald Hann Psychology provides professional psychological services in a
            confidential and supportive environment. Your information is handled with the utmost
            care and in accordance with privacy legislation.
          </p>
        </div>

        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Payment Information</h1>
          <p class="mt-1 text-gray-600">
            Hello, <span class="font-medium">{{ referralName }}</span
            >. Please enter your credit card details below.
          </p>
          <p class="mt-1 text-xs text-gray-400">This link expires on {{ expiresAtFormatted }}.</p>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-5">
          <!-- Card Number -->
          <div>
            <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-1">
              Card Number <span class="text-red-500">*</span>
            </label>
            <input
              v-model="cardNumber"
              type="text"
              id="cardNumber"
              inputmode="numeric"
              autocomplete="cc-number"
              placeholder="1234 5678 9012 3456"
              maxlength="19"
              @input="formatCardNumber"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-wider"
              :class="{ 'border-red-500': errors.cardNumber }"
            />
            <p v-if="errors.cardNumber" class="mt-1 text-sm text-red-500">
              {{ errors.cardNumber }}
            </p>
          </div>

          <!-- Expiry and CVV side by side -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="expiry" class="block text-sm font-medium text-gray-700 mb-1">
                Expiry <span class="text-red-500">*</span>
              </label>
              <input
                v-model="expiry"
                type="text"
                id="expiry"
                inputmode="numeric"
                autocomplete="cc-exp"
                placeholder="MM/YY"
                maxlength="5"
                @input="formatExpiry"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                :class="{ 'border-red-500': errors.expiry }"
              />
              <p v-if="errors.expiry" class="mt-1 text-sm text-red-500">
                {{ errors.expiry }}
              </p>
            </div>

            <div>
              <label for="cvv" class="block text-sm font-medium text-gray-700 mb-1"> CVV </label>
              <input
                v-model="cvv"
                type="text"
                id="cvv"
                inputmode="numeric"
                autocomplete="cc-csc"
                placeholder="123"
                maxlength="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                :class="{ 'border-red-500': errors.cvv }"
              />
              <p v-if="errors.cvv" class="mt-1 text-sm text-red-500">
                {{ errors.cvv }}
              </p>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="submitError" class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ submitError }}</p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {{ isSubmitting ? 'Saving…' : 'Save Credit Card' }}
          </button>

          <!-- Security notice -->
          <p class="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
            Your information is encrypted and stored securely.
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'login',
});

const route = useRoute();
const token = route.params.token as string;

type PageState = 'loading' | 'form';

const pageState = ref<PageState>('loading');
const referralFirstName = ref('');
const referralLastName = ref('');
const expiresAt = ref('');

const referralName = computed(() =>
  [referralFirstName.value, referralLastName.value].filter(Boolean).join(' ')
);

const expiresAtFormatted = computed(() => {
  if (!expiresAt.value) return '';
  return new Date(expiresAt.value).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Form fields
const cardNumber = ref('');
const expiry = ref('');
const cvv = ref('');

// Form state
const isSubmitting = ref(false);
const submitError = ref('');
const errors = ref<{ cardNumber?: string; expiry?: string; cvv?: string }>({});

// Format card number as groups of 4
function formatCardNumber() {
  const digits = cardNumber.value.replace(/\D/g, '').slice(0, 16);
  cardNumber.value = digits.replace(/(.{4})/g, '$1 ').trim();
}

// Format expiry as MM/YY
function formatExpiry() {
  const digits = expiry.value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    expiry.value = `${digits.slice(0, 2)}/${digits.slice(2)}`;
  } else {
    expiry.value = digits;
  }
}

function validate(): boolean {
  errors.value = {};

  const rawCard = cardNumber.value.replace(/\s/g, '');
  if (!rawCard || rawCard.length < 13 || rawCard.length > 19) {
    errors.value.cardNumber = 'Please enter a valid card number (13–19 digits).';
  }

  const expiryRegex = /^\d{2}\/\d{2}$/;
  if (!expiry.value || !expiryRegex.test(expiry.value)) {
    errors.value.expiry = 'Please enter expiry in MM/YY format.';
  }

  if (cvv.value && (cvv.value.length < 3 || cvv.value.length > 4)) {
    errors.value.cvv = 'CVV must be 3 or 4 digits.';
  }

  return Object.keys(errors.value).length === 0;
}

async function onSubmit() {
  if (!validate()) return;

  isSubmitting.value = true;
  submitError.value = '';

  try {
    await $fetch(`/api/billing/${token}`, {
      method: 'POST',
      body: {
        cardNumber: cardNumber.value.replace(/\s/g, ''),
        expiry: expiry.value,
        cvv: cvv.value || undefined,
      },
    });

    await navigateTo('/billing/success');
  } catch (err: any) {
    if (err.statusCode === 429) {
      submitError.value = 'Too many attempts. Please wait a few minutes before trying again.';
    } else {
      submitError.value =
        err.data?.message || err.statusMessage || 'Failed to save credit card. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
}

// Validate the token on mount
onMounted(async () => {
  try {
    const response = await $fetch<{
      success: boolean;
      referral: { firstName: string; lastName: string; expiresAt: string };
    }>(`/api/billing/${token}`);
    referralFirstName.value = response.referral.firstName;
    referralLastName.value = response.referral.lastName;
    expiresAt.value = response.referral.expiresAt;
    pageState.value = 'form';
  } catch {
    showError({ statusCode: 404, statusMessage: 'Page Not Found' });
  }
});
</script>
