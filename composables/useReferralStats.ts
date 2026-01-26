interface StatsResponse {
  success: boolean;
  stats: {
    totalProfessional: number;
    totalSelf: number;
    totalUnassigned: number;
    totalNew: number;
    totalOpened: number;
    totalClosed: number;
    totalArchived: number;
  };
}

export const useReferralStats = () => {
  const statsData = ref<StatsResponse['stats'] | null>(null);
  const statsLoading = ref(false);
  const statsError = ref<string | null>(null);

  const getStats = async () => {
    statsLoading.value = true;
    statsError.value = null;

    try {
      const response = await $fetch<StatsResponse>('/api/referrals/stats');

      if (response && response.stats) {
        statsData.value = response.stats;
      }
    } catch (err: any) {
      statsError.value = err.message || 'An error occurred fetching stats';
      statsData.value = null;
    } finally {
      statsLoading.value = false;
    }
  };

  return {
    statsData: readonly(statsData),
    statsLoading: readonly(statsLoading),
    statsError: readonly(statsError),
    getStats,
  };
};
