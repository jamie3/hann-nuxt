import type { FileMetadata } from '~/server/types/file-types';

interface FilesResponse {
  success: boolean;
  files: FileMetadata[];
}

export const useFileList = () => {
  const files = ref<FileMetadata[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getFiles = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<FilesResponse>('/api/files');

      if (response) {
        files.value = response.files;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      files.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    files: readonly(files),
    loading: readonly(loading),
    error: readonly(error),
    getFiles,
  };
};
