<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

    <!-- Users Section -->
    <div class="bg-white shadow-sm rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Users</h2>
        <div class="flex gap-3">
          <button
            @click="getUsers()"
            class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            title="Refresh"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </button>
          <button
            @click="showNewUserModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
            Add User
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading users...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Users List -->
      <div v-else-if="users.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Username
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created At
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Login
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Failed Attempts
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Enabled
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.name || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center"
                  >
                    <span class="text-white font-semibold">{{
                      getUserInitials(user.username)
                    }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ user.created_at ? formatDate(user.created_at) : '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ user.last_login_at ? formatDate(user.last_login_at) : 'Never' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <span
                    :class="{
                      'text-red-600 font-semibold': user.failed_login_attempts >= 3,
                      'text-yellow-600':
                        user.failed_login_attempts > 0 && user.failed_login_attempts < 3,
                    }"
                  >
                    {{ user.failed_login_attempts || 0 }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="user.locked"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                >
                  Locked
                </span>
                <span
                  v-else-if="user.disabled"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                >
                  Disabled
                </span>
                <span
                  v-else
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                >
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="toggleUserDisabled(user)"
                  :disabled="togglingUserId === user.id"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="user.disabled ? 'bg-gray-200' : 'bg-blue-600'"
                  role="switch"
                  :aria-checked="!user.disabled"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="user.disabled ? 'translate-x-0' : 'translate-x-5'"
                  ></span>
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    v-if="user.locked"
                    @click="openUnlockModal(user)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Unlock
                  </button>
                  <button @click="openEditModal(user)" class="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          ></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No users</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
      </div>
    </div>

    <!-- New User Modal -->
    <NewUserModal v-model="showNewUserModal" @created="handleUserCreated" />

    <!-- Edit User Modal -->
    <EditUserModal v-model="showEditUserModal" :user="selectedUser" @updated="handleUserUpdated" />

    <!-- Unlock User Modal -->
    <UnlockUserModal
      v-model="showUnlockUserModal"
      :user="userToUnlock"
      @unlocked="handleUserUnlocked"
    />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/server/types/user-types';
definePageMeta({
  layout: 'default',
});

const showNewUserModal = ref(false);
const showEditUserModal = ref(false);
const showUnlockUserModal = ref(false);
const selectedUser = ref<User | null>(null);
const userToUnlock = ref<User | null>(null);
const togglingUserId = ref<string | null>(null);

// Use the useUsers composable
const { users, loading, error, getUsers } = useUsers();

// Fetch users immediately
await getUsers();

// Open edit modal
const openEditModal = (user: User) => {
  selectedUser.value = user;
  showEditUserModal.value = true;
};

// Handle user created - refresh list
const handleUserCreated = () => {
  getUsers();
};

// Handle user updated - refresh list
const handleUserUpdated = () => {
  getUsers();
};

// Helper function to get user initials
const getUserInitials = (username: string): string => {
  if (!username) return 'U';
  return username.substring(0, 2).toUpperCase();
};

// Open unlock modal
const openUnlockModal = (user: User) => {
  userToUnlock.value = user;
  showUnlockUserModal.value = true;
};

// Handle user unlocked - refresh list
const handleUserUnlocked = () => {
  getUsers();
};

// Toggle user disabled status
const toggleUserDisabled = async (user: User) => {
  if (togglingUserId.value) return; // Prevent multiple simultaneous toggles

  togglingUserId.value = user.id;

  try {
    await $fetch(`/api/users/${user.id}/toggle-disabled`, {
      method: 'POST',
    });

    // Refresh the users list to show updated status
    await getUsers();
  } catch (error: any) {
    console.error('Failed to toggle user disabled status:', error);
    alert(error.data?.message || 'Failed to toggle user status. Please try again.');
  } finally {
    togglingUserId.value = null;
  }
};

// Helper function to format dates
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

useHead({
  title: 'Settings - Hann Psychological Services',
});
</script>
