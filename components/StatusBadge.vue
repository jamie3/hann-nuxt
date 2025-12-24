<template>
  <span class="px-3 py-1 text-sm font-semibold rounded-full" :class="badgeClass">
    {{ status }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'new' | 'opened' | 'closed' | 'archived';
  size?: 'sm' | 'md';
}>();

const badgeClass = computed(() => {
  const sizeClass = props.size === 'sm' ? 'px-2 text-xs leading-5' : 'px-3 py-1 text-sm';

  let colorClass = '';
  switch (props.status) {
    case 'new':
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'opened':
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case 'closed':
      colorClass = 'bg-purple-100 text-purple-800';
      break;
    case 'archived':
      colorClass = 'bg-red-100 text-red-800';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800';
  }

  return `${sizeClass} ${colorClass}`;
});
</script>
