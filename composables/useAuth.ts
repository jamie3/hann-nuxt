interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
}

export const useAuth = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });

      return { success: true };
    } catch (err: any) {
      error.value = err.data?.message || 'Login failed. Please try again.';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Call the logout API to clear server-side session
      await $fetch<AuthResponse>('/api/auth/logout', {
        method: 'POST',
      });

      // Clear the client-side session
      const { clear } = useUserSession();
      await clear();

      return { success: true };
    } catch (err: any) {
      error.value = err.data?.message || 'An error occurred during logout. Please try again.';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  };

  const performLogin = async (credentials: LoginCredentials) => {
    const result = await login(credentials);

    if (result.success) {
      // Fetch the user session to update client-side state
      const { fetch: fetchSession } = useUserSession();
      await fetchSession();

      // Redirect to dashboard after successful login
      await navigateTo('/');
    }

    return result;
  };

  const performLogout = async () => {
    const result = await logout();

    if (result.success) {
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigateTo('/login');
      }, 1500);
    }

    return result;
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    login,
    logout,
    performLogin,
    performLogout,
  };
};
