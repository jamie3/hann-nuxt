export interface ReferralEmailActivity {
  id: string;
  recipient_email: string;
  subject: string | null;
  template_name: string | null;
  status: string;
  tag: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  bounced_at: string | null;
  created_at: string;
}

export type GenerateMode = 'draft' | 'send' | 'schedule';

export interface GenerateEmailPayload {
  templateId?: string;
  recipient: string;
  subject: string;
  body: string;
  mode: GenerateMode;
  scheduledAt?: string;
}

export const useReferralEmails = (referralId: string) => {
  const emails = ref<ReferralEmailActivity[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getEmails = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<{ success: boolean; emails: ReferralEmailActivity[] }>(
        `/api/referral/${referralId}/emails`
      );
      emails.value = response.emails;
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'An error occurred';
      emails.value = [];
    } finally {
      loading.value = false;
    }
  };

  const previewEmail = async (templateId: string) => {
    return await $fetch<{ success: boolean; subject: string; body: string; recipient: string }>(
      `/api/referral/${referralId}/emails/preview`,
      { method: 'POST', body: { templateId } }
    );
  };

  const generateEmail = async (payload: GenerateEmailPayload) => {
    return await $fetch<{ success: boolean; status: string }>(
      `/api/referral/${referralId}/emails`,
      { method: 'POST', body: payload }
    );
  };

  return {
    emails: readonly(emails),
    loading: readonly(loading),
    error: readonly(error),
    getEmails,
    previewEmail,
    generateEmail,
  };
};
