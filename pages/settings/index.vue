<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'users'"
          :class="[
            activeTab === 'users'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
          ]"
        >
          Users
        </button>
        <button
          @click="activeTab = 'email'"
          :class="[
            activeTab === 'email'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
          ]"
        >
          Email Settings
        </button>
      </nav>
    </div>

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'" class="bg-white shadow-sm rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Users</h2>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add User
        </button>
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
                Username
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
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
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
                <div class="text-sm text-gray-900">{{ formatDate(user.created_at) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ user.last_login_at ? formatDate(user.last_login_at) : 'Never' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                <button class="text-red-600 hover:text-red-900">Delete</button>
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

    <!-- Email Settings Tab -->
    <div v-else-if="activeTab === 'email'" class="bg-white shadow-sm rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Email Settings</h2>

      <!-- Email Settings Form -->
      <form class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- SMTP Host -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="smtp.example.com"
            />
          </div>

          <!-- SMTP Port -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
            <input
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="587"
            />
          </div>

          <!-- SMTP Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="username@example.com"
            />
          </div>

          <!-- SMTP Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
            <input
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <!-- From Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">From Email</label>
            <input
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="noreply@example.com"
            />
          </div>

          <!-- From Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">From Name</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Hann Psychological Services"
            />
          </div>
        </div>

        <!-- Use TLS -->
        <div class="flex items-center">
          <input
            type="checkbox"
            id="use-tls"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="use-tls" class="ml-2 block text-sm text-gray-700">
            Use TLS/SSL encryption
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Test Connection
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

const activeTab = ref('users');

// Use the useUsers composable
const { users, loading, error, getUsers } = useUsers();

// Fetch users when component mounts
onMounted(() => {
  getUsers();
});

// Helper function to get user initials
const getUserInitials = (username: string): string => {
  if (!username) return 'U';
  return username.substring(0, 2).toUpperCase();
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
