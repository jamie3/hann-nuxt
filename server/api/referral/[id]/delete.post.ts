import { getReferralService } from '../../../service';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Referral ID is required',
    });
  }

  const referralService = getReferralService();

  try {
    await referralService.deleteReferral(id);

    return {
      success: true,
      message: 'Referral deleted successfully',
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || 'Failed to delete referral',
    });
  }
});
