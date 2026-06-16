<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Email Templates</h1>
        <p class="mt-2 text-sm text-gray-600">Create and manage reusable email templates</p>
      </div>
      <NuxtLink
        to="/email-templates/new"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        New Template
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading templates...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Templates Table -->
    <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Subject
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Updated
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="template in templates" :key="template.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ template.name }}</div>
                <div v-if="template.description" class="text-sm text-gray-500">
                  {{ template.description }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ template.subject }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(template.updated_at).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <NuxtLink
                  :to="`/email-templates/${template.id}`"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </NuxtLink>
                <button @click="promptDelete(template)" class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="templates.length === 0" class="text-center py-12">
        <h3 class="text-sm font-medium text-gray-900">No templates yet</h3>
        <p class="mt-1 text-sm text-gray-500">Create your first email template to get started.</p>
      </div>
    </div>

    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete Template"
      :message="`Are you sure you want to delete &quot;${templateToDelete?.name}&quot;? This can't be undone.`"
      variant="danger"
      confirm-text="Delete"
      loading-text="Deleting..."
      :loading="deleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { EmailTemplate } from '~/composables/useEmailTemplates';

definePageMeta({
  layout: 'default',
});

const { isAdmin } = useIsAdmin();
const { templates, loading, error, getTemplates, deleteTemplate } = useEmailTemplates();

const showDeleteModal = ref(false);
const deleting = ref(false);
const templateToDelete = ref<EmailTemplate | null>(null);

const promptDelete = (template: EmailTemplate) => {
  templateToDelete.value = template;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!templateToDelete.value) return;
  deleting.value = true;
  try {
    await deleteTemplate(templateToDelete.value.id);
    showDeleteModal.value = false;
    templateToDelete.value = null;
    await getTemplates();
  } catch (err: any) {
    // Surface failure but keep the modal open for retry
    alert(err.data?.message || 'Failed to delete template.');
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  if (!isAdmin.value) {
    await navigateTo('/');
    return;
  }
  await getTemplates();
});

useHead({
  title: 'Email Templates - Hann Psychological Services',
});
</script>
