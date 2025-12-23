import { CreditCardRepository } from '~/server/repository/credit-card-repository';
import { useDB } from '~/server/utils/db';
import { decrypt, maskCardNumber } from '~/server/utils/encryption';
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

    const creditCard = await creditCardRepository.findByReferralId(id);

    if (!creditCard) {
      return {
        success: true,
        creditCard: null,
      };
    }

    // Decrypt the credit card data
    const decrypted = {
      id: creditCard.id.toString(),
      referral_id: creditCard.referral_id.toString(),
      card_number: decrypt(creditCard.card_number_encrypted),
      card_number_masked: maskCardNumber(decrypt(creditCard.card_number_encrypted)),
      expiry: decrypt(creditCard.expiry_encrypted),
      cvv: creditCard.cvv_encrypted ? decrypt(creditCard.cvv_encrypted) : null,
      created_at: creditCard.created_at.toISOString(),
      updated_at: creditCard.updated_at.toISOString(),
    };

    return {
      success: true,
      creditCard: decrypted,
    };
  } catch (error: any) {
    logger.error('Error fetching credit card', { error: error.message });
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch credit card',
    });
  }
});
