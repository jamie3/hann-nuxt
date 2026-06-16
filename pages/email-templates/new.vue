<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <NuxtLink to="/email-templates" class="text-sm text-blue-600 hover:text-blue-900">
        ← Back to templates
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900 mt-2">New Email Template</h1>
    </div>

    <EmailTemplateEditor ref="editor" submit-label="Create Template" @save="onSave" />
  </div>
</template>

<script setup lang="ts">
import type { EmailTemplateInput } from '~/composables/useEmailTemplates';

definePageMeta({
  layout: 'default',
});

const { isAdmin } = useIsAdmin();
const { createTemplate } = useEmailTemplates();

const editor = ref<{ setError: (m: string) => void; setSaving: (v: boolean) => void } | null>(null);

const onSave = async (input: EmailTemplateInput) => {
  try {
    await createTemplate(input);
    await navigateTo('/email-templates');
  } catch (err: any) {
    editor.value?.setError(err.data?.message || 'Failed to create template.');
    editor.value?.setSaving(false);
  }
};

onMounted(async () => {
  if (!isAdmin.value) {
    await navigateTo('/');
  }
});

useHead({
  title: 'New Email Template - Hann Psychological Services',
});
</script>
