import { getReferralService } from '../../../service';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Referral ID is required',
    });
  }

  try {
    const referralService = getReferralService();
    const referral = await referralService.archiveReferral(id);

    return {
      success: true,
      referral,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to archive referral',
    });
  }
});
