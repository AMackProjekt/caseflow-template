import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/authz";
import { enforce } from "@/lib/policy";
import { getEncryptedRecord, setEncryptedRecord } from "@/lib/server-data-store";
import { decryptJson, encryptJson } from "@/lib/crypto";
import { ORG } from "@/config/org";
import {
	defaultEnterpriseSettings,
	enterpriseSettingsSchema,
	mergeEnterpriseSettings,
	type EnterpriseSettings,
} from "@/lib/enterprise-settings";

const SETTINGS_NAMESPACE = "enterprise-control";
const SETTINGS_KEY = "settings";

type ControlCenterSummary = {
	compliance: {
		overall: "approved" | "pending" | "not-configured";
		checks: {
			phi_workflow_approved: boolean;
			baa_confirmed: boolean;
			encryption_key_configured: boolean;
			auth_secret_configured: boolean;
			google_oauth_configured: boolean;
			kv_store_configured: boolean;
		};
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
};

function parseList(value: string | undefined): string[] {
	return (value ?? "")
		.split(",")
		.map((entry) => entry.trim().toLowerCase())
		.filter(Boolean);
}

function getComplianceSummary(settings: EnterpriseSettings): ControlCenterSummary["compliance"] {
	const checks = {
		phi_workflow_approved:
			settings.phi_workflow_approved || process.env.PHI_WORKFLOW_APPROVED === "true",
		baa_confirmed: settings.baa_confirmed || process.env.BAA_CONFIRMED === "true",
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

	const overall: ControlCenterSummary["compliance"]["overall"] = criticalPass
		? "approved"
		: Object.values(checks).some(Boolean)
			? "pending"
			: "not-configured";

	return { overall, checks };
}

function getSecuritySummary(): ControlCenterSummary["security"] {
	return {
		data_encrypted: Boolean(process.env.DATA_ENCRYPTION_KEY || process.env.AUTH_SECRET),
		auth_configured:
			Boolean(process.env.AUTH_SECRET) &&
			Boolean(process.env.AUTH_GOOGLE_ID) &&
			Boolean(process.env.AUTH_GOOGLE_SECRET),
		secure_transport:
			process.env.NODE_ENV === "production" ||
			Boolean(process.env.NEXTAUTH_URL?.startsWith("https://")),
		session_strategy: "jwt",
	};
}

function getIntegrationSummary(): ControlCenterSummary["integrations"] {
	return {
		resend: Boolean(process.env.RESEND_API_KEY),
		googleOAuth: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
		googleChatWebhook: Boolean(process.env.Champions_Web_Hook),
		convex: Boolean(process.env.NEXT_PUBLIC_CONVEX_URL),
		blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
	};
}

function getIdentityAccessSummary(settings: EnterpriseSettings): ControlCenterSummary["identityAccess"] {
	const adminAllowlist = parseList(process.env.ADMIN_ALLOWLIST);
	const staffAllowlist = parseList(process.env.STAFF_ALLOWLIST);
	const clientAllowlist = parseList(process.env.CLIENT_ALLOWLIST);

	return {
		workspaceDomain: ORG.domain,
		workspaceDomainConfigured: ORG.domain !== "sdtoolsinc.org",
		adminAllowlistCount: adminAllowlist.length,
		staffAllowlistCount: staffAllowlist.length,
		clientAllowlistCount: clientAllowlist.length,
		hasTwoFactorSecret: Boolean(process.env.TWO_FA_SECRET),
		enforce2fa: settings.enforce_2fa,
		sessionTimeoutHours: settings.session_timeout_hours,
	};
}

function getOrganizationSummary(settings: EnterpriseSettings): ControlCenterSummary["organization"] {
	return {
		name: ORG.name,
		shortName: ORG.shortName,
		productName: ORG.productName,
		domain: ORG.domain,
		programType: ORG.programType,
		supportEmail: ORG.supportEmail,
		fromEmail: ORG.fromEmail,
		hmisConfigured: Boolean(process.env.HMIS_SYSTEM_URL),
		googleSiteConfigured: Boolean(process.env.GOOGLE_SITE_URL),
		portalTheme: settings.portal_theme,
		recordsPerPage: settings.records_per_page,
		showOnboarding: settings.show_onboarding,
		dataRetentionDays: settings.data_retention_days,
	};
}

function getPlatformOperationsSummary(): ControlCenterSummary["platformOperations"] {
	const hasConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
	return {
		canReseedStaff: hasConvex,
		canReseedCaseload: hasConvex,
		canExportCaseload: hasConvex,
		canTestEmail: Boolean(process.env.RESEND_API_KEY),
		hasSetupToken: Boolean(process.env.SETUP_TOKEN),
	};
}

async function readStoredSettings(): Promise<EnterpriseSettings> {
	const encrypted = await getEncryptedRecord(SETTINGS_NAMESPACE, SETTINGS_KEY);
	if (!encrypted) return defaultEnterpriseSettings;

	try {
		const decoded = decryptJson<unknown>(encrypted);
		return mergeEnterpriseSettings(decoded);
	} catch {
		return defaultEnterpriseSettings;
	}
}

export async function GET() {
	const auth = await getAuthContext();
	if (!auth.isAuthenticated || !auth.email) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const permission = enforce(auth.role, "enterprise-control", "read");
	if (!permission.allowed) {
		return NextResponse.json({ error: permission.error }, { status: permission.status });
	}

	const settings = await readStoredSettings();
	const payload: ControlCenterSummary = {
		compliance: getComplianceSummary(settings),
		security: getSecuritySummary(),
		integrations: getIntegrationSummary(),
		identityAccess: getIdentityAccessSummary(settings),
		organization: getOrganizationSummary(settings),
		platformOperations: getPlatformOperationsSummary(),
		settings,
		environment: {
			nodeEnv: process.env.NODE_ENV ?? "development",
			hasSetupToken: Boolean(process.env.SETUP_TOKEN),
		},
	};

	return NextResponse.json(payload);
}

export async function PUT(req: NextRequest) {
	const auth = await getAuthContext();
	if (!auth.isAuthenticated || !auth.email) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const permission = enforce(auth.role, "enterprise-control", "write");
	if (!permission.allowed) {
		return NextResponse.json({ error: permission.error }, { status: permission.status });
	}

	const rawBody = await req.json();
	const parsed = enterpriseSettingsSchema.safeParse(rawBody);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
	}

	const encrypted = encryptJson(parsed.data);
	await setEncryptedRecord(SETTINGS_NAMESPACE, SETTINGS_KEY, encrypted);

	return NextResponse.json({ ok: true, settings: parsed.data });
}
