<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Files</h1>
        <p class="mt-2 text-sm text-gray-600">View and manage all uploaded files</p>
      </div>
      <button
        @click="fetchFiles()"
        class="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading files...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Files Table -->
    <div v-else-if="files.length > 0" class="bg-white shadow-sm rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              File Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Size
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Referral
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Uploaded
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="file in files" :key="file.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
              <div class="flex items-center">
                <svg
                  class="h-5 w-5 text-gray-400 mr-2"
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
                {{ file.file_name }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatFileSize(file.file_size) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ file.mime_type }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <NuxtLink
                :to="`/referrals/${file.referral_id}`"
                class="text-blue-600 hover:text-blue-800"
              >
                #{{ file.referral_id.substring(0, 8) }}
              </NuxtLink>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(file.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="handleDownload(file.id, file.file_name)"
                class="text-blue-600 hover:text-blue-900 mr-4"
                title="Download"
              >
                Download
              </button>
              <button
                @click="handleDelete(file.id)"
                class="text-red-600 hover:text-red-900"
                title="Delete"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white shadow-sm rounded-lg p-8 text-center">
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
      <h3 class="mt-2 text-sm font-medium text-gray-900">No files</h3>
      <p class="mt-1 text-sm text-gray-500">No files have been uploaded yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/dateTimeUtils';
import type { FileMetadata } from '~/server/types/file-types';

definePageMeta({
  layout: 'default',
});

interface FilesResponse {
  success: boolean;
  files: FileMetadata[];
}

const { downloadFile, formatFileSize, deleteFile } = useFiles();

const files = ref<FileMetadata[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Fetch all files
const fetchFiles = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: fetchError } = await useFetch<FilesResponse>('/api/files');

    if (fetchError.value) {
      error.value = fetchError.value.message || 'Failed to load files';
      files.value = [];
    } else if (data.value) {
      files.value = data.value.files;
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred';
    files.value = [];
  } finally {
    loading.value = false;
  }
};

// Initial fetch
await fetchFiles();

// Handle file download
const handleDownload = (fileId: string, fileName: string) => {
  downloadFile(fileId, fileName);
};

// Handle file delete
const handleDelete = async (fileId: string) => {
  if (!confirm('Are you sure you want to delete this file?')) return;

  const success = await deleteFile(fileId);

  if (success) {
    // Refresh the files list
    await fetchFiles();
  }
};

// Set page meta
useHead({
  title: 'Files',
});
</script>
