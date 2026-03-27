"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Server,
  Plug,
  Save,
  RefreshCw,
  Database,
  Mail,
  CheckCircle2,
  XCircle,
  Rocket,
  Download,
  Building2,
  Users,
  UserCog,
  Briefcase,
  Activity,
} from "lucide-react";
import type { EnterpriseSettings } from "@/lib/enterprise-settings";
import {
  fetchEnterpriseControlCenter,
  saveEnterpriseSettings,
  type EnterpriseControlCenterResponse,
} from "@/lib/enterprise-control-client";

const SETTINGS_SECTIONS: Array<{
  title: string;
  fields: Array<{
    key: keyof EnterpriseSettings;
    label: string;
    type: "toggle" | "select" | "text";
    options?: string[];
  }>;
}> = [
  {
    title: "Security Controls",
    fields: [
      { key: "enforce_2fa", label: "Enforce 2FA", type: "toggle" },
      {
        key: "session_timeout_hours",
        label: "Session Timeout (hours)",
        type: "select",
        options: ["1", "4", "8", "12", "24"],
      },
      { key: "audit_all_reads", label: "Audit PHI Reads", type: "toggle" },
    ],
  },
  {
    title: "Operational Controls",
    fields: [
      { key: "notify_new_client", label: "Notify on New Client", type: "toggle" },
      { key: "notify_request", label: "Notify on Client Request", type: "toggle" },
      { key: "admin_email", label: "Admin Alert Email", type: "text" },
    ],
  },
  {
    title: "Compliance Flags",
    fields: [
      { key: "phi_workflow_approved", label: "PHI Workflow Approved", type: "toggle" },
      { key: "baa_confirmed", label: "BAA Confirmed", type: "toggle" },
      {
        key: "data_retention_days",
        label: "Data Retention",
        type: "select",
        options: ["90", "180", "365", "730", "Never"],
      },
    ],
  },
];

function StatusPill({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
      <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
      <XCircle className="w-3.5 h-3.5" /> Attention
    </span>
  );
}

export default function EnterpriseControlPlane() {
  const [data, setData] = useState<EnterpriseControlCenterResponse | null>(null);
  const [settings, setSettings] = useState<EnterpriseSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function load() {
    setLoading(true);
    setMsg("");
    try {
      const payload = await fetchEnterpriseControlCenter();
      setData(payload);
      setSettings(payload.settings);
    } catch {
      setLoading(false);
      setMsg("Failed to load enterprise control center.");
      return;
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const health = useMemo(() => {
    if (!data) return [] as Array<{ label: string; ok: boolean }>;
    return [
      { label: "Data Encryption", ok: data.security.data_encrypted },
      { label: "Authentication", ok: data.security.auth_configured },
      { label: "Secure Transport", ok: data.security.secure_transport },
      { label: "Resend", ok: data.integrations.resend },
      { label: "Google OAuth", ok: data.integrations.googleOAuth },
      { label: "Convex", ok: data.integrations.convex },
      { label: "Blob Storage", ok: data.integrations.blob },
    ];
  }, [data]);

  function updateSetting<K extends keyof EnterpriseSettings>(key: K, value: EnterpriseSettings[K]) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  async function saveSettings() {
    if (!settings) return;
    setSaving(true);
    setMsg("");
    try {
      await saveEnterpriseSettings(settings);
    } catch {
      setSaving(false);
      setMsg("Failed to save enterprise settings.");
      return;
    }
    setSaving(false);
    setMsg("Enterprise settings saved.");
    await load();
  }

  async function runAction(path: string, method: "GET" | "POST", successMessage: string) {
    setMsg("");
    const res = await fetch(path, { method });
    if (!res.ok) {
      setMsg(`Action failed: ${path}`);
      return;
    }

    if (path === "/api/admin/export-caseload" && method === "GET") {
      const payload = await res.json();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `caseload-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }

    setMsg(successMessage);
    await load();
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
        Loading Enterprise Control Center...
      </div>
    );
  }

  if (!data || !settings) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-sm text-rose-700">
        Unable to load enterprise controls.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Enterprise Workspace Control Plane</h1>
          <p className="text-slate-500 text-sm mt-1">
            Parent-level governance and operations across Admin, Staff, and Client portals
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-700 inline-flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-violet-600" /> Managed Workspaces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/portal/admin" className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
            <p className="text-sm font-semibold text-slate-700 inline-flex items-center gap-2"><UserCog className="w-4 h-4" /> Admin Portal</p>
            <p className="text-xs text-slate-500 mt-1">Program configuration, operations, analytics</p>
          </Link>
          <Link href="/portal/staff" className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
            <p className="text-sm font-semibold text-slate-700 inline-flex items-center gap-2"><Briefcase className="w-4 h-4" /> Staff Portal</p>
            <p className="text-xs text-slate-500 mt-1">Caseload workflows, service delivery, compliance tasks</p>
          </Link>
          <Link href="/portal/client" className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
            <p className="text-sm font-semibold text-slate-700 inline-flex items-center gap-2"><Users className="w-4 h-4" /> Client Portal</p>
            <p className="text-xs text-slate-500 mt-1">Participant-facing goals, requests, and support features</p>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-4">
          <Link href="/portal/enterprise/identity" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Identity & Access</Link>
          <Link href="/portal/enterprise/organization" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Organization & Tenant</Link>
          <Link href="/portal/enterprise/integrations" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Integrations</Link>
          <Link href="/portal/enterprise/audit" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Audit & Governance</Link>
          <Link href="/portal/enterprise/operations" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Platform Operations</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-slate-700">Compliance</h2>
          </div>
          <p className="text-sm text-slate-500 mb-2">Overall: {data.compliance.overall}</p>
          <div className="space-y-2">
            {Object.entries(data.compliance.checks).map(([label, ok]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{label}</span>
                <StatusPill ok={ok} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-slate-700">System Health</h2>
          </div>
          <div className="space-y-2">
            {health.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{item.label}</span>
                <StatusPill ok={item.ok} />
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Environment: {data.environment.nodeEnv}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="w-4 h-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-slate-700">Operations</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => void runAction("/api/admin/seed-staff", "POST", "Staff reseeded successfully.")}
              className="text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm"
            >
              Reseed Staff Roster
            </button>
            <button
              type="button"
              onClick={() => void runAction("/api/admin/seed-caseload", "POST", "Caseload reseeded successfully.")}
              className="text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm"
            >
              Reseed Caseload
            </button>
            <button
              type="button"
              onClick={() => void runAction("/api/admin/export-caseload", "GET", "Caseload export downloaded.")}
              className="text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Caseload Snapshot
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 inline-flex items-center gap-2">
            <Plug className="w-4 h-4 text-violet-600" /> Enterprise Configuration
          </h2>
          <button
            type="button"
            onClick={() => void saveSettings()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700 disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.title} className="border border-slate-100 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {section.title}
            </div>
            <div className="divide-y divide-slate-100">
              {section.fields.map((field) => (
                <div key={field.key} className="px-4 py-3 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-700">{field.label}</span>

                  {field.type === "toggle" && (
                    <button
                      type="button"
                      aria-label={field.label}
                      onClick={() => updateSetting(field.key, !Boolean(settings[field.key]) as EnterpriseSettings[typeof field.key])}
                      className={`w-10 h-5 rounded-full relative transition ${
                        settings[field.key] ? "bg-violet-600" : "bg-slate-300"
                      }`}
                      title={field.label}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition-transform ${
                          settings[field.key] ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  )}

                  {field.type === "text" && (
                    <input
                      aria-label={field.label}
                      placeholder={field.label}
                      value={String(settings[field.key])}
                      onChange={(e) => updateSetting(field.key, e.target.value as EnterpriseSettings[typeof field.key])}
                      className="w-64 px-3 py-1.5 text-sm rounded-md border border-slate-200"
                    />
                  )}

                  {field.type === "select" && (
                    <select
                      aria-label={field.label}
                      value={String(settings[field.key])}
                      onChange={(e) => updateSetting(field.key, e.target.value as EnterpriseSettings[typeof field.key])}
                      className="px-3 py-1.5 text-sm rounded-md border border-slate-200"
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-700 inline-flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-violet-600" /> Integrations Snapshot
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.entries(data.integrations).map(([k, v]) => (
            <div key={k} className="px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">{k}</span>
              <StatusPill ok={v} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 flex items-center gap-2">
        <Activity className="w-4 h-4" />
        <Mail className="w-4 h-4" />
        {msg || "Enterprise workspace control plane is online."}
      </div>
    </div>
  );
}
