import type { User } from '~/server/types/user-types';

interface UsersResponse {
  success: boolean;
  users: User[];
}

export const useUsers = () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getUsers = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<UsersResponse>('/api/users');

      if (fetchError.value) {
        error.value = fetchError.value.message || 'Failed to load users';
        users.value = [];
      } else if (data.value) {
        users.value = data.value.users;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      users.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    getUsers,
  };
};
