<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

      <form @submit="onSubmit" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            name="username"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.username }"
          />
          <p v-if="errors.username" class="mt-1 text-sm text-red-500">
            {{ errors.username }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            name="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-500">
            {{ errors.password }}
          </p>
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>
      </form>
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
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(3, 'Password must be at least 3 characters'),
  })
);

// Initialize form
const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
});

// Define fields
const { value: username } = useField<string>('username');
const { value: password } = useField<string>('password');

// Use auth composable
const { performLogin, error: authError } = useAuth();

// Error message from API
const errorMessage = computed(() => authError.value);

// Handle form submission
const onSubmit = handleSubmit(async (values) => {
  await performLogin({
    username: values.username,
    password: values.password,
  });
});
</script>
