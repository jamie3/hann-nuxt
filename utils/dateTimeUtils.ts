import { format, parseISO } from 'date-fns';

/**
 * Formats a date to "Jan 1, 2025" format
 */
export const formatDate = (date: Date | string): string => {
  console.log('formatDate', date);
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
};

/**
 * Formats a date to "Jan 1, 2025, 3:30 PM" format
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy, h:mm a');
};

/**
 * Formats a date to locale string (full date and time)
 */
export const formatDateTimeFull = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString();
};

/**
 * Formats a date to locale date string (date only, no time)
 */
export const formatDateLocal = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};
