import crypto from "crypto";

export interface HashResult {
  hash: string;
  salt: string;
}

/**
 * Hashes a password using PBKDF2 with a secure random salt (SHA-512, 10,000 iterations)
 */
export function hashPassword(password: string, existingSalt?: string): HashResult {
  const salt = existingSalt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return { hash, salt };
}

/**
 * Verifies a plaintext password against a stored hash and salt
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const result = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(result.hash, "hex"), Buffer.from(hash, "hex"));
}

/**
 * Generates a cryptographically random token (e.g. for email verification, reset password, sessions)
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Generates a 6-digit numeric OTP code for SMS verification
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + crypto.randomInt(900000)).toString();
}

/**
 * Validates standard Egyptian mobile numbers (Vodafone, Orange, Etisalat, WE)
 * Allowed formats:
 * - 010XXXXXXXX (Vodafone)
 * - 011XXXXXXXX (Etisalat)
 * - 012XXXXXXXX (Orange)
 * - 015XXXXXXXX (WE)
 * Optional +2 prefix: +2010XXXXXXXX
 */
export function validateEgyptianPhone(phone: string): { isValid: boolean; normalizedPhone?: string; network?: string } {
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  if (cleaned.startsWith("+2")) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith("002")) {
    cleaned = cleaned.substring(3);
  }

  const regex = /^(010|011|012|015)[0-9]{8}$/;
  if (!regex.test(cleaned)) {
    return { isValid: false };
  }

  const prefix = cleaned.substring(0, 3);
  let network = "Egyptian Mobile";
  if (prefix === "010") network = "Vodafone Egypt";
  else if (prefix === "011") network = "Etisalat Egypt";
  else if (prefix === "012") network = "Orange Egypt";
  else if (prefix === "015") network = "WE (Telecom Egypt)";

  return {
    isValid: true,
    normalizedPhone: cleaned,
    network,
  };
}
