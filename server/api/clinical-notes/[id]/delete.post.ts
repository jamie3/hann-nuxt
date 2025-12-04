import { getClinicalNoteService } from '../../../service';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Clinical note ID is required',
    });
  }

  try {
    const clinicalNoteService = getClinicalNoteService();

    // Soft delete by setting is_deleted to true
    const clinicalNote = await clinicalNoteService.updateClinicalNote(id, {
      is_deleted: true,
    });

    return {
      success: true,
      message: 'Clinical note deleted successfully',
      clinicalNote,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to delete clinical note',
    });
  }
});
