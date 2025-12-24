<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click.self="cancel"
  >
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex items-center gap-3 mb-4">
          <div
            class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full"
            :class="iconBgClass"
          >
            <svg
              class="h-6 w-6"
              :class="iconColorClass"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="iconPath"
              ></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          </div>
        </div>
        <div class="mt-2 px-1">
          <p class="text-sm text-gray-700">{{ message }}</p>
        </div>
        <div class="mt-6 flex gap-3">
          <button
            @click="cancel"
            :disabled="loading"
            class="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {{ cancelText }}
          </button>
          <button
            @click="confirm"
            :disabled="loading"
            class="flex-1 px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50"
            :class="confirmButtonClass"
          >
            {{ loading ? loadingText : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loadingText?: string;
    loading?: boolean;
    variant?: 'warning' | 'danger' | 'info';
  }>(),
  {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    loadingText: 'Processing...',
    loading: false,
    variant: 'warning',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};

const iconBgClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-100';
    case 'info':
      return 'bg-blue-100';
    case 'warning':
    default:
      return 'bg-yellow-100';
  }
});

const iconColorClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'text-red-600';
    case 'info':
      return 'text-blue-600';
    case 'warning':
    default:
      return 'text-yellow-600';
  }
});

const confirmButtonClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700';
    case 'info':
      return 'bg-blue-600 hover:bg-blue-700';
    case 'warning':
    default:
      return 'bg-yellow-600 hover:bg-yellow-700';
  }
});

const iconPath = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
    case 'info':
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    case 'warning':
    default:
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
  }
});
</script>
