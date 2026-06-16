<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading referral...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Referral Details -->
    <div v-else-if="referral">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <NuxtLink
              to="/referrals"
              class="text-blue-600 hover:text-blue-800 flex items-center mb-2"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Back to Referrals
            </NuxtLink>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-bold text-gray-900">
                {{ referral.first_name }} {{ referral.last_name }}
              </h1>

              <!-- Referral Type Badge -->
              <span
                class="px-3 py-1 text-sm font-semibold rounded-full"
                :class="
                  referral.referral_type === 'professional'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                "
              >
                {{ referral.referral_type === 'professional' ? 'Professional' : 'Self' }}
              </span>

              <!-- Status Badge -->
              <StatusBadge :status="referral.status" />
            </div>
          </div>
          <div class="relative">
            <!-- Actions Dropdown Button -->
            <button
              @click="showActionsMenu = !showActionsMenu"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <span>Actions</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showActionsMenu"
              class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
            >
              <div class="py-1">
                <!-- Edit -->
                <button
                  @click="handleMenuAction(openEditModal)"
                  :disabled="referral.status === 'closed'"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                  Edit Referral
                </button>

                <!-- Set to Unassigned (when new) -->
                <button
                  v-if="referral.status === 'new'"
                  @click="handleMenuAction(handleSetUnassigned)"
                  :disabled="isUpdating"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Set to Unassigned
                </button>

                <!-- Open (when new, unassigned, or closed) -->
                <button
                  v-if="
                    referral.status === 'new' ||
                    referral.status === 'unassigned' ||
                    referral.status === 'closed'
                  "
                  @click="handleMenuAction(handleOpenReferral)"
                  :disabled="isUpdating"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Open Referral
                </button>

                <!-- Close (when new or opened) -->
                <button
                  v-if="referral.status === 'new' || referral.status === 'opened'"
                  @click="handleMenuAction(handleCloseReferral)"
                  :disabled="isUpdating"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                  Close Referral
                </button>

                <!-- Archive (when not archived) -->
                <button
                  v-if="referral.status !== 'archived'"
                  @click="handleMenuAction(handleArchiveReferral)"
                  :disabled="isUpdating"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    ></path>
                  </svg>
                  Archive Referral
                </button>

                <div class="border-t border-gray-100"></div>

                <!-- Download PDF -->
                <a
                  :href="`/api/referral/${id}/pdf`"
                  download
                  @click="showActionsMenu = false"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 block"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  Download Referral PDF
                </a>

                <!-- Download Clinical File PDF -->
                <a
                  :href="`/api/referral/${id}/clinical-file-pdf`"
                  download
                  @click="showActionsMenu = false"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 block"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  Download Clinical File PDF
                </a>

                <!-- Email Referral PDF -->
                <button
                  @click="handleMenuAction(openEmailPDFModal)"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Email Referral PDF
                </button>

                <!-- Generate Email -->
                <button
                  @click="handleMenuAction(openGenerateEmailModal)"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                  Generate Email
                </button>

                <div class="border-t border-gray-100"></div>

                <!-- Merge -->
                <button
                  @click="handleMenuAction(openMergeModal)"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    ></path>
                  </svg>
                  Merge Referral
                </button>

                <div class="border-t border-gray-100"></div>

                <!-- Delete -->
                <button
                  @click="handleMenuAction(openDeleteModal)"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  Delete Referral
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
          <div class="flex items-center gap-2">
            <span class="font-medium">Assigned To:</span>
            <div
              v-if="!editingAssignedTo"
              @click="startEditingAssignment"
              class="group cursor-pointer flex items-center gap-1"
              :title="'Click to assign'"
            >
              <span
                v-if="!referral.assigned_to_name"
                class="px-2 py-1 text-xs font-medium border border-gray-300 text-gray-600 rounded"
              >
                unassigned
              </span>
              <span v-else>{{ referral.assigned_to_name }}</span>
              <svg
                class="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </div>
            <select
              v-else
              v-model="selectedUserId"
              @change="updateAssignment"
              @blur="cancelEditingAssignment"
              ref="assignmentSelect"
              class="min-w-[200px] px-3 py-2 bg-white border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option :value="null">Unassigned</option>
              <option v-for="user in users" :key="user.id" :value="parseInt(user.id)">
                {{ user.name || user.username }}
              </option>
            </select>
          </div>
        </div>

        <!-- Date Information -->
        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <span class="font-medium">Referral Date:</span>
            <div
              v-if="!editingReferralDate"
              @click="startEditingReferralDate"
              class="group cursor-pointer flex items-center gap-1"
              :title="'Click to edit'"
            >
              <span>{{ referral.referred_at ? formatDate(referral.referred_at) : 'Not Set' }}</span>
              <svg
                class="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </div>
            <input
              v-else
              type="date"
              v-model="selectedReferralDate"
              @change="updateReferralDate"
              @blur="cancelEditingReferralDate"
              ref="referralDateInput"
              class="px-3 py-2 bg-white border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div v-if="referral.opened_at">
            <span class="font-medium">Opened At:</span>
            {{ formatDate(referral.opened_at) }}
          </div>
          <div v-if="referral.closed_at">
            <span class="font-medium">Closed At:</span>
            {{ formatDate(referral.closed_at) }}
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div>
        <!-- Tab bar -->
        <div
          class="bg-white shadow-sm rounded-lg mb-6 px-6 flex flex-wrap items-center justify-between gap-3"
        >
          <nav class="flex gap-6 -mb-px overflow-x-auto">
            <button type="button" @click="activeTab = 'details'" :class="tabClass('details')">
              Details
            </button>
            <button type="button" @click="activeTab = 'payment'" :class="tabClass('payment')">
              Payment
            </button>
            <button type="button" @click="activeTab = 'notes'" :class="tabClass('notes')">
              Clinical Notes
            </button>
            <button type="button" @click="activeTab = 'files'" :class="tabClass('files')">
              Files
            </button>
            <button type="button" @click="activeTab = 'emails'" :class="tabClass('emails')">
              Email Activity
            </button>
          </nav>

          <!-- Contextual actions for the active tab -->
          <div class="py-2 flex gap-2">
            <template v-if="activeTab === 'notes'">
              <button
                v-if="clinicalNotes.length > 0"
                @click="toggleAllNotes"
                class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
              >
                {{ allNotesExpanded ? 'Collapse All' : 'Expand All' }}
              </button>
              <button
                @click="openNewNoteModal"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                New Clinical Note
              </button>
            </template>
            <template v-else-if="activeTab === 'files'">
              <label
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer"
              >
                <input
                  type="file"
                  @change="handleFileSelect"
                  class="hidden"
                  :disabled="uploading"
                />
                {{ uploading ? 'Uploading...' : 'Upload File' }}
              </label>
            </template>
            <template v-else-if="activeTab === 'emails'">
              <button
                @click="openGenerateEmailModal"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Generate Email
              </button>
            </template>
          </div>
        </div>

        <!-- Details panel -->
        <div v-show="activeTab === 'details'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Personal Information -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ referral.date_of_birth ? formatDate(referral.date_of_birth) : '-' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Gender</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.gender || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Age</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.age }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Age at Referral</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.age_at_referral }}</dd>
              </div>
              <div v-if="referral.parents_guardians">
                <dt class="text-sm font-medium text-gray-500">Parents / Guardians</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.parents_guardians }}</dd>
              </div>
            </dl>
          </div>

          <!-- Contact Information -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Primary Telephone</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.primary_telephone }}</dd>
              </div>
              <div v-if="referral.secondary_telephone">
                <dt class="text-sm font-medium text-gray-500">Secondary Telephone</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.secondary_telephone }}</dd>
              </div>
              <div v-if="referral.email">
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.email }}</dd>
              </div>
              <div v-if="referral.address_1" class="md:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Address</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <div>{{ referral.address_1 }}</div>
                  <div v-if="referral.address_2">{{ referral.address_2 }}</div>
                  <div>
                    {{ referral.city
                    }}<span v-if="referral.province_state">, {{ referral.province_state }}</span>
                  </div>
                  <div v-if="referral.postal_zip">{{ referral.postal_zip }}</div>
                  <div v-if="referral.country">{{ referral.country }}</div>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Referrer Information (Professional Only) -->
          <div
            v-if="referral.referral_type === 'professional'"
            class="bg-white shadow-sm rounded-lg p-6 lg:col-span-2"
          >
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Referrer Information</h2>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="referral.referrer_name">
                <dt class="text-sm font-medium text-gray-500">Referrer Name</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.referrer_name }}</dd>
              </div>
              <div v-if="referral.referrer_relationship">
                <dt class="text-sm font-medium text-gray-500">Relationship</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.referrer_relationship }}</dd>
              </div>
              <div v-if="referral.referrer_email">
                <dt class="text-sm font-medium text-gray-500">Referrer Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.referrer_email }}</dd>
              </div>
              <div v-if="referral.referrer_prefers_contact !== null">
                <dt class="text-sm font-medium text-gray-500">Prefers Pre-Contact</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ referral.referrer_prefers_contact ? 'Yes' : 'No' }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Service Information -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Service Information</h2>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Requested Service</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.requested_service }}</dd>
              </div>
              <div v-if="referral.method_of_payment">
                <dt class="text-sm font-medium text-gray-500">Method of Payment</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ referral.method_of_payment }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Payment panel -->
        <div v-show="activeTab === 'payment'" class="grid grid-cols-1 gap-6">
          <!-- Payment Information -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Payment Information</h2>
              <div class="flex gap-2">
                <!-- Generate Payment Link -->
                <button
                  @click="handleGeneratePaymentLink"
                  :disabled="isGeneratingPaymentLink"
                  class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1 disabled:opacity-50"
                  title="Generate a one-time payment link for the client"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    ></path>
                  </svg>
                  {{ isGeneratingPaymentLink ? 'Generating…' : 'Payment Link' }}
                </button>
                <button
                  v-if="creditCard"
                  @click="toggleCardVisibility"
                  class="p-2 text-gray-600 hover:text-gray-800"
                  title="Toggle card visibility"
                >
                  <svg
                    v-if="showFullCard"
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    ></path>
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                </button>
                <button
                  v-if="creditCard"
                  @click="openEditCardModal"
                  class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  v-if="creditCard"
                  @click="handleDeleteCreditCard"
                  class="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
                <button
                  v-if="!creditCard"
                  @click="openEditCardModal"
                  class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Card
                </button>
              </div>
            </div>

            <!-- Credit Card Display -->
            <div v-if="creditCardLoading" class="text-center py-4">
              <div
                class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
              ></div>
              <p class="mt-2 text-sm text-gray-600">Loading payment info...</p>
            </div>

            <div v-else-if="creditCard" class="space-y-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Card Number</dt>
                <dd class="mt-1 text-sm text-gray-900 font-mono">
                  {{ showFullCard ? creditCard.card_number : creditCard.card_number_masked }}
                </dd>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Expiry</dt>
                  <dd class="mt-1 text-sm text-gray-900 flex items-center gap-2">
                    {{ showFullCard ? creditCard.expiry : '••/••' }}
                    <span
                      v-if="isCardExpired"
                      class="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700"
                    >
                      Expired
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">CVV</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ showFullCard ? creditCard.cvv : '•••' }}
                  </dd>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-4 text-gray-500">
              <svg
                class="mx-auto h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
              <p class="mt-2 text-sm">No credit card on file</p>
            </div>
          </div>
        </div>

        <!-- Details panel (continued) -->
        <div v-show="activeTab === 'details'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <!-- Presenting Issues -->
          <div
            v-if="referral.presenting_issues"
            class="bg-white shadow-sm rounded-lg p-6 lg:col-span-2"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Presenting Issues or Concerns</h2>
              <button
                @click="openPresentingIssuesModal"
                class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
            </div>
            <p class="text-sm text-gray-900 whitespace-pre-line">
              {{ referral.presenting_issues }}
            </p>
          </div>
        </div>

        <!-- Clinical Notes panel -->
        <div v-show="activeTab === 'notes'" class="bg-white shadow-sm rounded-lg p-6">
          <!-- Notes Loading -->
          <div v-if="notesLoading" class="text-center py-4">
            <div
              class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
            ></div>
            <p class="mt-2 text-sm text-gray-600">Loading clinical notes...</p>
          </div>

          <!-- Notes List -->
          <div v-else-if="clinicalNotes.length === 0" class="text-center py-8 text-gray-500">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <p class="mt-2 text-sm">No clinical notes yet</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="note in clinicalNotes"
              :key="note.id"
              class="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-900">
                      {{ formatDate(note.session_date) }}
                    </span>
                    <span class="text-xs text-gray-500">
                      • Created {{ formatDate(note.created_at) }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleNote(note.id)"
                    class="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    {{ expandedNotes.has(note.id) ? 'Collapse' : 'Expand' }}
                  </button>
                  <NuxtLink
                    :to="`/clinical-notes/${note.id}`"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </NuxtLink>
                </div>
              </div>
              <p
                class="text-sm text-gray-700 whitespace-pre-line"
                :class="{ 'line-clamp-3': !expandedNotes.has(note.id) }"
              >
                {{ note.content }}
              </p>
            </div>
          </div>
        </div>

        <!-- Files panel -->
        <div v-show="activeTab === 'files'" class="bg-white shadow-sm rounded-lg p-6">
          <!-- File Upload Error -->
          <div v-if="fileError" class="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p class="text-red-700 text-sm">{{ fileError }}</p>
          </div>

          <!-- Files List -->
          <div v-if="filesLoading" class="text-center py-4">
            <div
              class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
            ></div>
            <p class="mt-2 text-sm text-gray-600">Loading files...</p>
          </div>

          <div v-else-if="files.length === 0" class="text-center py-8 text-gray-500">
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              ></path>
            </svg>
            <p class="mt-2 text-sm">No files uploaded yet</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="file in files"
              :key="file.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div class="flex items-center space-x-3 flex-1 min-w-0">
                <svg
                  class="h-8 w-8 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ file.file_name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ formatFileSize(file.file_size) }} • Uploaded
                    {{ formatDate(file.created_at) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="handleDownload(file.id, file.file_name)"
                  class="p-2 text-blue-600 hover:text-blue-800"
                  title="Download"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="handleDelete(file.id)"
                  class="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Activity panel -->
        <div v-show="activeTab === 'emails'" class="bg-white shadow-sm rounded-lg p-6">
          <!-- Activity Loading -->
          <div v-if="referralEmailsLoading" class="text-center py-4">
            <div
              class="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
            ></div>
            <p class="mt-2 text-sm text-gray-600">Loading email activity...</p>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="referralEmails.length === 0"
            class="text-center py-8 text-gray-500 text-sm"
          >
            No emails for this referral yet
          </div>

          <!-- Activity List -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subject
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Template
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Recipient
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    When
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="email in referralEmails" :key="email.id">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ email.subject || '—' }}</td>
                  <td class="px-4 py-3 text-sm whitespace-nowrap">
                    <span v-if="email.template_name" class="text-gray-900">
                      {{ email.template_name }}
                    </span>
                    <span v-else class="text-gray-400 italic">Manual</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ email.recipient_email }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-gray-100 text-gray-800': email.status === 'draft',
                        'bg-indigo-100 text-indigo-800': email.status === 'scheduled',
                        'bg-blue-100 text-blue-800': email.status === 'sent',
                        'bg-green-100 text-green-800': email.status === 'delivered',
                        'bg-purple-100 text-purple-800': email.status === 'opened',
                        'bg-cyan-100 text-cyan-800': email.status === 'clicked',
                        'bg-red-100 text-red-800':
                          email.status === 'bounced' || email.status === 'failed',
                        'bg-yellow-100 text-yellow-800': email.status === 'spam_complaint',
                      }"
                    >
                      {{ email.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    <template v-if="email.status === 'scheduled' && email.scheduled_at">
                      Scheduled {{ new Date(email.scheduled_at).toLocaleString() }}
                    </template>
                    <template v-else-if="email.sent_at">
                      Sent {{ new Date(email.sent_at).toLocaleString() }}
                    </template>
                    <template v-else>
                      {{ new Date(email.created_at).toLocaleString() }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditReferralModal
      v-model="showEditModal"
      :referral="referral"
      @updated="handleReferralUpdated"
    />

    <!-- Delete Modal -->
    <DeleteReferralModal
      v-model="showDeleteModal"
      :referralId="id"
      @deleted="handleReferralDeleted"
    />

    <!-- New Clinical Note Modal -->
    <NewClinicalNoteModal
      v-model="showNewNoteModal"
      :referralId="id"
      @created="handleNoteCreated"
    />

    <!-- Email PDF Modal -->
    <EmailReferralPDFModal v-model="showEmailPDFModal" @sent="handleEmailPDFSent" />

    <!-- Generate Email Modal -->
    <GenerateEmailModal
      v-model="showGenerateEmailModal"
      :referral-id="id"
      :default-email="referral?.email || ''"
      @generated="handleEmailGenerated"
    />

    <!-- Edit Credit Card Modal -->
    <EditCreditCardModal
      v-model="showEditCardModal"
      :referralId="id"
      :existingCard="creditCard"
      @saved="handleCreditCardSaved"
    />

    <!-- Delete Credit Card Modal -->
    <DeleteCreditCardModal
      v-model="showDeleteCardModal"
      :referralId="id"
      @deleted="handleCreditCardDeleted"
    />

    <!-- Edit Presenting Issues Modal -->
    <EditPresentingIssuesModal
      v-model="showPresentingIssuesModal"
      :referral="referral"
      @updated="handlePresentingIssuesUpdated"
    />

    <!-- Merge Referral Modal -->
    <MergeReferralModal
      v-model="showMergeModal"
      :currentReferral="referral"
      @merged="handleReferralMerged"
    />

    <!-- Email Error Modal -->
    <div
      v-if="showEmailErrorModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="showEmailErrorModal = false"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
            >
              <svg
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
              <h3 class="text-lg font-medium text-gray-900">Email Failed</h3>
            </div>
          </div>
          <div class="mt-2 px-1">
            <p class="text-sm text-gray-700">{{ emailErrorMessage }}</p>
          </div>
          <div class="mt-6">
            <button
              @click="showEmailErrorModal = false"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Email Success Modal -->
    <SuccessModal
      v-model="showEmailSuccessModal"
      title="Email Sent"
      message="Referral PDF has been emailed successfully!"
    />

    <!-- Archive Confirm Modal -->
    <ConfirmModal
      v-model="showArchiveConfirmModal"
      title="Archive Referral"
      message="Are you sure you want to archive this referral?"
      variant="warning"
      confirm-text="Archive"
      :loading="isUpdating"
      loading-text="Archiving..."
      @confirm="confirmArchive"
    />

    <!-- Payment Link Modal -->
    <div
      v-if="showPaymentLinkModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="showPaymentLinkModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-[480px] max-w-full shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">Payment Link Generated</h3>
              <p class="text-sm text-gray-500">
                Valid for 7 days. Share this link with the client.
              </p>
            </div>
          </div>

          <p class="text-sm text-gray-600 mb-3">
            Send this link to the client so they can securely enter their credit card information.
            The link can only be used once — it will expire automatically after 7 days or
            immediately after the client submits their card details.
          </p>

          <div class="mt-2">
            <label class="block text-xs font-medium text-gray-500 mb-1">Payment Link</label>
            <div class="flex gap-2 items-center">
              <input
                :value="generatedPaymentLink"
                readonly
                class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-mono truncate focus:outline-none"
              />
              <button
                @click="copyPaymentLink"
                class="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {{ paymentLinkCopied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>

          <!-- Send via Email -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <label class="block text-xs font-medium text-gray-500 mb-1">Send via Email</label>
            <div class="flex gap-2 items-center">
              <input
                v-model="paymentLinkEmail"
                type="email"
                placeholder="Enter email address"
                class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSendingPaymentLinkEmail"
                @keyup.enter="sendPaymentLinkEmail"
              />
              <button
                @click="sendPaymentLinkEmail"
                :disabled="isSendingPaymentLinkEmail || !paymentLinkEmail"
                class="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                <svg
                  v-if="isSendingPaymentLinkEmail"
                  class="animate-spin h-4 w-4 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ isSendingPaymentLinkEmail ? 'Sending…' : 'Send' }}
              </button>
            </div>
            <p
              v-if="paymentLinkEmailSuccess"
              class="mt-2 text-sm text-green-600 flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Payment link sent successfully!
            </p>
            <p v-if="paymentLinkEmailError" class="mt-2 text-sm text-red-600">
              {{ paymentLinkEmailError }}
            </p>
          </div>

          <div class="mt-6">
            <button
              @click="showPaymentLinkModal = false"
              class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate, formatDateTimeFull } from '~/utils/dateTimeUtils';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const id = route.params.id as string;

// Use the referral composable
const { referral, loading, error, getReferral, openReferral, closeReferral, archiveReferral } =
  useReferral();

// Use the files composable
const {
  files,
  loading: filesLoading,
  error: fileError,
  uploading,
  getFilesByReferralId,
  uploadFile,
  deleteFile,
  downloadFile,
  formatFileSize,
} = useFiles();

// Use the clinical notes composable
const { clinicalNotes, loading: notesLoading, getClinicalNotesByReferralId } = useClinicalNotes();

// State for updating
const isUpdating = ref(false);

// State for emailing PDF
const isEmailing = ref(false);

// Assignment editing state
const editingAssignedTo = ref(false);
const selectedUserId = ref<number | null>(null);
const assignmentSelect = ref<HTMLSelectElement | null>(null);

// Referral date editing state
const editingReferralDate = ref(false);
const selectedReferralDate = ref<string>('');
const referralDateInput = ref<HTMLInputElement | null>(null);

// Fetch users for assignment
const { users: usersList, getUsers } = useUsers();
const users = computed(() => {
  return [...usersList.value].sort((a, b) => {
    const nameA = (a.name || a.username).toLowerCase();
    const nameB = (b.name || b.username).toLowerCase();
    return nameA.localeCompare(nameB);
  });
});

// Edit modal state
const showEditModal = ref(false);

// Delete modal state
const showDeleteModal = ref(false);

// New note modal state
const showNewNoteModal = ref(false);

// Email PDF modal state
const showEmailPDFModal = ref(false);

// Generate Email modal state
const showGenerateEmailModal = ref(false);

// Referral email activity
const {
  emails: referralEmails,
  loading: referralEmailsLoading,
  getEmails: getReferralEmails,
} = useReferralEmails(id);

// Tabbed sections
type ReferralTab = 'details' | 'payment' | 'notes' | 'files' | 'emails';
const activeTab = ref<ReferralTab>('details');

const tabClass = (tab: ReferralTab) => {
  const base = 'py-3 border-b-2 text-sm font-medium transition-colors';
  return activeTab.value === tab
    ? `${base} border-blue-600 text-blue-600`
    : `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`;
};

// Presenting issues modal state
const showPresentingIssuesModal = ref(false);

// Merge modal state
const showMergeModal = ref(false);

// Credit card modal state
const showEditCardModal = ref(false);
const showDeleteCardModal = ref(false);

// Credit card state
const creditCard = ref<any>(null);
const creditCardLoading = ref(false);
const showFullCard = ref(false);

// Returns true when the card's MM/YY expiry is in the past
const isCardExpired = computed(() => {
  const expiry: string | undefined = creditCard.value?.expiry;
  if (!expiry) return false;
  const [monthStr, yearStr] = expiry.split('/');
  if (!monthStr || !yearStr) return false;
  const month = parseInt(monthStr, 10);
  const year = 2000 + parseInt(yearStr, 10);
  const now = new Date();
  // A card is valid through the end of its expiry month
  const expiryDate = new Date(year, month, 1); // first day of the month AFTER expiry
  return now >= expiryDate;
});

// Actions menu state
const showActionsMenu = ref(false);

// Handle menu action (closes menu and executes action)
const handleMenuAction = (action: () => void) => {
  showActionsMenu.value = false;
  action();
};

// Open edit modal
const openEditModal = () => {
  showEditModal.value = true;
};

// Open delete modal
const openDeleteModal = () => {
  showDeleteModal.value = true;
};

// Open new note modal
const openNewNoteModal = () => {
  showNewNoteModal.value = true;
};

// Open email PDF modal
const openEmailPDFModal = () => {
  showEmailPDFModal.value = true;
};

// Open generate email modal
const openGenerateEmailModal = () => {
  showGenerateEmailModal.value = true;
};

// Refresh the activity list after an email is generated
const handleEmailGenerated = () => {
  getReferralEmails();
};

// Open presenting issues modal
const openPresentingIssuesModal = () => {
  showPresentingIssuesModal.value = true;
};

// Open merge modal
const openMergeModal = () => {
  showMergeModal.value = true;
};

// Handle referral merged
const handleReferralMerged = async () => {
  // Reload the referral and its related data
  await getReferral(id);
  await getFilesByReferralId(id);
  await getClinicalNotesByReferralId(id);
  await loadCreditCard();
};

// Handle referral deleted
const handleReferralDeleted = () => {
  // Redirect to referrals list after successful deletion
  navigateTo('/referrals');
};

// Handle referral updated
const handleReferralUpdated = () => {
  getReferral(id);
};

// Handle presenting issues updated
const handlePresentingIssuesUpdated = () => {
  getReferral(id);
};

// Handle clinical note created
const handleNoteCreated = () => {
  getClinicalNotesByReferralId(id);
};

// Fetch referral immediately (works on both SSR and client)
await getReferral(id);

// Fetch files for this referral
if (id) {
  await getFilesByReferralId(id);
}

// Fetch clinical notes for this referral
if (id) {
  await getClinicalNotesByReferralId(id);
}

// Fetch email activity for this referral
if (id) {
  await getReferralEmails();
}

// Set page meta
useHead({
  title: computed(() =>
    referral.value
      ? `${referral.value.first_name} ${referral.value.last_name} - Referral Details`
      : 'Referral Details'
  ),
});

// Handle opening referral
const handleOpenReferral = async () => {
  if (!id || isUpdating.value) return;

  isUpdating.value = true;
  try {
    await openReferral(id);
  } catch (err: any) {
    console.error('Failed to open referral:', err);
    alert(err.data?.message || 'Failed to open referral');
  } finally {
    isUpdating.value = false;
  }
};

// Handle closing referral
const handleCloseReferral = async () => {
  if (!id || isUpdating.value) return;

  isUpdating.value = true;
  try {
    await closeReferral(id);
  } catch (err: any) {
    console.error('Failed to close referral:', err);
    alert(err.data?.message || 'Failed to close referral');
  } finally {
    isUpdating.value = false;
  }
};

// Handle setting referral to unassigned
const handleSetUnassigned = async () => {
  if (!id || isUpdating.value) return;

  isUpdating.value = true;
  try {
    await $fetch(`/api/referral/${id}/update`, {
      method: 'POST',
      body: {
        status: 'unassigned',
      },
    });

    // Refresh the referral data
    await getReferral(id);
  } catch (err: any) {
    console.error('Failed to set referral to unassigned:', err);
    alert(err.data?.message || 'Failed to set referral to unassigned');
  } finally {
    isUpdating.value = false;
  }
};

// Handle archiving referral
const handleArchiveReferral = () => {
  showArchiveConfirmModal.value = true;
};

// Confirm archive
const confirmArchive = async () => {
  if (!id || isUpdating.value) return;

  isUpdating.value = true;
  try {
    await archiveReferral(id);
    showArchiveConfirmModal.value = false;
  } catch (err: any) {
    console.error('Failed to archive referral:', err);
    alert(err.data?.message || 'Failed to archive referral');
  } finally {
    isUpdating.value = false;
  }
};

// Handle file selection
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file || !id) return;

  const result = await uploadFile(id, file);

  // Reset the input
  target.value = '';

  if (result) {
    // File uploaded successfully
    console.log('File uploaded:', result);
  }
};

// Handle file download
const handleDownload = (fileId: string, fileName: string) => {
  downloadFile(fileId, fileName);
};

// Handle file delete
const handleDelete = async (fileId: string) => {
  if (!confirm('Are you sure you want to delete this file?')) return;

  const success = await deleteFile(fileId);

  if (success) {
    console.log('File deleted successfully');
  }
};

// Email modal state
const showEmailErrorModal = ref(false);
const showEmailSuccessModal = ref(false);
const emailErrorMessage = ref('');

// Archive confirm modal state
const showArchiveConfirmModal = ref(false);

// Handle email PDF sent from modal
const handleEmailPDFSent = async (email: string) => {
  if (!id || isEmailing.value) return;

  isEmailing.value = true;
  try {
    await $fetch(`/api/referral/${id}/email-pdf`, {
      method: 'POST',
      body: { email },
    });

    showEmailSuccessModal.value = true;
  } catch (err: any) {
    console.error('Failed to email PDF:', err);
    emailErrorMessage.value = err.data?.message || err.statusMessage || 'Failed to email PDF';
    showEmailErrorModal.value = true;
  } finally {
    isEmailing.value = false;
  }
};

// Clinical notes expand/collapse functionality
const expandedNotes = ref<Set<string>>(new Set());

// Toggle individual note
const toggleNote = (noteId: string) => {
  if (expandedNotes.value.has(noteId)) {
    expandedNotes.value.delete(noteId);
  } else {
    expandedNotes.value.add(noteId);
  }
};

// Check if all notes are expanded
const allNotesExpanded = computed(() => {
  return clinicalNotes.value.length > 0 && expandedNotes.value.size === clinicalNotes.value.length;
});

// Toggle all notes
const toggleAllNotes = () => {
  if (allNotesExpanded.value) {
    // Collapse all
    expandedNotes.value.clear();
  } else {
    // Expand all
    clinicalNotes.value.forEach((note) => {
      expandedNotes.value.add(note.id);
    });
  }
};

// Credit card functions
const loadCreditCard = async () => {
  if (!id) return;

  creditCardLoading.value = true;
  try {
    const response = await $fetch(`/api/referral/${id}/credit-card`);
    if (response.creditCard) {
      creditCard.value = response.creditCard;
    }
  } catch (error) {
    console.error('Failed to load credit card:', error);
  } finally {
    creditCardLoading.value = false;
  }
};

const toggleCardVisibility = () => {
  showFullCard.value = !showFullCard.value;
};

const openEditCardModal = () => {
  showEditCardModal.value = true;
};

const handleCreditCardSaved = async () => {
  await loadCreditCard();
};

const handleDeleteCreditCard = () => {
  showDeleteCardModal.value = true;
};

const handleCreditCardDeleted = () => {
  // Clear the credit card data
  creditCard.value = null;
  showFullCard.value = false;
};

// Load credit card on mount
if (id) {
  loadCreditCard();
}

// Fetch users list for assignment dropdown
await getUsers();

// Assignment editing functions
const startEditingAssignment = () => {
  editingAssignedTo.value = true;
  selectedUserId.value = referral.value?.assigned_to ? parseInt(referral.value.assigned_to) : null;
  // Focus the select element after it renders
  nextTick(() => {
    if (assignmentSelect.value) {
      assignmentSelect.value.focus();
    }
  });
};

const cancelEditingAssignment = () => {
  editingAssignedTo.value = false;
  selectedUserId.value = null;
};

const updateAssignment = async () => {
  if (!id) return;

  try {
    await $fetch(`/api/referral/${id}/assign`, {
      method: 'POST',
      body: {
        userId: selectedUserId.value,
      },
    });

    // Refresh the referral data to show updated assignment
    await getReferral(id);
    cancelEditingAssignment();
  } catch (error) {
    console.error('Failed to update assignment:', error);
    alert('Failed to update assignment. Please try again.');
    cancelEditingAssignment();
  }
};

// Referral date editing functions
const startEditingReferralDate = () => {
  editingReferralDate.value = true;
  // Format the date to YYYY-MM-DD for the date input
  if (referral.value?.referred_at) {
    const date = new Date(referral.value.referred_at);
    const dateParts = date.toISOString().split('T');
    selectedReferralDate.value = dateParts[0] || '';
  } else {
    selectedReferralDate.value = '';
  }
  // Focus the input element after it renders
  nextTick(() => {
    if (referralDateInput.value) {
      referralDateInput.value.focus();
    }
  });
};

const cancelEditingReferralDate = () => {
  editingReferralDate.value = false;
  selectedReferralDate.value = '';
};

const updateReferralDate = async () => {
  if (!id) return;

  try {
    await $fetch(`/api/referral/${id}/update`, {
      method: 'POST',
      body: {
        referred_at: selectedReferralDate.value
          ? new Date(selectedReferralDate.value).toISOString()
          : null,
      },
    });

    // Refresh the referral data to show updated date
    await getReferral(id);
    cancelEditingReferralDate();
  } catch (error) {
    console.error('Failed to update referral date:', error);
    alert('Failed to update referral date. Please try again.');
    cancelEditingReferralDate();
  }
};

// Payment link generation
const isGeneratingPaymentLink = ref(false);
const showPaymentLinkModal = ref(false);
const generatedPaymentLink = ref('');
const paymentLinkCopied = ref(false);

const handleGeneratePaymentLink = async () => {
  if (!id || isGeneratingPaymentLink.value) return;

  isGeneratingPaymentLink.value = true;
  try {
    const response = await $fetch<{
      success: boolean;
      token: string;
      expiresAt: string;
      paymentUrl: string;
    }>(`/api/referral/${id}/generate-payment-token`, {
      method: 'POST',
    });

    // Build full absolute URL from relative paymentUrl or token
    const origin = window.location.origin;
    generatedPaymentLink.value = response.paymentUrl
      ? response.paymentUrl.startsWith('http')
        ? response.paymentUrl
        : `${origin}${response.paymentUrl}`
      : `${origin}/billing/${response.token}`;

    paymentLinkCopied.value = false;

    // Pre-populate email field with referral's email if available, and reset state
    paymentLinkEmail.value = referral.value?.email || '';
    paymentLinkEmailSuccess.value = false;
    paymentLinkEmailError.value = '';

    showPaymentLinkModal.value = true;
  } catch (err: any) {
    console.error('Failed to generate payment link:', err);
    alert(err.data?.message || 'Failed to generate payment link. Please try again.');
  } finally {
    isGeneratingPaymentLink.value = false;
  }
};

const copyPaymentLink = async () => {
  try {
    await navigator.clipboard.writeText(generatedPaymentLink.value);
    paymentLinkCopied.value = true;
    setTimeout(() => {
      paymentLinkCopied.value = false;
    }, 2000);
  } catch {
    // Fallback: select the input text manually
    const input = document.querySelector<HTMLInputElement>('input[readonly]');
    if (input) {
      input.select();
    }
  }
};

// Payment link email sending
const paymentLinkEmail = ref('');
const isSendingPaymentLinkEmail = ref(false);
const paymentLinkEmailSuccess = ref(false);
const paymentLinkEmailError = ref('');

const sendPaymentLinkEmail = async () => {
  if (!id || !paymentLinkEmail.value || isSendingPaymentLinkEmail.value) return;

  isSendingPaymentLinkEmail.value = true;
  paymentLinkEmailSuccess.value = false;
  paymentLinkEmailError.value = '';

  try {
    await $fetch(`/api/referral/${id}/send-payment-link`, {
      method: 'POST',
      body: { email: paymentLinkEmail.value },
    });

    paymentLinkEmailSuccess.value = true;
  } catch (err: any) {
    console.error('Failed to send payment link email:', err);
    paymentLinkEmailError.value =
      err.data?.message || err.statusMessage || 'Failed to send payment link email';
  } finally {
    isSendingPaymentLinkEmail.value = false;
  }
};
</script>
