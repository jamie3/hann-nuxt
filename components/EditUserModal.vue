<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="closeModal"
  >
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-900">Edit User</h3>
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
      <form @submit="onSubmit" class="mt-4">
        <div class="space-y-4">
          <!-- Full Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              v-model="name"
              type="text"
              id="name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">
              {{ errors.name }}
            </p>
          </div>

          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              v-model="username"
              type="text"
              id="username"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.username }"
            />
            <p v-if="errors.username" class="mt-1 text-sm text-red-500">
              {{ errors.username }}
            </p>
          </div>

          <!-- Email Address -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
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

          <!-- New Password (Optional) -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              New Password <span class="text-gray-500">(optional)</span>
            </label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.password }"
              placeholder="Leave blank to keep current password"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">
              {{ errors.password }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500">
              Only fill this if you want to change the password
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
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
            {{ isSubmitting ? 'Updating...' : 'Update User' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import type { User } from '~/server/types/user-types';

interface Props {
  modelValue: boolean;
  user: User | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  updated: [];
}>();

// Define validation schema - password is optional for edit
const schema = toTypedSchema(
  z.object({
    name: z.string().optional(),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address').optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional()
      .or(z.literal('')),
  })
);

// Initialize form
const { handleSubmit, errors, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: schema,
});

// Define fields
const { value: name } = useField<string>('name');
const { value: username } = useField<string>('username');
const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');

const errorMessage = ref('');

// Watch for user prop changes to populate form
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      setValues({
        name: newUser.name || '',
        username: newUser.username,
        email: newUser.email || '',
        password: '',
      });
    }
  },
  { immediate: true }
);

const closeModal = () => {
  resetForm();
  errorMessage.value = '';
  emit('update:modelValue', false);
};

const onSubmit = handleSubmit(async (values) => {
  if (!props.user) return;

  errorMessage.value = '';

  try {
    const updateData: any = {
      name: values.name,
      username: values.username,
      email: values.email,
    };

    // Only include password if it was provided
    if (values.password && values.password.length > 0) {
      updateData.password = values.password;
    }

    await $fetch(`/api/users/${props.user.id}/update`, {
      method: 'POST',
      body: updateData,
    });

    emit('updated');
    closeModal();
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Failed to update user. Please try again.';
  }
});
</script>
