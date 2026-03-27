import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@/auth";
import { ORG } from "@/config/org";

/**
 * POST /api/admin/test-email
 * Test email sending via Resend (admin only)
 * Body: { email: string, subject?: string }
 */
export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated and admin
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "Test Email from Portal";

    if (!email) {
      return NextResponse.json({ success: false, error: "Email address required" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: "RESEND_API_KEY not configured in environment" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: `${ORG.productName} <${ORG.fromEmail}>`,
      to: email,
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f8fafc;">
          <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.07);">
            <h2 style="color:#0f172a;margin:0 0 12px;font-size:22px;">✅ Test Email</h2>
            <p style="color:#334155;font-size:15px;line-height:1.6;margin:0;">
              This is a test email from the ${ORG.name} portal.
            </p>
            <p style="color:#64748b;font-size:13px;margin:12px 0 0;">
              If you're seeing this, Resend email delivery is working correctly.
            </p>
          </div>
        </div>`,
    });

    if (result.error) {
      console.error("[test-email] Resend error:", result.error);
      return NextResponse.json(
        { success: false, error: result.error.message || "Email send failed" },
        { status: 500 }
      );
    }

    console.log("[test-email] Email sent successfully to:", email, "ID:", result.data?.id);

    return NextResponse.json({
      success: true,
      data: {
        to: email,
        subject,
        id: result.data?.id,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[test-email] Error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
