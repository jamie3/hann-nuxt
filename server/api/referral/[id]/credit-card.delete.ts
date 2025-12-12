import { CreditCardRepository } from '~/server/repository/credit-card-repository';
import { useDB } from '~/server/utils/db';
import { logger } from '~/server/lib/logger';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Referral ID is required',
      });
    }

    const db = useDB();
    const creditCardRepository = new CreditCardRepository(db);

    // Delete the credit card for this referral
    await creditCardRepository.deleteByReferralId(id);

    return {
      success: true,
      message: 'Credit card deleted successfully',
    };
  } catch (error: any) {
    logger.error('Error deleting credit card', { error: error.message });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete credit card',
    });
  }
});
