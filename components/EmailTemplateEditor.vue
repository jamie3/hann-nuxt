<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Editor form -->
      <div class="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Template Name <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="e.g. Appointment Reminder"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            id="description"
            v-model="form.description"
            type="text"
            placeholder="Optional short description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
            Subject <span class="text-red-500">*</span>
          </label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            placeholder="e.g. Hello {{ referral.first_name }}"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Body <span class="text-red-500">*</span>
          </label>
          <RichTextEditor v-model="form.body" />
          <p class="mt-1 text-xs text-gray-500">
            Use the visual editor, or switch to HTML to edit the markup directly. You can include
            variables like
            <code v-pre class="bg-gray-100 px-1 rounded">{{ referral.first_name }}</code>
            anywhere.
          </p>
        </div>

        <!-- Variable reference -->
        <div class="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p class="text-xs font-semibold text-gray-700 mb-2">Available variables</p>
          <div class="flex flex-wrap gap-2">
            <code
              v-for="variable in availableVariables"
              :key="variable"
              class="text-xs bg-white border border-gray-300 rounded px-2 py-1 text-gray-700"
            >
              {{ variable }}
            </code>
          </div>
          <p class="mt-2 text-xs text-gray-500">
            Variables are filled in with the referral's details when an email is generated.
          </p>
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <div class="flex justify-end gap-3 pt-2 border-t">
          <NuxtLink
            to="/email-templates"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </NuxtLink>
          <button
            type="button"
            :disabled="saving"
            @click="onSave"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Saving...' : submitLabel }}
          </button>
        </div>
      </div>

      <!-- Live preview -->
      <div class="bg-white shadow-sm rounded-lg p-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">Preview</h3>
        </div>
        <div class="mb-3">
          <p class="text-xs text-gray-500">Subject</p>
          <p class="text-sm font-medium text-gray-900 break-words">{{ form.subject || '—' }}</p>
        </div>
        <iframe
          :srcdoc="form.body"
          title="Template preview"
          sandbox=""
          class="w-full h-[28rem] border border-gray-200 rounded"
        ></iframe>
        <p class="mt-2 text-xs text-gray-500">
          Variables are shown as-is here; they are replaced with real data when generating an email.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmailTemplate, EmailTemplateInput } from '~/composables/useEmailTemplates';

interface Props {
  template?: EmailTemplate | null;
  submitLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  template: null,
  submitLabel: 'Save Template',
});

const emit = defineEmits<{
  save: [value: EmailTemplateInput];
}>();

const saving = ref(false);
const errorMessage = ref('');

const form = reactive<EmailTemplateInput>({
  name: '',
  description: '',
  subject: '',
  body: '',
});

const availableVariables = [
  '{{ referral.first_name }}',
  '{{ referral.last_name }}',
  '{{ referral.email }}',
  '{{ referral.primary_telephone }}',
  '{{ referral.requested_service }}',
  '{{ referral.status }}',
];

watch(
  () => props.template,
  (t) => {
    if (t) {
      form.name = t.name;
      form.description = t.description || '';
      form.subject = t.subject;
      form.body = t.body;
    }
  },
  { immediate: true }
);

const onSave = async () => {
  errorMessage.value = '';

  if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) {
    errorMessage.value = 'Name, subject, and body are required.';
    return;
  }

  // Parent performs the async save and toggles state via setSaving/setError.
  saving.value = true;
  emit('save', {
    name: form.name.trim(),
    description: form.description?.trim() || null,
    subject: form.subject.trim(),
    body: form.body,
  });
};

// Allow the parent to surface API errors back onto the editor.
defineExpose({
  setError: (msg: string) => {
    errorMessage.value = msg;
  },
  setSaving: (value: boolean) => {
    saving.value = value;
  },
});
</script>
