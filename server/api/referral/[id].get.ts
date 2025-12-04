import { getReferralService } from '../../service';
import { withErrorHandler } from '../../utils/error-handler';

export default defineEventHandler(
  withErrorHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Referral ID is required',
      });
    }

    const referralService = getReferralService();
    const referral = await referralService.getReferralById(id);

    if (!referral) {
      throw createError({
        statusCode: 404,
        message: 'Referral not found',
      });
    }

    return {
      success: true,
      referral,
    };
  }, 'Get Referral by ID')
);
