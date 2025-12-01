import { getFileService } from '../../../service';

export default defineEventHandler(async (event) => {
  const fileId = event.context.params?.id;

  if (!fileId) {
    throw createError({
      statusCode: 400,
      message: 'File ID is required',
    });
  }

  const fileService = getFileService();

  // Check if file exists
  const file = await fileService.getFileById(fileId);
  if (!file) {
    throw createError({
      statusCode: 404,
      message: 'File not found',
    });
  }

  await fileService.deleteFile(fileId);

  return {
    success: true,
    message: 'File deleted successfully',
  };
});
