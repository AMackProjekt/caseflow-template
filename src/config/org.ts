// ─── Organization Configuration ───────────────────────────────────────────────
// This is the single source of truth for all org-specific values.
// Override everything here via environment variables — NO source edits needed
// when deploying for a new client. Just fill in .env.local and go.
//
// Environment variables marked NEXT_PUBLIC_ are exposed to the browser.
// All others are server-only.

export const ORG = {
  // ── Display Identity ─────────────────────────────────────────────────────
  name:        process.env.NEXT_PUBLIC_ORG_NAME      ?? "T.O.O.LS INC",
  shortName:   process.env.NEXT_PUBLIC_ORG_SHORT     ?? "SDTOOLSINC",
  slug:        process.env.NEXT_PUBLIC_ORG_SLUG      ?? "sdtoolsinc",
  tagline:     process.env.NEXT_PUBLIC_ORG_TAGLINE   ?? "Empowering communities through compassionate service.",
  mission:     process.env.NEXT_PUBLIC_ORG_MISSION   ?? "Our mission is to transform lives through comprehensive, client-centered care.",

  // ── Domain & Contact ─────────────────────────────────────────────────────
  domain:       process.env.WORKSPACE_DOMAIN         ?? "sdtoolsinc.org",
  supportEmail: process.env.SUPPORT_EMAIL            ?? "support@sdtoolsinc.org",
  fromEmail:    process.env.EMAIL_FROM               ?? "noreply@sdtoolsinc.org",

  // ── Program Type ─────────────────────────────────────────────────────────
  // Supported: "case-management" | "shelter" | "housing" | "reentry" | "youth"
  programType:  process.env.PROGRAM_TYPE             ?? "case-management",

  // ── External Integrations ────────────────────────────────────────────────
  hmisUrl:       process.env.HMIS_SYSTEM_URL         ?? "https://your-org.hmis-system.com/login",
  googleSiteUrl: process.env.GOOGLE_SITE_URL         ?? "https://sites.google.com/your-org-site",

  // ── Platform Branding (the product, not the org) ─────────────────────────
  productName:  process.env.NEXT_PUBLIC_PRODUCT_NAME ?? "CaseFlow Operations",

  // ── Staff Portal Tagline (shows under staff name in header) ──────────────
  staffMottoLine: process.env.NEXT_PUBLIC_STAFF_MOTTO ?? "The Champ Is Here",
} as const;

export type OrgConfig = typeof ORG;
export type ProgramType = "case-management" | "shelter" | "housing" | "reentry" | "youth";
