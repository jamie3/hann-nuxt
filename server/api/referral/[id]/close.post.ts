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
    const referral = await referralService.closeReferral(id);

    return {
      success: true,
      referral,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || 'Failed to close referral',
    });
  }
});
