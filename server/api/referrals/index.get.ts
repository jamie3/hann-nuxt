import { ReferralRepository } from '../../repository/referral-repository';
import { ReferralService } from '../../service/referral-service';

export default defineEventHandler(async () => {
  const db = useDB();
  const referralRepository = new ReferralRepository(db);
  const referralService = new ReferralService(referralRepository);

  const referrals = await referralService.getAllReferrals();

  return {
    success: true,
    referrals,
  };
});
