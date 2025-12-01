import { getFileService } from '../../service';

export default defineEventHandler(async () => {
  const fileService = getFileService();
  const files = await fileService.getAllFiles();

  return {
    success: true,
    files,
  };
});
