import { getFileService } from '../../../../service';

export default defineEventHandler(async (event) => {
  const referralId = event.context.params?.id;

  if (!referralId) {
    throw createError({
      statusCode: 400,
      message: 'Referral ID is required',
    });
  }

  const fileService = getFileService();
  const files = await fileService.getFileMetadataByReferralId(referralId);

  return {
    success: true,
    files,
  };
});
