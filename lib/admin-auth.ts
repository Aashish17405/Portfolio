import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getAdminSecret(): string {
  const secret = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_KEY;
  if (!secret) {
    console.warn("⚠️ ADMIN_PASSWORD is not set in environment variables! Using default fallback.");
    return "aashish-admin-default-secret-key-change-me";
  }
  return secret;
}

/**
 * Creates an HMAC signature for a timestamp payload.
 */
function signPayload(timestamp: number, secret: string): string {
  return crypto.createHmac("sha256", secret).update(timestamp.toString()).digest("hex");
}

/**
 * Creates a signed admin session token.
 */
export function generateAdminSessionToken(): string {
  const secret = getAdminSecret();
  const timestamp = Date.now();
  const signature = signPayload(timestamp, secret);
  return `${timestamp}.${signature}`;
}

/**
 * Validates a session token.
 */
export function verifyAdminSessionToken(token: string | null | undefined): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, providedSignature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration (7 days)
  const age = Date.now() - timestamp;
  if (age < 0 || age > SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  const secret = getAdminSecret();
  const expectedSignature = signPayload(timestamp, secret);

  // Timing-safe comparison to prevent timing attacks
  try {
    const a = Buffer.from(providedSignature, "hex");
    const b = Buffer.from(expectedSignature, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Checks if the incoming request or server component is authenticated as admin.
 */
export async function isCurrentAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(sessionToken);
}

/**
 * Validates the admin password.
 */
export function verifyAdminPassword(inputPassword: string): boolean {
  const expectedPassword = getAdminSecret();
  if (!inputPassword || typeof inputPassword !== "string") return false;

  try {
    const a = Buffer.from(inputPassword);
    const b = Buffer.from(expectedPassword);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
