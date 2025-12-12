import { getReferralService } from '../../../service';

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
    const referralService = getReferralService();

    // Update the assigned_to field
    const referral = await referralService.updateReferral(id, {
      assigned_to: userId,
    } as any);

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
