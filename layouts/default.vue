<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <Navbar />
    <main class="flex-1 overflow-y-auto p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout without sidebar - navigation is in the navbar
</script>
