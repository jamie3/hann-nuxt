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

export type RequestedService = (typeof REQUESTED_SERVICES)[number];
