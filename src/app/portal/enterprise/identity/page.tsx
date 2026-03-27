"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Users, KeyRound, Save, RefreshCw, Clock3, BadgeCheck } from "lucide-react";
import type { EnterpriseSettings } from "@/lib/enterprise-settings";
import {
  fetchEnterpriseControlCenter,
  saveEnterpriseSettings,
  type EnterpriseControlCenterResponse,
} from "@/lib/enterprise-control-client";

export default function EnterpriseIdentityPage() {
  const [data, setData] = useState<EnterpriseControlCenterResponse | null>(null);
  const [settings, setSettings] = useState<EnterpriseSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      const payload = await fetchEnterpriseControlCenter();
      setData(payload);
      setSettings(payload.settings);
    } catch {
      setMessage("Failed to load identity and access settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    try {
      await saveEnterpriseSettings(settings);
      setMessage("Identity and access policy saved.");
      await load();
    } catch {
      setMessage("Failed to save identity and access policy.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data || !settings) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading identity and access...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Identity and Access</h1>
          <p className="mt-1 text-sm text-slate-500">Workspace identity posture, allowlists, and session policy.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button type="button" onClick={() => void save()} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Workspace Domain</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{data.identityAccess.workspaceDomain}</p>
          <p className="mt-1 text-xs text-slate-500">Configured: {data.identityAccess.workspaceDomainConfigured ? "Yes" : "No"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin Allowlist</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{data.identityAccess.adminAllowlistCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Staff Allowlist</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{data.identityAccess.staffAllowlistCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Client Allowlist</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{data.identityAccess.clientAllowlistCount}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><ShieldCheck className="h-4 w-4 text-cyan-600" /> Access Controls</h2>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Enforce 2FA</p>
              <p className="text-xs text-slate-500">Require second-factor verification for enterprise and admin sessions.</p>
            </div>
            <input type="checkbox" checked={settings.enforce_2fa} onChange={(e) => setSettings({ ...settings, enforce_2fa: e.target.checked })} className="h-4 w-4" />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800">Audit PHI Reads</p>
              <p className="text-xs text-slate-500">Record every protected-record read for governance review.</p>
            </div>
            <input type="checkbox" checked={settings.audit_all_reads} onChange={(e) => setSettings({ ...settings, audit_all_reads: e.target.checked })} className="h-4 w-4" />
          </label>
          <label className="block rounded-lg border border-slate-100 p-3">
            <p className="text-sm font-medium text-slate-800 inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyan-600" /> Session Timeout</p>
            <p className="mt-1 text-xs text-slate-500">Maximum idle session duration for governed workspace users.</p>
            <select
              value={settings.session_timeout_hours}
              onChange={(e) => setSettings({ ...settings, session_timeout_hours: e.target.value as EnterpriseSettings["session_timeout_hours"] })}
              className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {(["1", "4", "8", "12", "24"] as const).map((value) => (
                <option key={value} value={value}>{value} hours</option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><KeyRound className="h-4 w-4 text-cyan-600" /> Identity Posture</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">2FA Secret</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{data.identityAccess.hasTwoFactorSecret ? "Configured" : "Missing"}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Current Session Policy</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{data.identityAccess.enforce2fa ? "Strict" : "Relaxed"}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Admin Accounts</p>
              <p className="mt-2 text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-600" /> {data.identityAccess.adminAllowlistCount} trusted admins</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Workspace Users</p>
              <p className="mt-2 text-sm font-semibold text-slate-800 inline-flex items-center gap-2"><Users className="h-4 w-4 text-cyan-600" /> {data.identityAccess.staffAllowlistCount + data.identityAccess.clientAllowlistCount} scoped identities</p>
            </div>
          </div>
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Allowlist membership remains environment-managed. This page governs policy enforcement and gives you visibility into workspace identity scope.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">{message || "Identity and access governance is online."}</div>
    </div>
  );
}
