import { ReferralRepository } from '~/server/repository/referral-repository';
import { useDB } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const db = useDB();
    const referralRepository = new ReferralRepository(db);

    // Get counts for different statuses and types
    const [totalProfessional, totalSelf, totalOpened, totalClosed, totalArchived, totalNew] =
      await Promise.all([
        referralRepository.count('', 'professional', 'all'),
        referralRepository.count('', 'self', 'all'),
        referralRepository.count('', '', 'opened'),
        referralRepository.count('', '', 'closed'),
        referralRepository.count('', '', 'archived'),
        referralRepository.count('', '', 'new'),
      ]);

    return {
      success: true,
      stats: {
        totalProfessional,
        totalSelf,
        totalOpened,
        totalClosed,
        totalArchived,
        totalNew,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch referral statistics',
    });
  }
});
