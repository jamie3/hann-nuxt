import type { ClinicalNote } from '~/server/types/clinical-note-types';

interface ClinicalNotesResponse {
  success: boolean;
  clinicalNotes: ClinicalNote[];
  total?: number;
  page?: number;
  limit?: number;
}

export const useClinicalNotes = () => {
  const clinicalNotes = ref<ClinicalNote[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const currentPage = ref(1);
  const limit = ref(25);

  const getClinicalNotes = async (
    page: number = 1,
    pageLimit: number = 25,
    sortBy: string = 'session_date',
    sortOrder: 'asc' | 'desc' = 'desc',
    search: string = ''
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<ClinicalNotesResponse>('/api/clinical-notes', {
        query: {
          page,
          limit: pageLimit,
          sortBy,
          sortOrder,
          search,
        },
      });

      if (response && response.clinicalNotes) {
        clinicalNotes.value = response.clinicalNotes;
        total.value = response.total || 0;
        currentPage.value = response.page || 1;
        limit.value = response.limit || 25;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      clinicalNotes.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const getClinicalNotesByReferralId = async (referralId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<ClinicalNotesResponse>(
        `/api/referral/${referralId}/clinical-notes`
      );

      if (response && response.clinicalNotes) {
        clinicalNotes.value = response.clinicalNotes;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      clinicalNotes.value = [];
    } finally {
      loading.value = false;
    }
  };

  const createClinicalNote = async (data: {
    referralId: string;
    sessionDate: string;
    content: string;
  }) => {
    try {
      const response = await $fetch('/api/clinical-notes/create', {
        method: 'POST',
        body: data,
      });
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    clinicalNotes: readonly(clinicalNotes),
    loading: readonly(loading),
    error: readonly(error),
    total: readonly(total),
    currentPage: readonly(currentPage),
    limit: readonly(limit),
    getClinicalNotes,
    getClinicalNotesByReferralId,
    createClinicalNote,
  };
};
