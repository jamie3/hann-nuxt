import { CreditCardRepository } from '~/server/repository/credit-card-repository';
import { useDB } from '~/server/utils/db';
import { encrypt } from '~/server/utils/encryption';
import { logger } from '~/server/lib/logger';
import { z } from 'zod';

const creditCardSchema = z.object({
  cardNumber: z.string().min(13).max(19),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry must be in MM/YY format'),
  cvv: z
    .string()
    .min(3)
    .max(4)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
});

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Referral ID is required',
      });
    }

    const body = await readBody(event);

    // Validate the input
    const validation = creditCardSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: validation.error.issues[0].message,
      });
    }

    const { cardNumber, expiry, cvv } = validation.data;

    const db = useDB();
    const creditCardRepository = new CreditCardRepository(db);

    // Encrypt the sensitive data
    const encryptedData = {
      referral_id: parseInt(id),
      card_number_encrypted: encrypt(cardNumber),
      expiry_encrypted: encrypt(expiry),
      cvv_encrypted: cvv ? encrypt(cvv) : undefined,
    };

    // Upsert the credit card
    const creditCard = await creditCardRepository.upsert(id, encryptedData);

    return {
      success: true,
      message: 'Credit card saved successfully',
      creditCardId: creditCard.id.toString(),
    };
  } catch (error: any) {
    logger.error('Error saving credit card', { error: error.message });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to save credit card',
    });
  }
});
