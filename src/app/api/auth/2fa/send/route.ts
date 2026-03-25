import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import { Resend } from "resend";
import { createHmac, randomInt } from "crypto";

const RESEND_FROM = "CaseFlow Security <donyale@yourorg.org>";

function hashCode(code: string): string {
  const secret = process.env.TWO_FA_SECRET ?? "fallback-dev-secret";
  return createHmac("sha256", secret).update(code).digest("hex");
}

export async function POST(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const email = session.user.email;
  const code = String(randomInt(100000, 999999));
  const codeHash = hashCode(code);
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  await convex.mutation(api.functions.upsertOtpCode, { email, codeHash, expiresAt });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const name = session.user.name ?? email;

  await resend.emails.send({
    from: RESEND_FROM,
    to: email,
    subject: "Your CaseFlow verification code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
        <div style="background:#0f172a;padding:24px 32px;">
          <span style="color:#fff;font-size:18px;font-weight:700;">CaseFlow</span>
          <span style="color:#14b8a6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-left:12px;">2-Step Verification</span>
        </div>
        <div style="padding:32px;">
          <p style="color:#475569;margin-bottom:8px;">Hello ${name},</p>
          <p style="color:#475569;margin-bottom:24px;">Use the code below to complete your sign-in. This code expires in <strong>10 minutes</strong>.</p>
          <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;text-align:center;padding:24px 0;margin-bottom:24px;">
            <span style="font-size:42px;font-weight:900;letter-spacing:.25em;color:#0f172a;">${code}</span>
          </div>
          <p style="color:#94a3b8;font-size:12px;">If you did not attempt to sign in, please contact <a href="mailto:donyale@yourorg.org" style="color:#14b8a6;">donyale@yourorg.org</a> immediately.</p>
        </div>
      </div>`,
  });

  return NextResponse.json({ ok: true });
}
