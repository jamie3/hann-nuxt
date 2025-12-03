<template>
  <!-- Mobile Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Header with close button for mobile -->
      <div class="flex items-center justify-between p-4 mb-8">
        <h2 class="text-xl lg:text-2xl font-bold text-white">Hann Psychological Services</h2>
        <button
          @click="closeSidebar"
          class="lg:hidden text-gray-400 hover:text-white focus:outline-none"
          aria-label="Close sidebar"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav class="flex-1 px-4 space-y-2 overflow-y-auto">
        <NuxtLink
          to="/referrals"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          active-class="bg-gray-800 text-white"
          @click="closeSidebarOnMobile"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            ></path>
          </svg>
          <span>Referrals</span>
        </NuxtLink>

        <NuxtLink
          to="/clinical-notes"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          active-class="bg-gray-800 text-white"
          @click="closeSidebarOnMobile"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <span>Clinical Notes</span>
        </NuxtLink>

        <NuxtLink
          to="/files"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          active-class="bg-gray-800 text-white"
          @click="closeSidebarOnMobile"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            ></path>
          </svg>
          <span>Files</span>
        </NuxtLink>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
const isOpen = ref(false);

const closeSidebar = () => {
  isOpen.value = false;
};

const closeSidebarOnMobile = () => {
  // Only close on mobile (screen width < 1024px)
  if (window.innerWidth < 1024) {
    isOpen.value = false;
  }
};

// Expose method to parent components
defineExpose({
  toggleSidebar: () => {
    isOpen.value = !isOpen.value;
  },
});
</script>
