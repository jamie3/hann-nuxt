/**
 * Utility functions for determining referral status
 */

export type ReferralStatus = 'unassigned' | 'new' | 'opened' | 'closed' | 'archived';

/**
 * Determine the correct referral status based on date fields and assignment
 * This ensures data consistency by using actual dates and assignment rather than trusting the database status field
 *
 * @param opened_at - The date the referral was opened (null if not opened)
 * @param closed_at - The date the referral was closed (null if not closed)
 * @param assigned_to - The user ID the referral is assigned to (null if unassigned)
 * @returns The correct status based on the date fields and assignment
 */
export function determineReferralStatus(
  opened_at: Date | null,
  closed_at: Date | null,
  assigned_to: number | null = null
): ReferralStatus {
  // If closed_at exists, status should be 'closed'
  if (closed_at) {
    return 'closed';
  }

  // If opened_at exists but no closed_at, status should be 'opened'
  if (opened_at) {
    return 'opened';
  }

  // If no assigned user and neither opened nor closed, status should be 'unassigned'
  if (!assigned_to) {
    return 'unassigned';
  }

  // If assigned but not yet opened, status should be 'new'
  return 'new';
}
