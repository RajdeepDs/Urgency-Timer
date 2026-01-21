// Timer Helper Utilities
import type { ColorHSBA } from "../types/timer";

/**
 * Convert HSB color to hex string
 */
export function hsbToHex(color: ColorHSBA): string {
  const { hue, saturation, brightness } = color;
  const h = hue / 360;
  const s = saturation;
  const v = brightness;

  const c = v * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 1 / 6 && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 2 / 6 && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 3 / 6 && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 4 / 6 && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (value: number) => {
    const hex = Math.round((value + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert hex color to HSB
 */
export function hexToHsb(hex: string): ColorHSBA {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = 0;
  let saturation = 0;
  const brightness = max;

  if (delta !== 0) {
    saturation = delta / max;

    if (max === r) {
      hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      hue = ((b - r) / delta + 2) / 6;
    } else {
      hue = ((r - g) / delta + 4) / 6;
    }
  }

  return {
    hue: hue * 360,
    saturation,
    brightness,
    alpha: 1,
  };
}

/**
 * Combine date and time into a single Date object
 */
export function combineDateTime(
  date: Date,
  hour: string,
  minute: string,
  period: "AM" | "PM",
): Date {
  const newDate = new Date(date);
  let hours = parseInt(hour, 10);
  const minutes = parseInt(minute, 10);

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}

/**
 * Extract hour, minute, and period from a Date object
 */
export function extractTimeFromDate(date: Date): {
  hour: string;
  minute: string;
  period: "AM" | "PM";
} {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const hour = (hours % 12 || 12).toString();
  const minute = minutes.toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  return { hour, minute, period };
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date and time for display
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
 * Check if a timer is currently active based on start and end dates
 */
export function isTimerActive(
  startsAt: Date | null,
  endDate: Date | null,
): boolean {
  const now = new Date();

  // If no start date, timer is always active (unless expired)
  const hasStarted = !startsAt || now >= startsAt;

  // If no end date, timer never expires (if started)
  const hasNotExpired = !endDate || now <= endDate;

  return hasStarted && hasNotExpired;
}

/**
 * Calculate time remaining until timer ends
 */
export function getTimeRemaining(endDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const now = new Date();
  const total = endDate.getTime() - now.getTime();

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, total };
}

/**
 * Validate timer form data
 */
export function validateTimerData(data: {
  name: string;
  title: string;
  timerType: string;
  endDate?: Date | null;
  fixedMinutes?: number | null;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Timer name is required");
  }

  if (!data.title || data.title.trim() === "") {
    errors.push("Title is required");
  }

  if (data.timerType === "countdown") {
    if (!data.endDate) {
      errors.push("End date is required for countdown timers");
    } else if (data.endDate <= new Date()) {
      errors.push("End date must be in the future");
    }
  }

  if (data.timerType === "fixed") {
    if (!data.fixedMinutes || data.fixedMinutes <= 0) {
      errors.push("Fixed minutes must be greater than 0");
    } else if (data.fixedMinutes > 1440) {
      errors.push("Fixed minutes cannot exceed 1440 (24 hours)");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get timer type display name
 */
export function getTimerTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    "product-page": "Product Page",
    "top-bottom-bar": "Top/Bottom Bar",
    "landing-page": "Landing Page",
    "cart-page": "Cart Page",
  };

  return typeNames[type] || type;
}

/**
 * Get timer status badge variant
 */
export function getTimerStatusVariant(
  isPublished: boolean,
  isActive: boolean,
): "success" | "info" | "warning" | "critical" {
  if (!isActive) return "critical";
  if (isPublished) return "success";
  return "info";
}

/**
 * Get timer status text
 */
export function getTimerStatusText(
  isPublished: boolean,
  isActive: boolean,
): string {
  if (!isActive) return "Inactive";
  if (isPublished) return "Published";
  return "Draft";
}
