import { getClinicalNoteService } from '../../../service';

export default defineEventHandler(async (event) => {
  const referralId = event.context.params?.id;

  if (!referralId) {
    throw createError({
      statusCode: 400,
      message: 'Referral ID is required',
    });
  }

  const clinicalNoteService = getClinicalNoteService();
  const clinicalNotes = await clinicalNoteService.getClinicalNotesByReferralId(referralId);

  return {
    success: true,
    clinicalNotes,
  };
});
