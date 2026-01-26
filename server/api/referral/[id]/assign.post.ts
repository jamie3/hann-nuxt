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

    // Determine if we need to update the status
    // When assigning: if status is 'unassigned', change to 'new'
    // When unassigning: if status is 'new', change to 'unassigned'
    const updateData: any = { assigned_to: userId };

    if (userId !== null && currentReferral.status === 'unassigned') {
      // Assigning to an unassigned referral -> change status to 'new'
      updateData.status = 'new';
    } else if (userId === null && currentReferral.status === 'new') {
      // Unassigning from a new referral -> change status to 'unassigned'
      updateData.status = 'unassigned';
    }

    // Update the referral with the new assignment and possibly new status
    const referral = await referralService.updateReferral(id, updateData);

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
