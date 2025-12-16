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

/**
 * Converts a UTC date/datetime string to local date string format (YYYY-MM-DD) for date inputs
 * This accounts for timezone offset to ensure the correct date is displayed
 */
export const utcToLocalDateString = (utcDate: string | null | undefined): string => {
  if (!utcDate) return '';
  const date = new Date(utcDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converts a local date string (YYYY-MM-DD) to UTC ISO string
 * This ensures the date is stored as midnight UTC
 */
export const localDateStringToUTC = (localDate: string): string => {
  if (!localDate) return '';
  // Create date at midnight in local timezone
  const parts = localDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return '';
  const year = parts[0]!;
  const month = parts[1]!;
  const day = parts[2]!;
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  return date.toISOString();
};
