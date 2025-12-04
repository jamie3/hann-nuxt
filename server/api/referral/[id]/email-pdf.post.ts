import { getReferralService } from '../../../service';
import { emailService } from '../../../service/email-service';
import { withErrorHandler } from '../../../utils/error-handler';

export default defineEventHandler(
  withErrorHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Referral ID is required',
      });
    }

    // Get email from request body
    const body = await readBody(event);
    const emailTo = body?.email;

    if (!emailTo) {
      throw createError({
        statusCode: 400,
        message: 'Email address is required',
      });
    }

    const referralService = getReferralService();

    // Get the referral
    const referral = await referralService.getReferralById(id);
    if (!referral) {
      throw createError({
        statusCode: 404,
        message: 'Referral not found',
      });
    }

    // Generate PDF
    const pdfBuffer = await referralService.generateReferralPDF(id);

    // Send email with PDF to the specified email
    const referralTypeFormatted =
      referral.referral_type === 'professional' ? 'Professional' : 'Self';
    await emailService.sendReferralNotification(referralTypeFormatted, pdfBuffer, emailTo);

    return {
      success: true,
      message: 'Referral PDF emailed successfully',
    };
  }, 'Email Referral PDF')
);
