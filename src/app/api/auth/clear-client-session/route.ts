import { NextResponse } from "next/server";

const COOKIE_PREFIXES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "authjs.csrf-token",
  "__Host-authjs.csrf-token",
  "authjs.callback-url",
  "__Secure-authjs.callback-url",
  "twofa_verified",
];

export async function POST() {
  const response = NextResponse.json({ ok: true });

  for (const cookieName of COOKIE_PREFIXES) {
    response.cookies.set(cookieName, "", {
      expires: new Date(0),
      httpOnly: cookieName !== "twofa_verified",
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}