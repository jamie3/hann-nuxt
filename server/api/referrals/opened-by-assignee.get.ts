import { ReferralRepository } from '~/server/repository/referral-repository';
import { useDB } from '~/server/utils/db';

export default defineEventHandler(async () => {
  try {
    const db = useDB();
    const referralRepository = new ReferralRepository(db);

    const data = await referralRepository.getCaseloadByAssignee();

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch caseload by assignee',
    });
  }
});
