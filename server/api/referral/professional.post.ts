import { ReferralRepository } from '../../repository/referral-repository';
import { ReferralService } from '../../service/referral-service';
import type { NewReferral } from '../../types/referral-types';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate required fields for professional referral
  if (
    !body.firstName ||
    !body.lastName ||
    !body.dateOfBirth ||
    !body.primaryTelephone ||
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
    referrer_name: body.referrerName,
    referrer_relationship: body.referrerRelationship,
    referrer_email: body.referrerEmail,
    requested_service: body.requestedService,
    presenting_issues: body.presentingIssues,
    method_of_payment: body.methodOfPayment,
    referrer_prefers_contact: body.referrerPrefersContact,
    referral_type: 'professional',
  };

  const referral = await referralService.createReferral(newReferral);

  return {
    success: true,
    referral,
  };
});
