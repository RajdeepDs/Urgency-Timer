/**
 * Color utility functions for converting between hex and HSB color formats
 */

import type { ColorHSBA } from "../../types/timer";

/**
 * Converts a hex color string to HSB (Hue, Saturation, Brightness) format
 * @param hex - Hex color string (e.g., "#ffffff" or "ffffff")
 * @returns ColorHSBA object with hue, saturation, brightness, and alpha
 */
export function hexToHsb(hex: string): ColorHSBA {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Parse RGB values
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

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
 * Converts HSB color to hex string
 * @param color - ColorHSBA object
 * @returns Hex color string with # prefix
 */
export function hsbToHex(color: ColorHSBA): string {
  const { hue, saturation, brightness } = color;
  const h = hue / 360;
  const s = saturation;
  const v = brightness;

  const c = v * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (value: number): string => {
    const hex = Math.round((value + m) * 255).toString(16);
    return hex.padStart(2, "0");
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Validates if a string is a valid hex color
 * @param hex - String to validate
 * @returns True if valid hex color
 */
export function isValidHex(hex: string): boolean {
  const hexPattern = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(hex);
}

/**
 * Normalizes a hex color to always include # prefix and be 6 characters
 * @param hex - Hex color string
 * @returns Normalized hex color
 */
export function normalizeHex(hex: string): string {
  let normalized = hex.replace("#", "");

  // Expand 3-character hex to 6
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  return `#${normalized.toLowerCase()}`;
}

/**
 * Gets a contrasting text color (black or white) for a given background color
 * @param backgroundColor - Background color in hex format
 * @returns "#000000" or "#ffffff"
 */
export function getContrastingTextColor(backgroundColor: string): string {
  const cleanHex = backgroundColor.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#ffffff";
}

/**
 * Lightens a hex color by a percentage
 * @param hex - Hex color string
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened hex color
 */
export function lightenColor(hex: string, percent: number): string {
  const hsb = hexToHsb(hex);
  hsb.brightness = Math.min(1, hsb.brightness + percent / 100);
  return hsbToHex(hsb);
}

/**
 * Darkens a hex color by a percentage
 * @param hex - Hex color string
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened hex color
 */
export function darkenColor(hex: string, percent: number): string {
  const hsb = hexToHsb(hex);
  hsb.brightness = Math.max(0, hsb.brightness - percent / 100);
  return hsbToHex(hsb);
}
