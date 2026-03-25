import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/authz";
import { enforce } from "@/lib/policy";

/**
 * Client-safe security status summary.
 * Exposes only facts safe to show any authenticated user —
 * no admin-level env var states (BAA, PHI approval, etc.).
 */
export interface SecuritySummary {
  data_encrypted: boolean;
  auth_configured: boolean;
  secure_transport: boolean;
  session_active: boolean;
  status: "secured" | "partial" | "unconfigured";
}

function evaluate(isAuthenticated: boolean): SecuritySummary {
  const data_encrypted = Boolean(
    process.env.DATA_ENCRYPTION_KEY || process.env.AUTH_SECRET
  );
  const auth_configured =
    Boolean(process.env.AUTH_GOOGLE_ID) &&
    Boolean(process.env.AUTH_GOOGLE_SECRET) &&
    Boolean(process.env.AUTH_SECRET);
  // In production Next.js always serves over HTTPS; this reflects the env intent
  const secure_transport =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.NEXTAUTH_URL?.startsWith("https://"));

  const session_active = isAuthenticated;

  const allGood = data_encrypted && auth_configured && session_active;
  const anyGood = data_encrypted || auth_configured;

  const status: SecuritySummary["status"] = allGood
    ? "secured"
    : anyGood
    ? "partial"
    : "unconfigured";

  return { data_encrypted, auth_configured, secure_transport, session_active, status };
}

export async function GET() {
  const auth = await getAuthContext();

  if (!auth.isAuthenticated || !auth.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const policy = enforce(auth.role, "compliance-summary", "read");
  if (!policy.allowed) {
    return NextResponse.json({ error: policy.error }, { status: policy.status });
  }

  return NextResponse.json(evaluate(auth.isAuthenticated));
}
