import { ReferralRepository } from '../../../repository/referral-repository';
import { ReferralService } from '../../../service/referral-service';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Referral ID is required',
    });
  }

  const body = await readBody(event);

  const db = useDB();
  const referralRepository = new ReferralRepository(db);
  const referralService = new ReferralService(referralRepository);

  try {
    const updatedReferral = await referralService.updateReferral(id, body);

    return {
      success: true,
      referral: updatedReferral,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || 'Failed to update referral',
    });
  }
});
