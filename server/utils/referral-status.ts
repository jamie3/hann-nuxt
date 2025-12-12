/**
 * Utility functions for determining referral status
 */

export type ReferralStatus = 'new' | 'opened' | 'closed' | 'archived';

/**
 * Determine the correct referral status based on date fields
 * This ensures data consistency by using actual dates rather than trusting the database status field
 *
 * @param opened_at - The date the referral was opened (null if not opened)
 * @param closed_at - The date the referral was closed (null if not closed)
 * @returns The correct status based on the date fields
 */
export function determineReferralStatus(
  opened_at: Date | null,
  closed_at: Date | null
): ReferralStatus {
  // If closed_at exists, status should be 'closed'
  if (closed_at) {
    return 'closed';
  }

  // If opened_at exists but no closed_at, status should be 'opened'
  if (opened_at) {
    return 'opened';
  }

  // If neither opened_at nor closed_at exist, status should be 'new'
  return 'new';
}
