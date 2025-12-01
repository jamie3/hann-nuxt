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
  const file = await fileService.getFileById(fileId);

  if (!file) {
    throw createError({
      statusCode: 404,
      message: 'File not found',
    });
  }

  // Set response headers for file download
  setResponseHeaders(event, {
    'Content-Type': file.mime_type,
    'Content-Disposition': `attachment; filename="${file.file_name}"`,
    'Content-Length': file.file_size.toString(),
  });

  return file.file_data;
});
