// This file can contain other regex patterns as needed

/**
 * Regex pattern for valid slugs
 * Only allows lowercase letters, numbers, and hyphens
 * Cannot start or end with a hyphen
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
