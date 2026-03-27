"use client";

import { useEffect, useState } from "react";
import { Settings, Save, CheckCircle2, RefreshCw } from "lucide-react";
import type { EnterpriseSettings } from "@/lib/enterprise-settings";

interface SettingSection {
  title: string;
  items: SettingItem[];
}

interface SettingItem {
  key: keyof EnterpriseSettings;
  label: string;
  description: string;
  type: "toggle" | "text" | "select";
  defaultValue: EnterpriseSettings[keyof EnterpriseSettings];
  options?: string[];
}

const SECTIONS: SettingSection[] = [
  {
    title: "Security",
    items: [
      { key: "enforce_2fa", label: "Enforce 2FA for all users", description: "Require OTP verification for every login session.", type: "toggle", defaultValue: true },
      { key: "session_timeout_hours", label: "Session Timeout (hours)", description: "Automatically sign out users after inactivity.", type: "select", defaultValue: "8", options: ["1", "4", "8", "12", "24"] },
      { key: "audit_all_reads", label: "Audit PHI reads", description: "Log every time a protected record is viewed.", type: "toggle", defaultValue: true },
    ],
  },
  {
    title: "Notifications",
    items: [
      { key: "notify_new_client", label: "Notify on new client intake", description: "Send Google Chat message when a new client is added.", type: "toggle", defaultValue: true },
      { key: "notify_request", label: "Notify on client request", description: "Send Google Chat alert when a client submits a new request.", type: "toggle", defaultValue: false },
      { key: "admin_email", label: "Admin notification email", description: "Where compliance alerts and critical notices are sent.", type: "text", defaultValue: "admin@sdtoolsinc.org" },
    ],
  },
  {
    title: "Portal Behavior",
    items: [
      { key: "show_onboarding", label: "Re-enable onboarding tour", description: "Reset the onboarding flag to show the welcome tour to all new sessions.", type: "toggle", defaultValue: false },
      { key: "portal_theme", label: "Default portal theme", description: "Set the default color theme for staff and client portals.", type: "select", defaultValue: "Dark Slate", options: ["Dark Slate", "Light", "High Contrast"] },
      { key: "records_per_page", label: "Records per page", description: "Default number of rows shown in tables.", type: "select", defaultValue: "25", options: ["10", "25", "50", "100"] },
    ],
  },
  {
    title: "Compliance",
    items: [
      { key: "phi_workflow_approved", label: "PHI Workflow Approved", description: "Mark PHI access workflow as reviewed and approved by admin.", type: "toggle", defaultValue: false },
      { key: "baa_confirmed", label: "BAA Confirmed", description: "Confirm that a Business Associate Agreement is signed with all vendors.", type: "toggle", defaultValue: false },
      { key: "data_retention_days", label: "Data Retention Period (days)", description: "How long to keep audit logs before automatic purge.", type: "select", defaultValue: "365", options: ["90", "180", "365", "730", "Never"] },
    ],
  },
];

export default function SettingsPage() {
  const [values, setValues] = useState<EnterpriseSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/enterprise/control-center", { cache: "no-store" });
    if (!res.ok) {
      setLoading(false);
      setError("Could not load settings.");
      return;
    }
    const data = (await res.json()) as { settings: EnterpriseSettings };
    setValues(data.settings);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function toggle(key: keyof EnterpriseSettings) {
    setValues((v) => (v ? { ...v, [key]: !v[key] } : v));
  }

  function set(key: keyof EnterpriseSettings, val: string) {
    setValues((v) => (v ? { ...v, [key]: val } : v));
  }

  async function save() {
    if (!values) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/enterprise/control-center", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Failed to save settings.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading || !values) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-violet-500" /> Admin Settings
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Portal-wide configuration — supervisor access only</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void load()}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => void save()} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {SECTIONS.map((section) => (
        <div key={section.title} className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">{section.title}</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {section.items.map((item) => (
              <div key={item.key} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                </div>
                {item.type === "toggle" && (
                  <button
                    onClick={() => toggle(item.key)}
                    title={item.label}
                    className={`w-10 h-[22px] rounded-full transition-colors relative shrink-0 ${
                      values[item.key] ? "bg-violet-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${
                        values[item.key] ? "translate-x-[18px]" : ""
                      }`}
                    />
                  </button>
                )}
                {item.type === "select" && (
                  <select
                    title={item.label}
                    value={String(values[item.key])}
                    onChange={(e) => set(item.key, e.target.value)}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 shrink-0"
                  >
                    {item.options?.map((o) => <option key={o}>{o}</option>)}
                  </select>
                )}
                {item.type === "text" && (
                  <input
                    title={item.label}
                    placeholder={item.label}
                    value={String(values[item.key])}
                    onChange={(e) => set(item.key, e.target.value)}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 w-56 shrink-0"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-[11px] text-slate-400">
        Note: Settings marked as compliance-related require re-deployment or Convex function updates to take effect server-side. Contact your system administrator for infrastructure-level changes.
      </p>
    </div>
  );
}
