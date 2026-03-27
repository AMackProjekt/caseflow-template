import type { EnterpriseSettings } from "@/lib/enterprise-settings";

export interface EnterpriseControlCenterResponse {
  compliance: {
    overall: "approved" | "pending" | "not-configured";
    checks: Record<string, boolean>;
  };
  security: {
    data_encrypted: boolean;
    auth_configured: boolean;
    secure_transport: boolean;
    session_strategy: string;
  };
  integrations: {
    resend: boolean;
    googleOAuth: boolean;
    googleChatWebhook: boolean;
    convex: boolean;
    blob: boolean;
  };
  identityAccess: {
    workspaceDomain: string;
    workspaceDomainConfigured: boolean;
    adminAllowlistCount: number;
    staffAllowlistCount: number;
    clientAllowlistCount: number;
    hasTwoFactorSecret: boolean;
    enforce2fa: boolean;
    sessionTimeoutHours: EnterpriseSettings["session_timeout_hours"];
  };
  organization: {
    name: string;
    shortName: string;
    productName: string;
    domain: string;
    programType: string;
    supportEmail: string;
    fromEmail: string;
    hmisConfigured: boolean;
    googleSiteConfigured: boolean;
    portalTheme: EnterpriseSettings["portal_theme"];
    recordsPerPage: EnterpriseSettings["records_per_page"];
    showOnboarding: boolean;
    dataRetentionDays: EnterpriseSettings["data_retention_days"];
  };
  platformOperations: {
    canReseedStaff: boolean;
    canReseedCaseload: boolean;
    canExportCaseload: boolean;
    canTestEmail: boolean;
    hasSetupToken: boolean;
  };
  settings: EnterpriseSettings;
  environment: {
    nodeEnv: string;
    hasSetupToken: boolean;
  };
}

export async function fetchEnterpriseControlCenter(): Promise<EnterpriseControlCenterResponse> {
  const res = await fetch("/api/enterprise/control-center", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load enterprise control center");
  }
  return res.json() as Promise<EnterpriseControlCenterResponse>;
}

export async function saveEnterpriseSettings(settings: EnterpriseSettings): Promise<void> {
  const res = await fetch("/api/enterprise/control-center", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });

  if (!res.ok) {
    throw new Error("Failed to save enterprise settings");
  }
}
