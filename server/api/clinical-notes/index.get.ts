import { getClinicalNoteService } from '../../service';

export default defineEventHandler(async () => {
  const clinicalNoteService = getClinicalNoteService();
  const clinicalNotes = await clinicalNoteService.getAllClinicalNotes();

  return {
    success: true,
    clinicalNotes,
  };
});
