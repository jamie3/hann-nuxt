import { ReferralRepository } from '~/server/repository/referral-repository';
import { useDB } from '~/server/utils/db';
import { determineReferralStatus } from '~/server/utils/referral-status';

export default defineEventHandler(async (event) => {
  try {
    const db = useDB();
    const referralRepository = new ReferralRepository(db);

    // Get all referrals to compute stats based on actual dates
    const allReferrals = await referralRepository.findAllRows(10000, 0, 'id', 'asc', '', '', '');

    // Compute stats based on actual date fields using shared utility
    let totalProfessional = 0;
    let totalSelf = 0;
    let totalNew = 0;
    let totalOpened = 0;
    let totalClosed = 0;
    let totalArchived = 0;

    allReferrals.forEach((referral) => {
      // Count by type
      if (referral.referral_type === 'professional') {
        totalProfessional++;
      } else if (referral.referral_type === 'self') {
        totalSelf++;
      }

      // Determine correct status based on dates using shared utility
      const actualStatus = determineReferralStatus(referral.opened_at, referral.closed_at);

      // Count by status
      if (actualStatus === 'new') {
        totalNew++;
      } else if (actualStatus === 'opened') {
        totalOpened++;
      } else if (actualStatus === 'closed') {
        totalClosed++;
      } else if (actualStatus === 'archived') {
        totalArchived++;
      }
    });

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
