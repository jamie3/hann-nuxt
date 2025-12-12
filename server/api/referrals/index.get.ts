import { getReferralService } from '../../service';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt((query.page as string) || '1');
  const limit = parseInt((query.limit as string) || '25');
  const sortBy = (query.sortBy as string) || 'updated_at';
  const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'desc';
  const search = (query.search as string) || '';
  const type = (query.type as string) || '';
  const status = (query.status as string) || '';
  const assignedTo = (query.assignedTo as string) || '';

  const referralService = getReferralService();
  const result = await referralService.getAllReferrals(
    page,
    limit,
    sortBy,
    sortOrder,
    search,
    type,
    status,
    assignedTo
  );

  return {
    success: true,
    ...result,
  };
});
