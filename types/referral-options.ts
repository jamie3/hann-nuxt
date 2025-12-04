export const REQUESTED_SERVICES = [
  'Individual Therapy',
  'Couples Therapy',
  'Family Therapy',
  'Child Therapy',
  'Adolescent Therapy',
  'Group Therapy',
  'Psychological Assessment',
  'Cognitive Behavioral Therapy',
  'Other',
] as const;

export const PAYMENT_METHODS = ['Private Pay', 'Insurance', 'EAP', 'Other'] as const;

export const GENDERS = ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'] as const;

export type RequestedService = (typeof REQUESTED_SERVICES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type Gender = (typeof GENDERS)[number];
