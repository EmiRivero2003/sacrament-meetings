
import "server-only";

import {
  createHmac,
  createHash,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "meeting_admin_session";
const SESSION_DURATION = 60 * 60 * 8;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }

  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret())
    .update(value)
    .digest("hex");
}

function secureCompare(a: string, b: string): boolean {
  const first = Buffer.from(a, "utf8");
  const second = Buffer.from(b, "utf8");

  if (first.length !== second.length) {
    return false;
  }

  return timingSafeEqual(first, second);
}

export function verifyAdminPassword(
  password: string,
): boolean {
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || expected.length < 16) {
    throw new Error("ADMIN_PASSWORD is not configured.");
  }

  const enteredHash = createHash("sha256")
    .update(password)
    .digest("hex");

  const expectedHash = createHash("sha256")
    .update(expected)
    .digest("hex");

  return secureCompare(enteredHash, expectedHash);
}

export async function createAdminSession(): Promise<void> {
  const expires = Date.now() + SESSION_DURATION * 1000;
  const payload = String(expires);
  const token = `${payload}.${sign(payload)}`;

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  const [expires, signature, extra] = token.split(".");

  if (
    !expires ||
    !signature ||
    extra !== undefined ||
    !/^\d+$/.test(expires) ||
    Number(expires) <= Date.now()
  ) {
    return false;
  }

  return secureCompare(signature, sign(expires));
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin-login");
  }
}
