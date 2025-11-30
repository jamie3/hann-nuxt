import { ReferralRepository } from '../../repository/referral-repository';
import { ReferralService } from '../../service/referral-service';
import type { NewReferral } from '../../types/referral-types';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate required fields for self referral
  if (
    !body.firstName ||
    !body.lastName ||
    !body.dateOfBirth ||
    !body.primaryTelephone ||
    !body.email ||
    !body.requestedService
  ) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields',
    });
  }

  const db = useDB();
  const referralRepository = new ReferralRepository(db);
  const referralService = new ReferralService(referralRepository);

  // Map request body to NewReferral
  const newReferral: NewReferral = {
    first_name: body.firstName,
    last_name: body.lastName,
    date_of_birth: body.dateOfBirth,
    parents_guardians: body.parentsGuardians,
    primary_telephone: body.primaryTelephone,
    secondary_telephone: body.secondaryTelephone,
    email: body.email,
    mailing_address: body.mailingAddress,
    requested_service: body.requestedService,
    presenting_issues: body.presentingIssues,
    referral_type: 'self',
  };

  const referral = await referralService.createReferral(newReferral);

  return {
    success: true,
    referral,
  };
});
