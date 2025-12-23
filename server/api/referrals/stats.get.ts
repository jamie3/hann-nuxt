import { ReferralRepository } from '~/server/repository/referral-repository';
import { useDB } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const db = useDB();
    const referralRepository = new ReferralRepository(db);

    // Get stats directly from database using efficient GROUP BY queries
    const stats = await referralRepository.getStats();

    return {
      success: true,
      stats,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch referral statistics',
    });
  }
});
