import { getClinicalNoteService } from '../../service';
import type { NewClinicalNote } from '../../types/clinical-note-types';
import { withErrorHandler } from '../../utils/error-handler';

export default defineEventHandler(
  withErrorHandler(async (event) => {
    const body = await readBody(event);

    // Validate required fields
    if (!body.referralId || !body.sessionDate || !body.content) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: referralId, sessionDate, and content are required',
      });
    }

    const clinicalNoteService = getClinicalNoteService();

    // Map request body to NewClinicalNote
    const newClinicalNote: NewClinicalNote = {
      referral_id: body.referralId,
      session_date: body.sessionDate,
      content: body.content,
      author_id: body.authorId,
    };

    const clinicalNote = await clinicalNoteService.createClinicalNote(newClinicalNote);

    return {
      success: true,
      clinicalNote,
    };
  }, 'Create Clinical Note')
);
