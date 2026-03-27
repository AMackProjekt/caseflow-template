"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck, ScrollText, Clock3, ArrowRight, RefreshCw } from "lucide-react";
import { fetchEnterpriseControlCenter, type EnterpriseControlCenterResponse } from "@/lib/enterprise-control-client";

export default function EnterpriseAuditPage() {
  const [data, setData] = useState<EnterpriseControlCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      setData(await fetchEnterpriseControlCenter());
    } catch {
      setMessage("Failed to load governance status.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (loading || !data) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading audit and governance...</div>;
  }

  const checks = data.compliance.checks;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Audit and Governance</h1>
          <p className="mt-1 text-sm text-slate-500">Governance posture, compliance controls, and audit policy oversight.</p>
        </div>
        <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Compliance State</p><p className="mt-2 text-lg font-semibold text-slate-800">{data.compliance.overall}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Audit PHI Reads</p><p className="mt-2 text-lg font-semibold text-slate-800">{data.settings.audit_all_reads ? "Enabled" : "Disabled"}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Retention Policy</p><p className="mt-2 text-lg font-semibold text-slate-800">{data.organization.dataRetentionDays}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Secure Transport</p><p className="mt-2 text-lg font-semibold text-slate-800">{data.security.secure_transport ? "Enforced" : "At risk"}</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><ShieldCheck className="h-4 w-4 text-cyan-600" /> Governance Controls</h2>
          {Object.entries(checks).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <span className="text-sm text-slate-700">{key}</span>
              <span className={`text-xs font-semibold ${value ? "text-emerald-700" : "text-rose-700"}`}>{value ? "Pass" : "Attention"}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><ScrollText className="h-4 w-4 text-cyan-600" /> Audit Trail Access</h2>
          <p className="text-sm text-slate-600">The detailed event stream remains available in the managed Admin audit workspace. This enterprise page governs posture and policy while linking directly into the underlying operational trail.</p>
          <Link href="/portal/admin/audit" className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700">
            Open Admin Audit Stream <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyan-600" /> Governance policy is live now; detailed event inspection remains available through the operational audit console.</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">{message || "Audit and governance workspace is online."}</div>
    </div>
  );
}
