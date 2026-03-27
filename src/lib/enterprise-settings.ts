import { z } from "zod";

export const enterpriseSettingsSchema = z.object({
  enforce_2fa: z.boolean(),
  session_timeout_hours: z.enum(["1", "4", "8", "12", "24"]),
  audit_all_reads: z.boolean(),
  notify_new_client: z.boolean(),
  notify_request: z.boolean(),
  admin_email: z.string().email(),
  show_onboarding: z.boolean(),
  portal_theme: z.enum(["Dark Slate", "Light", "High Contrast"]),
  records_per_page: z.enum(["10", "25", "50", "100"]),
  phi_workflow_approved: z.boolean(),
  baa_confirmed: z.boolean(),
  data_retention_days: z.enum(["90", "180", "365", "730", "Never"]),
});

export type EnterpriseSettings = z.infer<typeof enterpriseSettingsSchema>;

export const defaultEnterpriseSettings: EnterpriseSettings = {
  enforce_2fa: true,
  session_timeout_hours: "8",
  audit_all_reads: true,
  notify_new_client: true,
  notify_request: false,
  admin_email: "admin@sdtoolsinc.org",
  show_onboarding: false,
  portal_theme: "Dark Slate",
  records_per_page: "25",
  phi_workflow_approved: false,
  baa_confirmed: false,
  data_retention_days: "365",
};

const partialEnterpriseSettingsSchema = enterpriseSettingsSchema.partial();

export function mergeEnterpriseSettings(raw: unknown): EnterpriseSettings {
  if (!raw || typeof raw !== "object") {
    return defaultEnterpriseSettings;
  }
  const partial = partialEnterpriseSettingsSchema.safeParse(raw);
  if (!partial.success) {
    return defaultEnterpriseSettings;
  }
  return {
    ...defaultEnterpriseSettings,
    ...partial.data,
  };
}
