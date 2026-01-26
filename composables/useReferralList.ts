import type { Referral } from '~/server/types/referral-types';

interface ReferralsResponse {
  success: boolean;
  referrals: Referral[];
  total: number;
  page: number;
  limit: number;
}

interface ReferralFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  type?: 'all' | 'professional' | 'self';
  status?: 'active' | 'all' | 'unassigned' | 'new' | 'opened' | 'closed' | 'archived';
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
}

export const useReferralList = () => {
  const referrals = ref<Referral[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const currentPage = ref(1);
  const limit = ref(100);

  const getReferrals = async (filters: ReferralFilters = {}) => {
    loading.value = true;
    error.value = null;

    try {
      // Build query object, only including date filters if provided
      const query: any = {
        page: filters.page || 1,
        limit: filters.limit || 100,
        sortBy: filters.sortBy || 'updated_at',
        sortOrder: filters.sortOrder || 'desc',
        search: filters.search || '',
        type: filters.type || 'all',
        status: filters.status || 'active',
        assignedTo: filters.assignedTo || 'all',
      };

      // Only add date filters if they are provided
      if (filters.startDate) {
        query.startDate = filters.startDate;
      }
      if (filters.endDate) {
        query.endDate = filters.endDate;
      }

      const response = await $fetch<ReferralsResponse>('/api/referrals', {
        query,
      });

      if (response && response.referrals) {
        referrals.value = response.referrals;
        total.value = response.total;
        currentPage.value = response.page;
        limit.value = response.limit;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      referrals.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  };

  return {
    referrals: readonly(referrals),
    loading: readonly(loading),
    error: readonly(error),
    total: readonly(total),
    currentPage: readonly(currentPage),
    limit: readonly(limit),
    getReferrals,
  };
};
