import { getFileService } from '../../../../service';
import type { NewFile } from '../../../../types/file-types';

export default defineEventHandler(async (event) => {
  const referralId = event.context.params?.id;

  if (!referralId) {
    throw createError({
      statusCode: 400,
      message: 'Referral ID is required',
    });
  }

  // Parse multipart form data
  const formData = await readMultipartFormData(event);

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No file provided',
    });
  }

  // Get the file from form data
  const fileData = formData.find((item) => item.name === 'file');

  if (!fileData || !fileData.data) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file data',
    });
  }

  const fileName = fileData.filename || 'unnamed';
  const mimeType = fileData.type || 'application/octet-stream';
  const fileSize = fileData.data.length;

  const fileService = getFileService();

  const newFile: NewFile = {
    referral_id: referralId,
    file_name: fileName,
    file_size: fileSize,
    mime_type: mimeType,
    file_data: fileData.data,
  };

  const file = await fileService.createFile(newFile);

  return {
    success: true,
    file: {
      id: file.id,
      file_name: file.file_name,
      file_size: file.file_size,
      mime_type: file.mime_type,
      created_at: file.created_at,
    },
  };
});
