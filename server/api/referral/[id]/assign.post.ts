import { getReferralService } from '../../../service';
import { useDB } from '../../../utils/db';
import { ReferralRepository } from '../../../repository/referral-repository';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Referral ID is required',
    });
  }

  const body = await readBody(event);
  const { userId } = body;

  // userId can be null to unassign
  if (userId !== null && userId !== undefined && typeof userId !== 'number') {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID',
    });
  }

  try {
    const db = useDB();
    const referralRepository = new ReferralRepository(db);
    const referralService = getReferralService();

    // Get the current referral to check its status
    const currentReferral = await referralRepository.findByIdRow(id);

    if (!currentReferral) {
      throw createError({
        statusCode: 404,
        message: 'Referral not found',
      });
    }

    // Update the referral with the new assignment
    // Status changes should be handled manually by the user
    const referral = await referralService.updateReferral(id, { assigned_to: userId } as any);

    return {
      success: true,
      referral,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to assign referral',
    });
  }
});
