export interface EmailTemplate {
  id: string;
  public_id: string;
  name: string;
  description: string | null;
  subject: string;
  body: string;
  created_by?: number | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplateInput {
  name: string;
  description?: string | null;
  subject: string;
  body: string;
}

export const useEmailTemplates = () => {
  const templates = ref<EmailTemplate[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getTemplates = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ success: boolean; templates: EmailTemplate[] }>(
        '/api/email-templates'
      );
      templates.value = response.templates;
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'An error occurred';
      templates.value = [];
    } finally {
      loading.value = false;
    }
  };

  const getTemplate = async (id: string) => {
    const response = await $fetch<{ success: boolean; template: EmailTemplate }>(
      `/api/email-templates/${id}`
    );
    return response.template;
  };

  const createTemplate = async (input: EmailTemplateInput) => {
    const response = await $fetch<{ success: boolean; template: EmailTemplate }>(
      '/api/email-templates',
      { method: 'POST', body: input }
    );
    return response.template;
  };

  const updateTemplate = async (id: string, input: EmailTemplateInput) => {
    const response = await $fetch<{ success: boolean; template: EmailTemplate }>(
      `/api/email-templates/${id}`,
      { method: 'PUT', body: input }
    );
    return response.template;
  };

  const deleteTemplate = async (id: string) => {
    await $fetch(`/api/email-templates/${id}`, { method: 'DELETE' });
  };

  return {
    templates: readonly(templates),
    loading: readonly(loading),
    error: readonly(error),
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};
