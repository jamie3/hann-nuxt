import type { FileMetadata } from '~/server/types/file-types';

interface FilesResponse {
  success: boolean;
  files: FileMetadata[];
}

interface FileUploadResponse {
  success: boolean;
  file: FileMetadata;
}

interface FileDeleteResponse {
  success: boolean;
  message: string;
}

export const useFiles = () => {
  const files = ref<FileMetadata[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const uploading = ref(false);

  const getFilesByReferralId = async (referralId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await useFetch<FilesResponse>(
        `/api/referral/${referralId}/files`
      );

      if (fetchError.value) {
        error.value = fetchError.value.message || 'Failed to load files';
        files.value = [];
      } else if (data.value) {
        files.value = data.value.files;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      files.value = [];
    } finally {
      loading.value = false;
    }
  };

  const uploadFile = async (referralId: string, file: File) => {
    uploading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error: uploadError } = await useFetch<FileUploadResponse>(
        `/api/referral/${referralId}/files/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (uploadError.value) {
        error.value = uploadError.value.message || 'Failed to upload file';
        return null;
      }

      if (data.value) {
        // Add the new file to the list
        files.value.unshift(data.value.file);
        return data.value.file;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to upload file';
      return null;
    } finally {
      uploading.value = false;
    }

    return null;
  };

  const deleteFile = async (fileId: string) => {
    error.value = null;

    try {
      const { data, error: deleteError } = await useFetch<FileDeleteResponse>(
        `/api/files/${fileId}/delete`,
        {
          method: 'POST',
        }
      );

      if (deleteError.value) {
        error.value = deleteError.value.message || 'Failed to delete file';
        return false;
      }

      if (data.value?.success) {
        // Remove the file from the list
        files.value = files.value.filter((f) => f.id !== fileId);
        return true;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete file';
      return false;
    }

    return false;
  };

  const downloadFile = (fileId: string, fileName: string) => {
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = `/api/files/${fileId}/download`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return {
    files: readonly(files),
    loading: readonly(loading),
    error: readonly(error),
    uploading: readonly(uploading),
    getFilesByReferralId,
    uploadFile,
    deleteFile,
    downloadFile,
    formatFileSize,
  };
};
