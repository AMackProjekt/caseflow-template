import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/authz";
import { enforce } from "@/lib/policy";

export interface ComplianceStatus {
  checks: {
    phi_workflow_approved: boolean;
    baa_confirmed: boolean;
    encryption_key_configured: boolean;
    auth_secret_configured: boolean;
    google_oauth_configured: boolean;
    kv_store_configured: boolean;
  };
  overall: "approved" | "pending" | "not-configured";
  evaluated_at: string;
}

function evaluate(): ComplianceStatus {
  const checks = {
    phi_workflow_approved: process.env.PHI_WORKFLOW_APPROVED === "true",
    baa_confirmed: process.env.BAA_CONFIRMED === "true",
    encryption_key_configured: Boolean(process.env.DATA_ENCRYPTION_KEY),
    auth_secret_configured: Boolean(process.env.AUTH_SECRET),
    google_oauth_configured:
      Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET),
    kv_store_configured:
      Boolean(process.env.KV_REST_API_URL) && Boolean(process.env.KV_REST_API_TOKEN),
  };

  const criticalPass =
    checks.phi_workflow_approved &&
    checks.baa_confirmed &&
    checks.encryption_key_configured &&
    checks.auth_secret_configured &&
    checks.google_oauth_configured;

  const overall: ComplianceStatus["overall"] = criticalPass
    ? "approved"
    : Object.values(checks).some(Boolean)
    ? "pending"
    : "not-configured";

  return { checks, overall, evaluated_at: new Date().toISOString() };
}

export async function GET() {
  const auth = await getAuthContext();

  if (!auth.isAuthenticated || !auth.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const policy = enforce(auth.role, "compliance", "read");
  if (!policy.allowed) {
    return NextResponse.json({ error: policy.error }, { status: policy.status });
  }

  return NextResponse.json(evaluate());
}
