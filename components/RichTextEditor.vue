<template>
  <div class="border border-gray-300 rounded-md overflow-hidden">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-1 border-b border-gray-200 px-2 py-1.5 bg-gray-50">
      <template v-if="mode === 'wysiwyg'">
        <!-- Text style -->
        <select
          class="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          @change="setBlock($event)"
          title="Text style"
        >
          <option value="p">Normal</option>
          <option value="h2">Heading</option>
          <option value="h3">Subheading</option>
        </select>

        <span class="w-px h-5 bg-gray-300 mx-1"></span>

        <button
          type="button"
          class="rte-btn font-bold"
          title="Bold"
          @mousedown.prevent="exec('bold')"
        >
          B
        </button>
        <button
          type="button"
          class="rte-btn italic"
          title="Italic"
          @mousedown.prevent="exec('italic')"
        >
          I
        </button>
        <button
          type="button"
          class="rte-btn underline"
          title="Underline"
          @mousedown.prevent="exec('underline')"
        >
          U
        </button>

        <span class="w-px h-5 bg-gray-300 mx-1"></span>

        <button
          type="button"
          class="rte-btn"
          title="Bulleted list"
          @mousedown.prevent="exec('insertUnorderedList')"
        >
          • List
        </button>
        <button
          type="button"
          class="rte-btn"
          title="Numbered list"
          @mousedown.prevent="exec('insertOrderedList')"
        >
          1. List
        </button>

        <span class="w-px h-5 bg-gray-300 mx-1"></span>

        <button
          type="button"
          class="rte-btn"
          title="Remove formatting"
          @mousedown.prevent="exec('removeFormat')"
        >
          Clear
        </button>
      </template>
      <span v-else class="text-xs text-gray-500 px-1">Editing raw HTML</span>

      <!-- Mode toggle -->
      <button
        type="button"
        class="ml-auto text-sm px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 font-medium"
        @click="toggleMode"
      >
        {{ mode === 'wysiwyg' ? 'Edit HTML' : 'Visual editor' }}
      </button>
    </div>

    <!-- WYSIWYG editor -->
    <div
      v-show="mode === 'wysiwyg'"
      ref="editable"
      class="rte-content min-h-[16rem] max-h-[28rem] overflow-auto p-3 text-sm focus:outline-none"
      contenteditable="true"
      @input="onInput"
    ></div>

    <!-- Raw HTML editor -->
    <textarea
      v-show="mode === 'html'"
      :value="modelValue"
      rows="16"
      class="w-full min-h-[16rem] max-h-[28rem] p-3 font-mono text-sm focus:outline-none resize-y"
      @input="onHtmlInput"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const mode = ref<'wysiwyg' | 'html'>('wysiwyg');
const editable = ref<HTMLElement | null>(null);

// Push the model into the contenteditable when it differs (e.g. initial load,
// external change, or after editing the raw HTML). Avoid clobbering the user's
// cursor while they're actively typing in the editor.
const syncFromModel = () => {
  if (editable.value && editable.value.innerHTML !== (props.modelValue || '')) {
    editable.value.innerHTML = props.modelValue || '';
  }
};

onMounted(syncFromModel);

watch(
  () => props.modelValue,
  () => {
    if (document.activeElement !== editable.value) syncFromModel();
  }
);

const onInput = () => {
  if (editable.value) emit('update:modelValue', editable.value.innerHTML);
};

const onHtmlInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value);
};

const exec = (command: string) => {
  document.execCommand(command, false);
  onInput();
};

const setBlock = (e: Event) => {
  const tag = (e.target as HTMLSelectElement).value;
  document.execCommand('formatBlock', false, tag);
  (e.target as HTMLSelectElement).selectedIndex = 0;
  onInput();
};

const toggleMode = () => {
  if (mode.value === 'wysiwyg') {
    mode.value = 'html';
  } else {
    mode.value = 'wysiwyg';
    // Reflect any raw-HTML edits back into the visual editor
    nextTick(syncFromModel);
  }
};
</script>

<style scoped>
.rte-btn {
  min-width: 1.75rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background: #fff;
  color: #374151;
}
.rte-btn:hover {
  background: #f3f4f6;
}

/* Tailwind's preflight strips list/heading styles; restore them inside the
   editor so formatting is visible while composing. */
.rte-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
}
.rte-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}
.rte-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0.5rem 0;
}
.rte-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.5rem 0;
}
.rte-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}
</style>
