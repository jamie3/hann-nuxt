import { getReferralService } from '../../service';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const sortBy = (query.sortBy as string) || 'updated_at';
  const sortOrder = (query.sortOrder as 'asc' | 'desc') || 'desc';

  const referralService = getReferralService();
  const referrals = await referralService.getAllReferrals(sortBy, sortOrder);

  return {
    success: true,
    referrals,
  };
});
