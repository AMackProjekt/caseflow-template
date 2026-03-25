import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getClientCredential } from "@/auth";

/**
 * GET /api/admin/check-credential?identifier=email@example.com
 * Check if a client credential was stored (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated and admin
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const identifier = req.nextUrl.searchParams.get("identifier");
    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Query param 'identifier' (email or username) is required" },
        { status: 400 }
      );
    }

    const credential = await getClientCredential(identifier);

    if (!credential) {
      return NextResponse.json({
        success: true,
        found: false,
        message: `No credential found for identifier: "${identifier}"`,
        nextSteps: [
          "Check spelling of email/username",
          "Approval may have failed — check signup request status",
          "Try querying with the other identifier (email vs username)",
        ],
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      credential: {
        email: credential.email,
        username: credential.username,
        name: credential.name,
        approvedAt: credential.approvedAt,
        passwordHashExists: !!credential.passwordHash,
      },
      message: "Credential found ✓ — This user should be able to sign in",
    });
  } catch (err) {
    console.error("[check-credential]", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
