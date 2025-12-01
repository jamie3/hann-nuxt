import { getReferralService } from '../../service';

export default defineEventHandler(async () => {
  const referralService = getReferralService();
  const referrals = await referralService.getAllReferrals();

  return {
    success: true,
    referrals,
  };
});
