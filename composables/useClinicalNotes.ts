import type { ClinicalNote } from '~/server/types/clinical-note-types';

interface ClinicalNotesResponse {
  success: boolean;
  clinicalNotes: ClinicalNote[];
}

export const useClinicalNotes = () => {
  const clinicalNotes = ref<ClinicalNote[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getClinicalNotes = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } =
        await useFetch<ClinicalNotesResponse>('/api/clinical-notes');

      if (fetchError.value) {
        error.value = fetchError.value.message || 'Failed to load clinical notes';
        clinicalNotes.value = [];
      } else if (data.value) {
        clinicalNotes.value = data.value.clinicalNotes;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      clinicalNotes.value = [];
    } finally {
      loading.value = false;
    }
  };

  const getClinicalNotesByReferralId = async (referralId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<ClinicalNotesResponse>(
        `/api/referral/${referralId}/clinical-notes`
      );

      if (fetchError.value) {
        error.value = fetchError.value.message || 'Failed to load clinical notes';
        clinicalNotes.value = [];
      } else if (data.value) {
        clinicalNotes.value = data.value.clinicalNotes;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      clinicalNotes.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    clinicalNotes: readonly(clinicalNotes),
    loading: readonly(loading),
    error: readonly(error),
    getClinicalNotes,
    getClinicalNotesByReferralId,
  };
};
