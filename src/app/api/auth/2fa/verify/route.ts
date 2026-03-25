import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import { createHmac } from "crypto";

function hashCode(code: string): string {
  const secret = process.env.TWO_FA_SECRET ?? "fallback-dev-secret";
  return createHmac("sha256", secret).update(code).digest("hex");
}

function buildCookieValue(email: string): string {
  const secret = process.env.TWO_FA_SECRET ?? "fallback-dev-secret";
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `${Buffer.from(email).toString("base64url")}|${expiry}`;
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}|${sig}`;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const email = session.user.email;
  const { code } = (await req.json()) as { code?: string };
  if (!code || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Invalid code format." }, { status: 400 });
  }

  const codeHash = hashCode(code);
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const valid = await convex.mutation(api.functions.verifyAndConsumeOtp, { email, codeHash });

  if (!valid) {
    return NextResponse.json({ error: "Incorrect or expired code." }, { status: 403 });
  }

  const cookieValue = buildCookieValue(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("twofa_verified", cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return res;
}
