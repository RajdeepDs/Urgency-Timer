/**
 * Datetime utility functions for timer operations
 */

/**
 * Combines a date with time components (hour, minute, period)
 * @param date - The base date
 * @param hour - Hour in 12-hour format (1-12)
 * @param minute - Minute (0-59)
 * @param period - AM or PM
 * @returns Combined Date object
 */
export function combineDateTime(
  date: Date,
  hour: string,
  minute: string,
  period: "AM" | "PM"
): Date {
  const newDate = new Date(date);
  let hours = parseInt(hour, 10);
  const minutes = parseInt(minute, 10);

  // Convert 12-hour format to 24-hour format
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}

/**
 * Formats a date to a readable string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a date with time
 * @param date - Date to format
 * @returns Formatted datetime string
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Extracts hour in 12-hour format from a date
 * @param date - Date object
 * @returns Hour string (1-12)
 */
export function getHour12(date: Date): string {
  const hours = date.getHours();
  return hours > 12 ? String(hours - 12) : String(hours || 12);
}

/**
 * Extracts minute from a date
 * @param date - Date object
 * @returns Minute string padded with zeros
 */
export function getMinute(date: Date): string {
  return String(date.getMinutes()).padStart(2, "0");
}

/**
 * Determines AM/PM period from a date
 * @param date - Date object
 * @returns "AM" or "PM"
 */
export function getPeriod(date: Date): "AM" | "PM" {
  return date.getHours() >= 12 ? "PM" : "AM";
}

/**
 * Checks if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Checks if a date is in the future
 * @param date - Date to check
 * @returns True if date is in the future
 */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Adds minutes to a date
 * @param date - Base date
 * @param minutes - Minutes to add
 * @returns New date with added minutes
 */
export function addMinutes(date: Date, minutes: number): Date {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}

/**
 * Adds days to a date
 * @param date - Base date
 * @param days - Days to add
 * @returns New date with added days
 */
export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
