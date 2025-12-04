import { getReferralService } from '../../../service';
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

    const referralService = getReferralService();

    // Generate PDF
    const pdfBuffer = await referralService.generateReferralPDF(id);

    // Set headers for PDF download
    setHeader(event, 'Content-Type', 'application/pdf');
    setHeader(event, 'Content-Disposition', `attachment; filename="referral-${id}.pdf"`);
    setHeader(event, 'Content-Length', pdfBuffer.length);

    return pdfBuffer;
  }, 'Get Referral PDF')
);
