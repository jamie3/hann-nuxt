export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  // Public routes that don't require authentication
  const publicRoutes = [
    '/login',
    '/logout',
    '/referral/self',
    '/referral/professional',
    '/referral/success',
    '/health',
  ];

  // Prefix-based public routes (dynamic segments)
  const publicPrefixes = ['/billing/'];

  // Check if the current route is public
  const isPublicRoute =
    publicRoutes.includes(to.path) || publicPrefixes.some((prefix) => to.path.startsWith(prefix));

  // If user is not logged in and trying to access a protected route
  if (!loggedIn.value && !isPublicRoute) {
    // Save the original URL to redirect back after login
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }

  // If user is logged in and trying to access login page, redirect to home
  if (loggedIn.value && to.path === '/login') {
    return navigateTo('/');
  }
});
