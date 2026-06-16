<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <NuxtLink to="/email-templates" class="text-sm text-blue-600 hover:text-blue-900">
        ← Back to templates
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 mt-2">Edit Email Template</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
      ></div>
      <p class="mt-4 text-gray-600">Loading template...</p>
    </div>

    <div v-else-if="loadError" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ loadError }}</p>
    </div>

    <EmailTemplateEditor
      v-else
      ref="editor"
      :template="template"
      submit-label="Save Changes"
      @save="onSave"
    />
  </div>
</template>

<script setup lang="ts">
import type { EmailTemplate, EmailTemplateInput } from '~/composables/useEmailTemplates';

definePageMeta({
  layout: 'default',
});

const route = useRoute();
const id = route.params.id as string;

const { isAdmin } = useIsAdmin();
const { getTemplate, updateTemplate } = useEmailTemplates();

const template = ref<EmailTemplate | null>(null);
const loading = ref(true);
const loadError = ref('');

const editor = ref<{ setError: (m: string) => void; setSaving: (v: boolean) => void } | null>(null);

const onSave = async (input: EmailTemplateInput) => {
  try {
    await updateTemplate(id, input);
    await navigateTo('/email-templates');
  } catch (err: any) {
    editor.value?.setError(err.data?.message || 'Failed to update template.');
    editor.value?.setSaving(false);
  }
};

onMounted(async () => {
  if (!isAdmin.value) {
    await navigateTo('/');
    return;
  }

  try {
    template.value = await getTemplate(id);
  } catch (err: any) {
    loadError.value = err.data?.message || 'Failed to load template.';
  } finally {
    loading.value = false;
  }
});

useHead({
  title: 'Edit Email Template - Hann Psychological Services',
});
</script>
