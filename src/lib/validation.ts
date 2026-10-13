/**
 * Client-side mirrors of the server's validation rules.
 *
 * These exist so a user sees the problem as they type rather than after a round
 * trip. The server is still the authority — see StrongPassword.java and
 * ValidEmail.java, which these are kept in step with.
 */

/** Matches StrongPassword.java: 8+ chars with an upper, a lower and a digit. */
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

export const PASSWORD_MESSAGE =
  "Password must be at least 8 characters and include an uppercase letter, a lowercase letter and a number";

/**
 * Matches ValidEmail.java. Stricter than the browser's own `type="email"`,
 * which accepts a bare host such as `someone@localhost`.
 */
export const EMAIL_PATTERN =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+([.][A-Za-z0-9-]+)*[.][A-Za-z]{2,}$/;

export const EMAIL_MESSAGE = "Enter a valid email address";

/** Returns the first problem with a new password, or null when it is fine. */
export function checkPassword(password: string): string | null {
  return PASSWORD_PATTERN.test(password) ? null : PASSWORD_MESSAGE;
}

export function checkEmail(email: string): string | null {
  return EMAIL_PATTERN.test(email.trim()) ? null : EMAIL_MESSAGE;
}
