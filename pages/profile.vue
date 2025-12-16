<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      <!-- Loading State -->
      <div v-if="!currentUser" class="text-center py-8">
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
        ></div>
        <p class="mt-4 text-gray-600">Loading profile...</p>
      </div>

      <!-- Profile Information Card -->
      <div v-else class="space-y-6">
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
          <form @submit.prevent="handleProfileSubmit">
            <!-- Username (Read-only) -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                :value="currentUser.username"
                type="text"
                readonly
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p class="mt-1 text-xs text-gray-500">Username cannot be changed</p>
            </div>

            <!-- Email (Read-only) -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                :value="currentUser.email || 'Not set'"
                type="text"
                readonly
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <!-- Name (Editable) -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="profileData.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Error Message -->
            <div
              v-if="profileErrorMessage"
              class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <p class="text-sm text-red-600">{{ profileErrorMessage }}</p>
            </div>

            <!-- Success Message -->
            <div
              v-if="profileSuccessMessage"
              class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md"
            >
              <p class="text-sm text-green-600">{{ profileSuccessMessage }}</p>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                @click="resetProfileForm"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                :disabled="isProfileSubmitting"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isProfileSubmitting ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Card -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          <form @submit.prevent="handlePasswordSubmit">
            <!-- New Password -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                v-model="passwordData.password"
                type="password"
                placeholder="Enter new password (min 8 characters)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Confirm Password -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                v-model="passwordData.confirmPassword"
                type="password"
                placeholder="Confirm new password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': passwordMismatch }"
              />
              <p v-if="passwordMismatch" class="mt-1 text-xs text-red-500">
                Passwords do not match
              </p>
            </div>

            <!-- Error Message -->
            <div
              v-if="passwordErrorMessage"
              class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <p class="text-sm text-red-600">{{ passwordErrorMessage }}</p>
            </div>

            <!-- Success Message -->
            <div
              v-if="passwordSuccessMessage"
              class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md"
            >
              <p class="text-sm text-green-600">{{ passwordSuccessMessage }}</p>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                @click="resetPasswordForm"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                :disabled="isPasswordSubmitting || passwordMismatch || !passwordData.password"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isPasswordSubmitting ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

// Get current user from session
const { user } = useUserSession();
const sessionUser = computed(() => user.value as any);

// Full user data
const currentUser = ref<any>(null);

// Profile form data
const profileData = ref({
  name: '',
});

// Password form data
const passwordData = ref({
  password: '',
  confirmPassword: '',
});

// Profile state
const isProfileSubmitting = ref(false);
const profileErrorMessage = ref('');
const profileSuccessMessage = ref('');

// Password state
const isPasswordSubmitting = ref(false);
const passwordErrorMessage = ref('');
const passwordSuccessMessage = ref('');

// Fetch full user data
const fetchUserData = async () => {
  if (!sessionUser.value?.id) return;

  try {
    const response = await $fetch(`/api/users/`);
    const users = (response as any).users || [];
    const user = users.find((u: any) => u.id === sessionUser.value.id);
    if (user) {
      currentUser.value = user;
      profileData.value.name = user.name || '';
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
};

// Fetch user data on mount
await fetchUserData();

// Check if passwords match
const passwordMismatch = computed(() => {
  if (!passwordData.value.password && !passwordData.value.confirmPassword) return false;
  return passwordData.value.password !== passwordData.value.confirmPassword;
});

// Reset profile form
const resetProfileForm = () => {
  profileData.value.name = currentUser.value?.name || '';
  profileErrorMessage.value = '';
  profileSuccessMessage.value = '';
};

// Reset password form
const resetPasswordForm = () => {
  passwordData.value.password = '';
  passwordData.value.confirmPassword = '';
  passwordErrorMessage.value = '';
  passwordSuccessMessage.value = '';
};

// Handle profile form submission
const handleProfileSubmit = async () => {
  if (!currentUser.value?.id) return;

  isProfileSubmitting.value = true;
  profileErrorMessage.value = '';
  profileSuccessMessage.value = '';

  try {
    await $fetch(`/api/users/${currentUser.value.id}/update`, {
      method: 'POST',
      body: {
        name: profileData.value.name,
      },
    });

    profileSuccessMessage.value = 'Profile updated successfully';

    // Refresh user session to get updated data
    const { fetch: fetchSession } = useUserSession();
    await fetchSession();
  } catch (error: any) {
    profileErrorMessage.value =
      error.data?.statusMessage || 'Failed to update profile. Please try again.';
  } finally {
    isProfileSubmitting.value = false;
  }
};

// Handle password form submission
const handlePasswordSubmit = async () => {
  if (!currentUser.value?.id) return;

  // Validate passwords match
  if (passwordData.value.password !== passwordData.value.confirmPassword) {
    passwordErrorMessage.value = 'Passwords do not match';
    return;
  }

  if (passwordData.value.password.length < 8) {
    passwordErrorMessage.value = 'Password must be at least 8 characters';
    return;
  }

  isPasswordSubmitting.value = true;
  passwordErrorMessage.value = '';
  passwordSuccessMessage.value = '';

  try {
    await $fetch(`/api/users/${currentUser.value.id}/update`, {
      method: 'POST',
      body: {
        password: passwordData.value.password,
      },
    });

    passwordSuccessMessage.value = 'Password changed successfully';

    // Clear password fields after successful update
    passwordData.value.password = '';
    passwordData.value.confirmPassword = '';
  } catch (error: any) {
    passwordErrorMessage.value =
      error.data?.statusMessage || 'Failed to change password. Please try again.';
  } finally {
    isPasswordSubmitting.value = false;
  }
};

// Set page meta
useHead({
  title: 'Profile - Hann Psychological Services',
});
</script>
