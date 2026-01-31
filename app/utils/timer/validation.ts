/**
 * Validation utility functions for timer forms
 */

import type { TimerFormData } from "../../types/timer";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates timer name
 * @param name - Timer name to validate
 * @returns Validation result
 */
export function validateTimerName(name: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim().length === 0) {
    errors.push({
      field: "timerName",
      message: "Timer name is required",
    });
  }

  if (name.length > 100) {
    errors.push({
      field: "timerName",
      message: "Timer name must be less than 100 characters",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates timer title
 * @param title - Timer title to validate
 * @returns Validation result
 */
export function validateTitle(title: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!title || title.trim().length === 0) {
    errors.push({
      field: "title",
      message: "Title is required",
    });
  }

  if (title.length > 200) {
    errors.push({
      field: "title",
      message: "Title must be less than 200 characters",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates end date for countdown timer
 * @param endDate - End date to validate
 * @returns Validation result
 */
export function validateEndDate(endDate: Date | null): ValidationResult {
  const errors: ValidationError[] = [];

  if (!endDate) {
    errors.push({
      field: "endDate",
      message: "End date is required for countdown timer",
    });
    return { isValid: false, errors };
  }

  const now = new Date();
  if (endDate <= now) {
    errors.push({
      field: "endDate",
      message: "End date must be in the future",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates fixed minutes value
 * @param minutes - Minutes to validate
 * @returns Validation result
 */
export function validateFixedMinutes(
  minutes: string | number,
): ValidationResult {
  const errors: ValidationError[] = [];
  const minutesNum =
    typeof minutes === "string" ? parseInt(minutes, 10) : minutes;

  if (isNaN(minutesNum)) {
    errors.push({
      field: "fixedMinutes",
      message: "Fixed minutes must be a valid number",
    });
    return { isValid: false, errors };
  }

  if (minutesNum < 1) {
    errors.push({
      field: "fixedMinutes",
      message: "Fixed minutes must be at least 1",
    });
  }

  if (minutesNum > 1440) {
    errors.push({
      field: "fixedMinutes",
      message: "Fixed minutes cannot exceed 1440 (24 hours)",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates button link URL
 * @param url - URL to validate
 * @returns Validation result
 */
export function validateButtonLink(url: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!url || url.trim().length === 0) {
    errors.push({
      field: "buttonLink",
      message: "Button link is required when using a button CTA",
    });
    return { isValid: false, errors };
  }

  // Basic URL validation
  try {
    // Allow relative URLs
    if (url.startsWith("/")) {
      return { isValid: true, errors: [] };
    }

    // For absolute URLs, check format
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(url)) {
      errors.push({
        field: "buttonLink",
        message:
          "Button link must be a valid URL (starting with http:// or https://) or a relative path (starting with /)",
      });
    }
  } catch (e) {
    errors.push({
      field: "buttonLink",
      message: "Invalid URL format",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates hour value (12-hour format)
 * @param hour - Hour string to validate
 * @returns Validation result
 */
export function validateHour(hour: string): ValidationResult {
  const errors: ValidationError[] = [];
  const hourNum = parseInt(hour, 10);

  if (isNaN(hourNum) || hourNum < 1 || hourNum > 12) {
    errors.push({
      field: "hour",
      message: "Hour must be between 1 and 12",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates minute value
 * @param minute - Minute string to validate
 * @returns Validation result
 */
export function validateMinute(minute: string): ValidationResult {
  const errors: ValidationError[] = [];
  const minuteNum = parseInt(minute, 10);

  if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
    errors.push({
      field: "minute",
      message: "Minute must be between 0 and 59",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates complete timer form data
 * @param formData - Timer form data to validate
 * @returns Validation result with all errors
 */
export function validateTimerForm(
  formData: Partial<TimerFormData>,
): ValidationResult {
  const allErrors: ValidationError[] = [];

  // Validate timer name
  if (formData.name !== undefined) {
    const nameValidation = validateTimerName(formData.name);
    allErrors.push(...nameValidation.errors);
  }

  // Validate title
  if (formData.title !== undefined) {
    const titleValidation = validateTitle(formData.title);
    allErrors.push(...titleValidation.errors);
  }

  // Validate timer type specific fields
  if (formData.timerType === "countdown") {
    const endDateValidation = validateEndDate(
      formData.endDate ? new Date(formData.endDate) : null,
    );
    allErrors.push(...endDateValidation.errors);
  } else if (formData.timerType === "fixed") {
    if (formData.fixedMinutes !== undefined && formData.fixedMinutes !== null) {
      const fixedMinutesValidation = validateFixedMinutes(
        formData.fixedMinutes,
      );
      allErrors.push(...fixedMinutesValidation.errors);
    }
  }

  // Validate button link if CTA is button or clickable
  if (
    (formData.ctaType === "button" || formData.ctaType === "clickable") &&
    formData.buttonLink
  ) {
    const linkValidation = validateButtonLink(formData.buttonLink);
    allErrors.push(...linkValidation.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Formats validation errors into a user-friendly message
 * @param errors - Array of validation errors
 * @returns Formatted error message
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return "";

  if (errors.length === 1) {
    return errors[0].message;
  }

  return errors.map((error) => `• ${error.message}`).join("\n");
}

/**
 * Checks if form has required fields filled
 * @param formData - Timer form data
 * @returns True if all required fields are present
 */
export function hasRequiredFields(formData: Partial<TimerFormData>): boolean {
  return !!(formData.name && formData.title && formData.type);
}
