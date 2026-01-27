import { useIdle } from '@vueuse/core';

/**
 * Composable to handle automatic logout after period of inactivity
 * @param timeoutMs - Idle timeout in milliseconds (default: 8 hours)
 */
export const useIdleTimeout = (timeoutMs: number = 8 * 60 * 60 * 1000) => {
  const { loggedIn, clear } = useUserSession();
  const router = useRouter();

  // Track idle state - user is considered idle after the specified timeout period
  const { idle } = useIdle(timeoutMs, {
    initialState: false,
  });

  // Watch for idle state changes
  watch(idle, async (isIdle) => {
    // Only logout if user is logged in and becomes idle
    if (isIdle && loggedIn.value) {
      console.log('User has been inactive. Logging out due to inactivity...');

      // Clear the session
      await clear();

      // Redirect to login page
      await router.push('/login');

      // Show alert to user
      alert('You have been logged out due to inactivity.');
    }
  });

  return {
    idle,
    timeoutMs,
  };
};
