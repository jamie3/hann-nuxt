import { getClinicalNoteService } from '../../service';
import { withErrorHandler } from '../../utils/error-handler';

export default defineEventHandler(
  withErrorHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Clinical note ID is required',
      });
    }

    const clinicalNoteService = getClinicalNoteService();
    const clinicalNote = await clinicalNoteService.getClinicalNoteById(id);

    if (!clinicalNote) {
      throw createError({
        statusCode: 404,
        message: 'Clinical note not found',
      });
    }

    return {
      success: true,
      clinicalNote,
    };
  }, 'Get Clinical Note')
);
