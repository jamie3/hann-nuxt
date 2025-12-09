export const REQUESTED_SERVICES = [
  'Child Therapy',
  'Adolescent Therapy',
  'Adult Individual Therapy',
  'Couple Therapy',
  'Family Therapy',
  'Assessment',
  'Consultation',
] as const;

export const PAYMENT_METHODS = [
  'Private health insurance',
  'Government agency',
  'Employee assistance program',
  '3rd party payment provider',
] as const;

export const GENDERS = ['Male', 'Female', 'Gender Diverse'] as const;

export type RequestedService = (typeof REQUESTED_SERVICES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type Gender = (typeof GENDERS)[number];
