import { getClinicalNoteService } from '../../service';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt((query.page as string) || '1');
  const limit = parseInt((query.limit as string) || '25');
  const sortBy = (query.sortBy as string) || 'session_date';
  const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'desc';
  const search = (query.search as string) || '';

  const clinicalNoteService = getClinicalNoteService();
  const result = await clinicalNoteService.getAllClinicalNotes(
    page,
    limit,
    sortBy,
    sortOrder,
    search
  );

  return {
    success: true,
    ...result,
  };
});
