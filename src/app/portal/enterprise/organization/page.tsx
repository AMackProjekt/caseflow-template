"use client";

import { useEffect, useState } from "react";
import { Building2, Palette, Save, RefreshCw, ShieldCheck, LayoutDashboard } from "lucide-react";
import type { EnterpriseSettings } from "@/lib/enterprise-settings";
import {
  fetchEnterpriseControlCenter,
  saveEnterpriseSettings,
  type EnterpriseControlCenterResponse,
} from "@/lib/enterprise-control-client";

export default function EnterpriseOrganizationPage() {
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
      setMessage("Failed to load organization and tenant settings.");
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
    try {
      await saveEnterpriseSettings(settings);
      setMessage("Organization policy saved.");
      await load();
    } catch {
      setMessage("Failed to save organization policy.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data || !settings) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading organization and tenant settings...</div>;
  }

  const organization = data.organization;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Organization and Tenant</h1>
          <p className="mt-1 text-sm text-slate-500">Tenant identity, branding defaults, retention policy, and portal behavior.</p>
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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Organization</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{organization.name}</p>
          <p className="text-sm text-slate-500">{organization.shortName} · {organization.programType}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Platform Brand</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{organization.productName}</p>
          <p className="text-sm text-slate-500">Domain: {organization.domain}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Support Email</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{organization.supportEmail}</p>
          <p className="text-sm text-slate-500">From: {organization.fromEmail}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><Palette className="h-4 w-4 text-cyan-600" /> Workspace Presentation</h2>
          <label className="block rounded-lg border border-slate-100 p-3">
            <p className="text-sm font-medium text-slate-800">Portal Theme</p>
            <select value={settings.portal_theme} onChange={(e) => setSettings({ ...settings, portal_theme: e.target.value as EnterpriseSettings["portal_theme"] })} className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {(["Dark Slate", "Light", "High Contrast"] as const).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="block rounded-lg border border-slate-100 p-3">
            <p className="text-sm font-medium text-slate-800">Records Per Page</p>
            <select value={settings.records_per_page} onChange={(e) => setSettings({ ...settings, records_per_page: e.target.value as EnterpriseSettings["records_per_page"] })} className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {(["10", "25", "50", "100"] as const).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 p-3">
            <div>
              <p className="text-sm font-medium text-slate-800 inline-flex items-center gap-2"><LayoutDashboard className="h-4 w-4 text-cyan-600" /> Show Onboarding</p>
              <p className="text-xs text-slate-500">Re-enable welcome and guided tour flows for new sessions.</p>
            </div>
            <input type="checkbox" checked={settings.show_onboarding} onChange={(e) => setSettings({ ...settings, show_onboarding: e.target.checked })} className="h-4 w-4" />
          </label>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><ShieldCheck className="h-4 w-4 text-cyan-600" /> Tenant Governance</h2>
          <label className="block rounded-lg border border-slate-100 p-3">
            <p className="text-sm font-medium text-slate-800">Data Retention</p>
            <select value={settings.data_retention_days} onChange={(e) => setSettings({ ...settings, data_retention_days: e.target.value as EnterpriseSettings["data_retention_days"] })} className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {(["90", "180", "365", "730", "Never"] as const).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            <p className="font-medium text-slate-800 inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-cyan-600" /> Environment-managed tenant identity</p>
            <p className="mt-2 text-xs text-slate-500">Brand name, domain, program type, support addresses, HMIS URL, and Google Site URL remain environment-backed so deployments stay tenant-isolated.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">HMIS Link</p>
              <p className="mt-2 text-sm font-medium text-slate-800">{organization.hmisConfigured ? "Configured" : "Missing"}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Google Site</p>
              <p className="mt-2 text-sm font-medium text-slate-800">{organization.googleSiteConfigured ? "Configured" : "Missing"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">{message || "Organization and tenant governance is online."}</div>
    </div>
  );
}
