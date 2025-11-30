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

      <!-- Users List Placeholder -->
      <div class="text-gray-500 text-center py-8">
        <p>Users management coming soon...</p>
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

useHead({
  title: 'Settings - Hann Psychological Services',
});
</script>
