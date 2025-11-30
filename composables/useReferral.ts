import type { Referral } from '~/server/types/referral-types';

interface ReferralResponse {
  success: boolean;
  referral: Referral;
}

export const useReferral = () => {
  const referral = ref<Referral | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getReferral = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<ReferralResponse>(`/api/referral/${id}`);

      if (fetchError.value) {
        error.value = fetchError.value.message || 'Failed to load referral';
        referral.value = null;
      } else if (data.value) {
        referral.value = data.value.referral;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      referral.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    referral: readonly(referral),
    loading: readonly(loading),
    error: readonly(error),
    getReferral,
  };
};
