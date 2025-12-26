import { getReferralService, getClinicalNoteService } from '../../../service';
import { pdfService } from '../../../service/pdf-service';
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
    const clinicalNoteService = getClinicalNoteService();

    // Fetch the referral
    const referral = await referralService.getReferralById(id);

    if (!referral) {
      throw createError({
        statusCode: 404,
        message: 'Referral not found',
      });
    }

    // Fetch all clinical notes for this referral
    const clinicalNotes = await clinicalNoteService.getClinicalNotesByReferralId(id);

    // Generate the combined PDF
    const pdfBuffer = await pdfService.generateClinicalFilePDF(referral, clinicalNotes);

    // Set response headers
    event.node.res.setHeader('Content-Type', 'application/pdf');
    event.node.res.setHeader(
      'Content-Disposition',
      `attachment; filename="clinical-file-${referral.last_name}-${referral.first_name}.pdf"`
    );

    return pdfBuffer;
  }, 'Generate Clinical File PDF')
);
