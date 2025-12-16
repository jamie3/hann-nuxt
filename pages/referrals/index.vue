<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Referrals</h1>
        <p class="mt-2 text-sm text-gray-600">View and manage all referrals</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink
          to="/referral/self"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
          New Self Referral
        </NuxtLink>
        <NuxtLink
          to="/referral/professional"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
          New Professional Referral
        </NuxtLink>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 bg-white shadow-sm rounded-lg p-4">
      <div class="flex items-end gap-4">
        <!-- Search -->
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1"> Search </label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Name or email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Filter by Type -->
        <div>
          <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">
            Referral Type
          </label>
          <select
            id="type-filter"
            v-model="typeFilter"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="professional">Professional</option>
            <option value="self">Self</option>
          </select>
        </div>

        <!-- Filter by Status -->
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active (No Archived)</option>
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="opened">Opened</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <!-- Filter by Assigned To -->
        <div>
          <label for="assigned-filter" class="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          <select
            id="assigned-filter"
            v-model="assignedToFilter"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="unassigned">Unassigned</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name || user.username }}{{ user.id === currentUserId ? ' (me)' : '' }}
            </option>
          </select>
        </div>

        <!-- Items per page -->
        <div>
          <label for="pageSize" class="block text-sm font-medium text-gray-700 mb-1">
            Items per page
          </label>
          <select
            id="pageSize"
            v-model.number="itemsPerPage"
            class="max-w-24 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="150">150</option>
            <option :value="200">200</option>
            <option :value="250">250</option>
          </select>
        </div>

        <!-- Refresh -->
        <button
          @click="refresh()"
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
      </div>

      <!-- Results Count and Bulk Actions -->
      <div class="mt-3 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Showing {{ totalRecords }} referral{{ totalRecords !== 1 ? 's' : '' }}
          <span v-if="selectedReferrals.size > 0" class="ml-2 font-medium text-blue-600">
            ({{ selectedReferrals.size }} selected)
          </span>
        </div>

        <!-- Bulk Actions Menu -->
        <div v-if="selectedReferrals.size > 0" class="flex items-center gap-2">
          <button
            @click="handleBulkClose"
            :disabled="isBulkActionProcessing"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
            {{
              isBulkActionProcessing ? 'Closing...' : `Close Selected (${selectedReferrals.size})`
            }}
          </button>
          <button
            @click="selectedReferrals.clear()"
            class="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading referrals...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">Failed to load referrals. Please try again.</p>
    </div>

    <!-- Referrals Table -->
    <div v-else-if="data?.referrals" class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  title="Select all"
                />
              </th>
              <th
                @click="handleSort('id')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                # {{ getSortIndicator('id') }}
              </th>
              <th
                @click="handleSort('updated_at')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Updated Date {{ getSortIndicator('updated_at') }}
              </th>
              <th
                @click="handleSort('last_name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Last Name {{ getSortIndicator('last_name') }}
              </th>
              <th
                @click="handleSort('first_name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                First Name {{ getSortIndicator('first_name') }}
              </th>
              <th
                @click="handleSort('gender')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Gender {{ getSortIndicator('gender') }}
              </th>
              <th
                @click="handleSort('date_of_birth')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Date of Birth {{ getSortIndicator('date_of_birth') }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Age
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Referral Age
              </th>
              <th
                @click="handleSort('referred_at')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Referral Date {{ getSortIndicator('referred_at') }}
              </th>
              <th
                @click="handleSort('referral_type')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Type {{ getSortIndicator('referral_type') }}
              </th>
              <th
                @click="handleSort('status')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Status {{ getSortIndicator('status') }}
              </th>
              <th
                @click="handleSort('opened_at')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Opened Date {{ getSortIndicator('opened_at') }}
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(referral, index) in referrals" :key="referral.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :checked="selectedReferrals.has(referral.id)"
                  @change="toggleSelection(referral.id)"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ referral.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ referral.updated_at ? new Date(referral.updated_at).toLocaleDateString() : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <NuxtLink
                  :to="`/referrals/${referral.id}`"
                  class="text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer"
                >
                  {{ referral.last_name }}
                </NuxtLink>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <NuxtLink
                  :to="`/referrals/${referral.id}`"
                  class="text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer"
                >
                  {{ referral.first_name }}
                </NuxtLink>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ referral.gender || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{
                  referral.date_of_birth
                    ? new Date(referral.date_of_birth).toLocaleDateString()
                    : '-'
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ referral.age }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ referral.age_at_referral || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  referral.referred_at ? new Date(referral.referred_at).toLocaleDateString() : '-'
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="
                    referral.referral_type === 'professional'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  "
                >
                  {{ referral.referral_type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': referral.status === 'new',
                    'bg-blue-100 text-blue-800': referral.status === 'opened',
                    'bg-gray-100 text-gray-800': referral.status === 'closed',
                  }"
                >
                  {{ referral.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ referral.opened_at ? new Date(referral.opened_at).toLocaleDateString() : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 relative">
                <div
                  v-if="editingReferralId !== referral.id"
                  @click="startEditingAssignment(referral)"
                  class="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                  :title="'Click to assign'"
                >
                  <span
                    v-if="!referral.assigned_to_name"
                    class="px-2 py-1 text-xs font-medium border border-gray-300 text-gray-600 rounded"
                  >
                    unassigned
                  </span>
                  <span v-else>{{ referral.assigned_to_name }}</span>
                </div>
                <select
                  v-else
                  v-model="selectedUserId"
                  @change="updateAssignment(referral)"
                  @blur="cancelEditing"
                  ref="assignmentSelect"
                  class="w-full min-w-[200px] px-3 py-2 bg-white border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option :value="null">Unassigned</option>
                  <option v-for="user in users" :key="user.id" :value="parseInt(user.id)">
                    {{ user.name || user.username }}
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="referrals.length > 0"
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ totalRecords }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="data.referrals.length === 0" class="text-center py-12">
        <p class="text-gray-500">No referrals found.</p>
      </div>
    </div>

    <!-- Bulk Close Confirmation Modal -->
    <div
      v-if="showBulkCloseModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="closeBulkCloseModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <!-- Confirmation State -->
          <div v-if="!bulkCloseResults">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100"
              >
                <svg
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">Close Multiple Referrals</h3>
              </div>
            </div>
            <div class="mt-2 px-1">
              <p class="text-sm text-gray-500">
                Are you sure you want to close
                <span class="font-semibold">{{ selectedReferrals.size }}</span>
                referral{{ selectedReferrals.size > 1 ? 's' : '' }}?
              </p>
              <p class="text-sm text-gray-500 mt-2">This action will mark them as closed.</p>
            </div>
            <div class="flex gap-3 mt-6">
              <button
                @click="closeBulkCloseModal"
                :disabled="isBulkActionProcessing"
                class="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                @click="executeBulkClose"
                :disabled="isBulkActionProcessing"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isBulkActionProcessing ? 'Closing...' : 'Close Referrals' }}
              </button>
            </div>
          </div>

          <!-- Results State -->
          <div v-else>
            <div class="flex items-center gap-3 mb-4">
              <div
                class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full"
                :class="bulkCloseResults.successCount > 0 ? 'bg-green-100' : 'bg-red-100'"
              >
                <svg
                  v-if="bulkCloseResults.successCount > 0"
                  class="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{
                    bulkCloseResults.successCount > 0
                      ? 'Referrals Closed'
                      : 'Failed to Close Referrals'
                  }}
                </h3>
              </div>
            </div>
            <div class="mt-2 px-1">
              <p v-if="bulkCloseResults.successCount > 0" class="text-sm text-green-600 mb-2">
                Successfully closed {{ bulkCloseResults.successCount }} referral{{
                  bulkCloseResults.successCount > 1 ? 's' : ''
                }}
              </p>
              <div v-if="bulkCloseResults.errors.length > 0" class="mt-3">
                <p class="text-sm font-medium text-red-600 mb-2">
                  Failed to close {{ bulkCloseResults.errors.length }} referral{{
                    bulkCloseResults.errors.length > 1 ? 's' : ''
                  }}:
                </p>
                <div class="max-h-40 overflow-y-auto bg-red-50 rounded p-2">
                  <ul class="text-xs text-red-700 space-y-1">
                    <li v-for="(error, idx) in bulkCloseResults.errors" :key="idx">
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="mt-6">
              <button
                @click="closeBulkCloseModal"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

// Use the referralList composable
const {
  referrals: referralsList,
  loading,
  error: composableError,
  total,
  getReferrals,
} = useReferralList();

// Use the referral composable for bulk actions
const { closeReferral } = useReferral();

// Initialize state
const sortBy = ref('updated_at');
const sortOrder = ref<'asc' | 'desc'>('desc');
const searchQuery = ref('');
const debouncedSearch = ref('');
const typeFilter = ref<'all' | 'professional' | 'self'>('all');
const statusFilter = ref<'active' | 'all' | 'new' | 'opened' | 'closed' | 'archived'>('active');
const assignedToFilter = ref<string>('all');
const localPage = ref(1);
const itemsPerPage = ref(100);
const editingReferralId = ref<string | null>(null);
const selectedUserId = ref<number | null>(null);
const assignmentSelect = ref<HTMLSelectElement | null>(null);

// Selection state
const selectedReferrals = ref<Set<string>>(new Set());
const isBulkActionProcessing = ref(false);
const showBulkCloseModal = ref(false);
const bulkCloseResults = ref<{ successCount: number; errors: string[] } | null>(null);

// Fetch users for assignment filter
const { users: usersList, getUsers } = useUsers();

// Sort users alphabetically by display name (name or username)
const users = computed(() => {
  return [...usersList.value].sort((a, b) => {
    const nameA = (a.name || a.username).toLowerCase();
    const nameB = (b.name || b.username).toLowerCase();
    return nameA.localeCompare(nameB);
  });
});

// Get current user ID
const { user } = useUserSession();
const currentUserId = computed(() => (user.value as any)?.id || null);

// Fetch users list for the assignment filter
await getUsers();

// Computed values
const pending = computed(() => loading.value);
const error = computed(() => composableError.value);
const referrals = computed(() => referralsList.value);
const totalRecords = computed(() => total.value);
const currentPage = computed(() => localPage.value);
const totalPages = computed(() => Math.ceil(totalRecords.value / itemsPerPage.value));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, totalRecords.value)
);

// Mock data object for template compatibility
const data = computed(() => ({
  referrals: referrals.value,
  total: totalRecords.value,
}));

// Fetch data function
const fetchData = async () => {
  await getReferrals({
    page: localPage.value,
    limit: itemsPerPage.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    search: debouncedSearch.value,
    type: typeFilter.value,
    status: statusFilter.value,
    assignedTo: assignedToFilter.value,
  });
};

// Debounce search query
let searchTimeout: NodeJS.Timeout | null = null;
watch(searchQuery, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newValue;
  }, 300);
});

// Watch debounced search and filters
watch([debouncedSearch, typeFilter, statusFilter, assignedToFilter, itemsPerPage], () => {
  localPage.value = 1;
  fetchData();
});

// Watch sort changes
watch([sortBy, sortOrder], () => {
  fetchData();
});

// Refresh function
const refresh = () => {
  fetchData();
};

// Handle column sort
const handleSort = (column: string) => {
  if (sortBy.value === column) {
    // Toggle sort order if same column
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Set new column and default to descending
    sortBy.value = column;
    sortOrder.value = 'desc';
  }
};

// Get sort indicator for a column
const getSortIndicator = (column: string) => {
  if (sortBy.value !== column) return '';
  return sortOrder.value === 'asc' ? '↑' : '↓';
};

// Display up to 5 page numbers
const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

  // Adjust start if we're near the end
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    localPage.value++;
    fetchData();
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    localPage.value--;
    fetchData();
  }
};

const goToPage = (page: number) => {
  localPage.value = page;
  fetchData();
};

// Assignment editing functions
const startEditingAssignment = (referral: any) => {
  editingReferralId.value = referral.id;
  selectedUserId.value = referral.assigned_to ? parseInt(referral.assigned_to) : null;
  // Focus the select element after it renders
  nextTick(() => {
    if (assignmentSelect.value) {
      assignmentSelect.value.focus();
    }
  });
};

const cancelEditing = () => {
  editingReferralId.value = null;
  selectedUserId.value = null;
};

const updateAssignment = async (referral: any) => {
  try {
    await $fetch(`/api/referral/${referral.id}/assign`, {
      method: 'POST',
      body: {
        userId: selectedUserId.value,
      },
    });

    // Refresh the data to show updated assignment
    await fetchData();
    cancelEditing();
  } catch (error) {
    console.error('Failed to update assignment:', error);
    alert('Failed to update assignment. Please try again.');
    cancelEditing();
  }
};

// Selection functions
const toggleSelection = (referralId: string) => {
  if (selectedReferrals.value.has(referralId)) {
    selectedReferrals.value.delete(referralId);
  } else {
    selectedReferrals.value.add(referralId);
  }
};

const allSelected = computed(() => {
  return (
    referrals.value.length > 0 && referrals.value.every((r) => selectedReferrals.value.has(r.id))
  );
});

const toggleSelectAll = () => {
  if (allSelected.value) {
    // Deselect all
    selectedReferrals.value.clear();
  } else {
    // Select all current page referrals
    referrals.value.forEach((r) => selectedReferrals.value.add(r.id));
  }
};

// Clear selections when page changes
watch([localPage, debouncedSearch, typeFilter, statusFilter, assignedToFilter], () => {
  selectedReferrals.value.clear();
});

// Bulk close functions
const handleBulkClose = () => {
  if (selectedReferrals.value.size === 0) return;
  bulkCloseResults.value = null;
  showBulkCloseModal.value = true;
};

const closeBulkCloseModal = () => {
  showBulkCloseModal.value = false;
  bulkCloseResults.value = null;
};

const executeBulkClose = async () => {
  isBulkActionProcessing.value = true;
  const errors: string[] = [];
  let successCount = 0;
  let skippedCount = 0;

  // Process each selected referral
  for (const referralId of Array.from(selectedReferrals.value)) {
    // Find the referral to check its status
    const referral = referrals.value.find((r) => r.id === referralId);

    // Skip if already closed
    if (referral?.status === 'closed') {
      skippedCount++;
      continue;
    }

    try {
      await closeReferral(referralId);
      successCount++;
    } catch (err: any) {
      console.error(`Failed to close referral ${referralId}:`, err);
      errors.push(`${referralId}: ${err.data?.message || 'Failed to close'}`);
    }
  }

  // Add skipped info to errors if any were skipped
  if (skippedCount > 0) {
    errors.unshift(
      `${skippedCount} referral${skippedCount > 1 ? 's were' : ' was'} already closed (skipped)`
    );
  }

  // Set results to show in modal
  bulkCloseResults.value = { successCount, errors };

  // Clear selections and refresh data
  selectedReferrals.value.clear();
  await fetchData();

  isBulkActionProcessing.value = false;
};

// Initial fetch
await fetchData();

// Set page meta
useHead({
  title: 'Referrals - Hann Psychological Services',
});
</script>
