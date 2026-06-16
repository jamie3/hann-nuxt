<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="close"
  >
    <div class="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
      <!-- Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-900">Generate Email</h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Compose -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select
              v-model="selectedTemplateId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="onTemplateChange"
            >
              <option value="">Select a template...</option>
              <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
            <input
              v-model="recipient"
              type="email"
              placeholder="Email address"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="mt-1 text-xs text-gray-500">
              Defaults to the email on file; override if needed.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              v-model="subject"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <RichTextEditor v-model="body" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Schedule for later <span class="text-gray-400">(optional)</span>
            </label>
            <input
              v-model="scheduledAt"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Preview -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Preview</h4>
          <div v-if="previewLoading" class="text-sm text-gray-500 py-8 text-center">
            Rendering preview...
          </div>
          <template v-else>
            <div class="mb-2">
              <p class="text-xs text-gray-500">Subject</p>
              <p class="text-sm font-medium text-gray-900 break-words">{{ subject || '—' }}</p>
            </div>
            <iframe
              :srcdoc="body"
              title="Email preview"
              sandbox=""
              class="w-full h-80 border border-gray-200 rounded"
            ></iframe>
          </template>
        </div>
      </div>

      <!-- Error -->
      <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ errorMessage }}</p>
      </div>

      <!-- Footer -->
      <div class="flex flex-wrap justify-end gap-3 mt-6 pt-4 border-t">
        <button
          type="button"
          @click="close"
          :disabled="submitting"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="submit('draft')"
          :disabled="submitting"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          v-if="scheduledAt"
          type="button"
          @click="submit('schedule')"
          :disabled="submitting"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {{ submitting ? 'Scheduling...' : 'Schedule' }}
        </button>
        <button
          v-else
          type="button"
          @click="submit('send')"
          :disabled="submitting"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {{ submitting ? 'Sending...' : 'Send Now' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GenerateMode } from '~/composables/useReferralEmails';

const props = defineProps<{
  modelValue: boolean;
  referralId: string;
  defaultEmail?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  generated: [];
}>();

const { templates, getTemplates } = useEmailTemplates();
const { previewEmail, generateEmail } = useReferralEmails(props.referralId);

const selectedTemplateId = ref('');
const recipient = ref('');
const subject = ref('');
const body = ref('');
const scheduledAt = ref('');

const previewLoading = ref(false);
const submitting = ref(false);
const errorMessage = ref('');

const resetForm = () => {
  selectedTemplateId.value = '';
  recipient.value = props.defaultEmail || '';
  subject.value = '';
  body.value = '';
  scheduledAt.value = '';
  errorMessage.value = '';
};

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      resetForm();
      await getTemplates();
    }
  }
);

const onTemplateChange = async () => {
  errorMessage.value = '';
  if (!selectedTemplateId.value) return;

  previewLoading.value = true;
  try {
    const result = await previewEmail(selectedTemplateId.value);
    subject.value = result.subject;
    body.value = result.body;
    // Only prefill recipient if the user hasn't already entered one
    if (!recipient.value) recipient.value = result.recipient;
  } catch (err: any) {
    errorMessage.value = err.data?.message || 'Failed to render preview.';
  } finally {
    previewLoading.value = false;
  }
};

const close = () => {
  if (!submitting.value) emit('update:modelValue', false);
};

const submit = async (mode: GenerateMode) => {
  errorMessage.value = '';

  if (!recipient.value.trim()) {
    errorMessage.value = 'A recipient email is required.';
    return;
  }
  if (!subject.value.trim() || !body.value.trim()) {
    errorMessage.value = 'Subject and body are required.';
    return;
  }

  submitting.value = true;
  try {
    await generateEmail({
      templateId: selectedTemplateId.value || undefined,
      recipient: recipient.value.trim(),
      subject: subject.value,
      body: body.value,
      mode,
      scheduledAt: mode === 'schedule' ? new Date(scheduledAt.value).toISOString() : undefined,
    });
    emit('generated');
    emit('update:modelValue', false);
  } catch (err: any) {
    errorMessage.value = err.data?.message || 'Failed to generate email.';
  } finally {
    submitting.value = false;
  }
};
</script>
