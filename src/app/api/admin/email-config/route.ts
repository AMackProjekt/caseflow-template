import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ORG } from "@/config/org";
import { getBaseUrl } from "@/lib/runtime-config";

/**
 * GET /api/admin/email-config
 * Show email configuration status (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated and admin
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const hasResendKey = !!process.env.RESEND_API_KEY;
    const baseUrl = getBaseUrl();

    return NextResponse.json({
      success: true,
      config: {
        resendConfigured: hasResendKey,
        resendApiKeyStatus: hasResendKey ? "✅ Configured" : "❌ Missing",
        baseUrl,
        environment: process.env.NODE_ENV ?? "development",
        senderDomain: ORG.domain,
        fromEmail: ORG.fromEmail,
        adminNotifyEmail: process.env.ADMIN_NOTIFY_EMAIL ?? ORG.supportEmail,
      },
      endpoints: {
        forgotPassword: "/api/auth/forgot-password",
        resetPassword: "/api/auth/reset-password",
        testEmail: "/api/admin/test-email",
      },
      notes: [
        "If Resend is not configured: Set RESEND_API_KEY environment variable",
        "Test email delivery using POST /api/admin/test-email with { email: 'your@email.com' }",
        "Check server logs for detailed error messages when emails fail to send",
      ],
    });
  } catch (err) {
    console.error("[email-config]", err);
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }
}
