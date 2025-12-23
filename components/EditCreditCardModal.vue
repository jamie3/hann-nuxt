<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeModal"
  >
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-900">
          {{ existingCard ? 'Edit Credit Card' : 'Add Credit Card' }}
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
        <!-- Card Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Card Number <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            required
            @input="formatCardNumber"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Expiry and CVV -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Expiry (MM/YY) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.expiry"
              type="text"
              placeholder="12/25"
              maxlength="5"
              required
              @input="formatExpiry"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"> CVV (Optional) </label>
            <input
              v-model="formData.cvv"
              type="text"
              placeholder="123"
              maxlength="4"
              @input="formatCVV"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Card' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  referralId: string;
  existingCard?: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  saved: [];
}>();

const isSubmitting = ref(false);
const errorMessage = ref('');

const formData = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
});

// Watch for existing card data
watch(
  () => props.existingCard,
  (card) => {
    if (card) {
      formData.value = {
        cardNumber: card.card_number || '',
        expiry: card.expiry || '',
        cvv: card.cvv || '',
      };
    } else {
      formData.value = {
        cardNumber: '',
        expiry: '',
        cvv: '',
      };
    }
  },
  { immediate: true }
);

// Format card number - allow only digits and add spaces
const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // Remove all non-digit characters
  let value = input.value.replace(/\D/g, '');

  // Add spaces every 4 digits
  const parts = value.match(/.{1,4}/g);
  formData.value.cardNumber = parts ? parts.join(' ') : value;
};

// Format expiry as MM/YY - allow only digits
const formatExpiry = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');

  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }

  formData.value.expiry = value;
};

// Format CVV - allow only digits
const formatCVV = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // Remove all non-digit characters
  formData.value.cvv = input.value.replace(/\D/g, '');
};

const closeModal = () => {
  emit('update:modelValue', false);
  errorMessage.value = '';
  formData.value = { cardNumber: '', expiry: '', cvv: '' };
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    await $fetch(`/api/referral/${props.referralId}/credit-card`, {
      method: 'POST',
      body: formData.value,
    });

    emit('saved');
    closeModal();
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to save credit card';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
