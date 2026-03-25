import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { getClientCredential } from "@/auth";
import { setEncryptedRecord } from "@/lib/server-data-store";
import { encryptJson } from "@/lib/crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://caseflow-template.vercel.app";

export type PasswordResetToken = {
  email: string;
  expiresAt: string;
  usedAt?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Email or username is required." },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("[forgot-password] RESEND_API_KEY not configured");
      // Still return success to prevent email enumeration, but log the issue
    }

    // Look up credential — but always return success to prevent email enumeration
    const credential = await getClientCredential(identifier);

    if (credential) {
      const token = randomBytes(32).toString("hex");
      const record: PasswordResetToken = {
        email: credential.email,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      };

      await setEncryptedRecord(
        "password-reset-tokens",
        `token:${token}`,
        encryptJson(record)
      );

      const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const emailResult = await resend.emails.send({
          from: "Portal <noreply@yourorg.org>",
          to: credential.email,
          cc: ["donyale@yourorg.org"],
          subject: "Reset Your Your Organization Portal Password",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f8fafc;">
              <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.07);">
                <div style="text-align:center;margin-bottom:24px;">
                  <div style="font-size:48px;">🔑</div>
                  <h2 style="color:#0f172a;margin:12px 0 4px;font-size:22px;">Password Reset Request</h2>
                  <p style="color:#64748b;margin:0;font-size:14px;">Your Organization Participant Portal</p>
                </div>
                <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 12px;">
                  Hi ${credential.name ?? credential.email},
                </p>
                <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 24px;">
                  We received a request to reset your password. Click the button below to create a new password.
                  This link expires in <strong>1 hour</strong>.
                </p>
                <div style="text-align:center;margin:28px 0;">
                  <a href="${resetUrl}"
                     style="background:#14b8a6;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;display:inline-block;">
                    Reset My Password
                  </a>
                </div>
                <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0 0 24px;">
                  If you didn't request this, you can safely ignore this email — your password won't change.
                </p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />
                <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
                  Your Organization &bull;
                  <a href="${BASE_URL}/login/client" style="color:#14b8a6;text-decoration:none;">Participant Portal</a>
                </p>
              </div>
            </div>`,
        });

        if (emailResult.error) {
          console.error("[forgot-password] Resend API error:", emailResult.error);
        } else {
          console.log("[forgot-password] Email sent successfully for:", credential.email, "ID:", emailResult.data?.id);
        }
      } catch (emailErr) {
        console.error("[forgot-password] Email send failed:", emailErr instanceof Error ? emailErr.message : emailErr);
      }
    } else {
      console.log("[forgot-password] No credential found for identifier:", identifier);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[forgot-password] Unhandled error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
