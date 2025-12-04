<script setup lang="ts">
const { loggedIn } = useUserSession();

// Redirect logged-in users to referrals
if (loggedIn.value) {
  await navigateTo('/referrals');
} else {
  // Return 404 for non-logged-in users
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  });
}
</script>
