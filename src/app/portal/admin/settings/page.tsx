"use client";

import { useState } from "react";
import { Settings, Save, CheckCircle2, Eye, EyeOff } from "lucide-react";

interface SettingSection {
  title: string;
  items: SettingItem[];
}

interface SettingItem {
  key: string;
  label: string;
  description: string;
  type: "toggle" | "text" | "select";
  defaultValue: string | boolean;
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
      { key: "admin_email", label: "Admin notification email", description: "Where compliance alerts and critical notices are sent.", type: "text", defaultValue: "admin@yourorg.org" },
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
  const [values, setValues] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(
      SECTIONS.flatMap((s) => s.items.map((i) => [i.key, i.defaultValue]))
    )
  );
  const [saved, setSaved] = useState(false);

  function toggle(key: string) {
    setValues((v) => ({ ...v, [key]: !v[key] }));
  }

  function set(key: string, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function save() {
    // In production this would persist to Convex / env; here we just acknowledge
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
        <button onClick={save}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

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
                    className={`w-10 h-5.5 rounded-full transition-colors relative shrink-0 ${
                      values[item.key] ? "bg-violet-600" : "bg-slate-200"
                    }`}
                    style={{ height: "22px", width: "40px" }}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
                        values[item.key] ? "translate-x-[18px]" : ""
                      }`}
                      style={{ width: "18px", height: "18px" }}
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
