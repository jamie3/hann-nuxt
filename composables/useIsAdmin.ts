/**
 * Returns a reactive boolean indicating whether the current session user
 * has the 'admin' role. Roles are stored on the session at login.
 */
export const useIsAdmin = () => {
  const { user } = useUserSession();

  const isAdmin = computed(() => {
    const roles = (user.value as { roles?: string[] } | null)?.roles;
    return Array.isArray(roles) && roles.includes('admin');
  });

  return { isAdmin };
};
