import { defineEventHandler, readBody, createError } from 'h3';
import { ReferralRepository } from '~/server/repository/referral-repository';
import { FileRepository } from '~/server/repository/file-repository';
import { ReferralService } from '~/server/service/referral-service';
import { useDB } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Referral ID is required',
    });
  }

  const body = await readBody(event);
  const { secondaryId } = body;

  if (!secondaryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Secondary referral ID is required',
    });
  }

  try {
    const db = useDB();
    const referralRepository = new ReferralRepository(db);
    const fileRepository = new FileRepository(db);
    const referralService = new ReferralService(referralRepository, fileRepository);

    const mergedReferral = await referralService.mergeReferrals(id, secondaryId);

    return {
      success: true,
      referral: mergedReferral,
    };
  } catch (error: any) {
    console.error('Error merging referrals:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to merge referrals',
    });
  }
});
