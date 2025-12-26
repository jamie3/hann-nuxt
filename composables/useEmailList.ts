interface EmailsResponse {
  success: boolean;
  emails: any[];
}

export const useEmailList = () => {
  const data = ref<EmailsResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getEmails = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<EmailsResponse>('/api/emails');
      data.value = response;
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      data.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    getEmails,
  };
};
