/**
 * Input validation and sanitization helpers.
 * React escapes rendered text, so these exist to keep stored data clean and to give clear form errors.
 * They are NOT a substitute for server-side validation, which must repeat every rule.
 */

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const MARKUP_CHARS = /[<>]/g;

/** Trims, strips control characters and angle brackets, and collapses runs of spaces. */
export function sanitizeText(value: string, maxLength = 200): string {
  return value
    .replace(CONTROL_CHARS, '')
    .replace(MARKUP_CHARS, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Like sanitizeText but keeps line breaks, for descriptions. */
export function sanitizeMultiline(value: string, maxLength = 2000): string {
  return value
    .replace(CONTROL_CHARS, '')
    .replace(MARKUP_CHARS, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidEmail = (value: string): boolean =>
  value.length <= 254 && EMAIL_PATTERN.test(value);

export interface PasswordCheck {
  valid: boolean;
  message: string | null;
}

export function checkPassword(value: string): PasswordCheck {
  if (value.length < 8)
    return { valid: false, message: 'Password must be at least 8 characters.' };
  if (value.length > 128)
    return { valid: false, message: 'Password must be 128 characters or fewer.' };
  return { valid: true, message: null };
}
