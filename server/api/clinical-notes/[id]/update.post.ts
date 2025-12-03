import { getClinicalNoteService } from '../../../service';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Clinical note ID is required',
    });
  }

  const body = await readBody(event);

  const { sessionDate, content } = body;

  if (!sessionDate || !content) {
    throw createError({
      statusCode: 400,
      message: 'Session date and content are required',
    });
  }

  try {
    const clinicalNoteService = getClinicalNoteService();
    const clinicalNote = await clinicalNoteService.updateClinicalNote(id, {
      session_date: new Date(sessionDate),
      content,
    });

    return {
      success: true,
      clinicalNote,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update clinical note',
    });
  }
});
