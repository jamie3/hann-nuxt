import { getReferralService } from '../../service';
import type { NewReferral } from '../../types/referral-types';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Verify Turnstile token if provided
  if (body.turnstileToken) {
    const { success } = await verifyTurnstileToken(body.turnstileToken);

    if (!success) {
      throw createError({
        statusCode: 400,
        message: 'Failed to verify CAPTCHA. Please try again.',
      });
    }
  }

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

  const referralService = getReferralService();

  // Map request body to NewReferral
  const newReferral: NewReferral = {
    first_name: body.firstName,
    last_name: body.lastName,
    date_of_birth: body.dateOfBirth,
    gender: body.gender,
    parents_guardians: body.parentsGuardians,
    primary_telephone: body.primaryTelephone,
    secondary_telephone: body.secondaryTelephone,
    email: body.email,
    mailing_address: body.mailingAddress,
    address_1: body.address1,
    address_2: body.address2,
    city: body.city,
    province_state: body.provinceState,
    country: body.country,
    postal_zip: body.postalZip,
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
