import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  generateAdminSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin-auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getLoginRateLimiter() {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const redis = new Redis({ url, token });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "@upstash/ratelimit/admin-login",
  });

  return ratelimit;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limiter = getLoginRateLimiter();

    if (limiter) {
      const { success } = await limiter.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many failed login attempts. Please wait 15 minutes." },
          { status: 429 }
        );
      }
    }

    const body = await req.json();
    const { password } = body || {};

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    const token = generateAdminSessionToken();

    const response = NextResponse.json({ success: true, message: "Authenticated successfully" });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
