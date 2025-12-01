import { getClinicalNoteService } from '../../service';
import type { NewClinicalNote } from '../../types/clinical-note-types';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate required fields
  if (!body.referralId || !body.noteDate || !body.content) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: referralId, noteDate, and content are required',
    });
  }

  const clinicalNoteService = getClinicalNoteService();

  // Map request body to NewClinicalNote
  const newClinicalNote: NewClinicalNote = {
    referral_id: body.referralId,
    note_date: body.noteDate,
    content: body.content,
    author_id: body.authorId,
  };

  const clinicalNote = await clinicalNoteService.createClinicalNote(newClinicalNote);

  return {
    success: true,
    clinicalNote,
  };
});
