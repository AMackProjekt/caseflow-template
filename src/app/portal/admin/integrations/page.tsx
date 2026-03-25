"use client";

import { CheckCircle2, XCircle, ExternalLink, Plug, Mail, MessageSquare, Calendar, FileText, Users, Cloud, Layers } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: "google" | "microsoft" | "other";
  status: "connected" | "partial" | "not-configured";
  configKey?: string;
  docsUrl?: string;
  features: string[];
}

const INTEGRATIONS: Integration[] = [
  {
    id: "google-oauth",
    name: "Google OAuth 2.0",
    description: "Single Sign-On via Google accounts. Staff and clients authenticate with their Google identity.",
    icon: Users,
    category: "google",
    status: "connected",
    features: ["Staff SSO", "Client SSO", "Token-based sessions", "Domain enforcement (yourorg.org)"],
  },
  {
    id: "google-chat",
    name: "Google Chat Webhook",
    description: "Automatic channel notifications when new clients are added to the system.",
    icon: MessageSquare,
    category: "google",
    status: "connected",
    features: ["New client alert cards", "Champions workspace channel", "Async / non-blocking", "Gmail detection"],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Embed the staff team Google Calendar for scheduling F2F visits and appointments.",
    icon: Calendar,
    category: "google",
    status: "partial",
    features: ["Embedded calendar view", "Read-only display", "Event creation (manual)", "Pending: OAuth write access"],
  },
  {
    id: "google-drive",
    name: "Google Drive / Docs",
    description: "Store client documents in Drive and link directly from the Documents portal.",
    icon: FileText,
    category: "google",
    status: "not-configured",
    features: ["Needs: Drive API OAuth scope", "Pending: service account or delegated access", "Document sharing", "Secure link generation"],
  },
  {
    id: "google-workspace",
    name: "Google Workspace Admin",
    description: "Manage organizational accounts, groups, and directory from the admin portal.",
    icon: Cloud,
    category: "google",
    status: "not-configured",
    features: ["Needs: Admin SDK API", "User provisioning", "Group management", "Workspace audit logs"],
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Post notifications and alerts to a Teams channel via incoming webhook.",
    icon: MessageSquare,
    category: "microsoft",
    status: "not-configured",
    features: ["Needs: Teams webhook URL in env", "Adaptive card messages", "Alert routing", "Staff mention support"],
  },
  {
    id: "microsoft-365",
    name: "Microsoft 365 / Exchange",
    description: "Send email notifications via Microsoft 365 shared mailbox using Graph API.",
    icon: Mail,
    category: "microsoft",
    status: "not-configured",
    features: ["Needs: Azure AD app registration", "Microsoft Graph API", "Shared mailbox sending", "HTML email templates"],
  },
  {
    id: "microsoft-sharepoint",
    name: "SharePoint / OneDrive",
    description: "Archive client records and documents into a SharePoint document library.",
    icon: Layers,
    category: "microsoft",
    status: "not-configured",
    features: ["Needs: Graph API + SharePoint scope", "Document library upload", "Folder-per-client structure", "Version history"],
  },
  {
    id: "resend",
    name: "Resend (Email)",
    description: "Transactional email delivery for OTP codes, signup approvals, and notifications.",
    icon: Mail,
    category: "other",
    status: "connected",
    features: ["OTP / 2FA emails", "Signup approval / denial", "Branded HTML templates", "RESEND_API_KEY configured"],
  },
];

const STATUS_MAP = {
  connected: { label: "Connected", icon: CheckCircle2, cls: "text-emerald-500" },
  partial: { label: "Partial", icon: CheckCircle2, cls: "text-amber-500" },
  "not-configured": { label: "Not Configured", icon: XCircle, cls: "text-rose-400" },
};

const CATEGORY_LABELS = {
  google: "Google Workspace",
  microsoft: "Microsoft 365",
  other: "Other Services",
};

const CATEGORY_COLORS = {
  google: "text-blue-700",
  microsoft: "text-indigo-700",
  other: "text-slate-700",
};

export default function IntegrationsPage() {
  const categories = ["google", "microsoft", "other"] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Plug className="w-5 h-5 text-violet-500" /> Integrations
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Google Workspace, Microsoft 365, and third-party service connections
        </p>
      </div>

      {categories.map((cat) => {
        const items = INTEGRATIONS.filter((i) => i.category === cat);
        return (
          <div key={cat}>
            <h2 className={`text-sm font-bold mb-3 ${CATEGORY_COLORS[cat]}`}>
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((intg) => {
                const { label, icon: StatusIcon, cls } = STATUS_MAP[intg.status];
                return (
                  <div key={intg.id}
                    className={`bg-white rounded-xl border p-5 flex flex-col gap-3 ${
                      intg.status === "not-configured" ? "border-slate-200 opacity-80" : "border-slate-200"
                    }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                          <intg.icon className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{intg.name}</p>
                          <div className={`flex items-center gap-1 text-xs font-medium ${cls}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span>{label}</span>
                          </div>
                        </div>
                      </div>
                      {intg.docsUrl && (
                        <a href={intg.docsUrl} target="_blank" rel="noopener noreferrer"
                          title="View documentation"
                          className="text-slate-400 hover:text-violet-600 transition shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{intg.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {intg.features.map((f) => (
                        <span key={f} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Setup guide */}
      <div className="bg-violet-950 rounded-xl p-6 text-violet-100">
        <h2 className="text-sm font-bold mb-3 text-white">Configuration Quick-Reference</h2>
        <div className="space-y-2 text-xs font-mono leading-relaxed text-violet-300">
          <p><span className="text-violet-400">Google OAuth:</span> AUTH_GOOGLE_ID · AUTH_GOOGLE_SECRET ✓</p>
          <p><span className="text-violet-400">Google Chat:</span> Champions_Web_Hook ✓</p>
          <p><span className="text-violet-400">Email (Resend):</span> RESEND_API_KEY ✓</p>
          <p><span className="text-violet-400">Google Drive:</span> GOOGLE_SERVICE_ACCOUNT_JSON (pending)</p>
          <p><span className="text-violet-400">MS Teams:</span> TEAMS_WEBHOOK_URL (pending)</p>
          <p><span className="text-violet-400">MS Graph:</span> AZURE_AD_CLIENT_ID · AZURE_AD_CLIENT_SECRET (pending)</p>
        </div>
        <p className="text-[11px] text-violet-500 mt-4">
          Add missing keys to .env.local (local) or Vercel Environment Variables (production) to activate integrations.
        </p>
      </div>
    </div>
  );
}
