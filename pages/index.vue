<script setup lang="ts">
// Return 404 for root page
throw createError({
  statusCode: 404,
  statusMessage: 'Page Not Found',
});
</script>
