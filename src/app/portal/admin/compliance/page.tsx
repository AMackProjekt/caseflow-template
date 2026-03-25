"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldOff, RefreshCw, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { ComplianceStatus } from "@/app/api/admin/compliance/route";

function CheckRow({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      {ok ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
      )}
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {detail && <p className="text-xs text-slate-400 mt-0.5">{detail}</p>}
      </div>
      <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>
        {ok ? "Pass" : "Fail"}
      </span>
    </div>
  );
}

export default function AdminCompliancePage() {
  const [status, setStatus] = useState<ComplianceStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/compliance");
    if (r.ok) setStatus(await r.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const overall = status?.overall ?? "unknown";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-violet-500" /> Compliance Center
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">HIPAA, BAA, PHI workflow, and encryption posture</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Overall badge */}
      <div className={`rounded-xl p-5 flex items-center gap-4 border ${
        overall === "approved" ? "bg-emerald-50 border-emerald-200" :
        overall === "pending" ? "bg-amber-50 border-amber-200" :
        "bg-rose-50 border-rose-200"
      }`}>
        {overall === "approved" ? <ShieldCheck className="w-8 h-8 text-emerald-500" /> :
         overall === "pending" ? <ShieldAlert className="w-8 h-8 text-amber-500" /> :
         <ShieldOff className="w-8 h-8 text-rose-500" />}
        <div>
          <p className={`text-lg font-bold ${
            overall === "approved" ? "text-emerald-700" :
            overall === "pending" ? "text-amber-700" : "text-rose-700"
          }`}>
            Overall Status: {overall.charAt(0).toUpperCase() + overall.slice(1)}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">
            {overall === "approved"
              ? "All compliance checks pass. System is operating within HIPAA-safe parameters."
              : overall === "pending"
              ? "Some checks are pending or require attention. Review items below."
              : "Critical compliance issues detected. Immediate action required."}
          </p>
        </div>
      </div>

      {/* Checks */}
      {status ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">HIPAA Compliance Checks</h2>
          <CheckRow
            label="PHI Workflow Approved"
            ok={status.checks.phi_workflow_approved}
            detail="Protected Health Information access is governed by approved workflows."
          />
          <CheckRow
            label="Business Associate Agreement (BAA)"
            ok={status.checks.baa_confirmed}
            detail="A signed BAA with all relevant vendors must be on file."
          />
          <CheckRow
            label="Encryption Key Configured"
            ok={status.checks.encryption_key_configured}
            detail="AES-256 encryption keys are present and active for data at rest."
          />
          <CheckRow
            label="Auth Secret Configured"
            ok={status.checks.auth_secret_configured}
            detail="NEXTAUTH_SECRET / AUTH_SECRET must be set for session security."
          />
          <CheckRow
            label="Google OAuth Configured"
            ok={status.checks.google_oauth_configured}
            detail="AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET must be set."
          />
          <CheckRow
            label="KV Store Configured"
            ok={status.checks.kv_store_configured}
            detail="Vercel KV (Redis) is required for secure data caching."
          />
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
          Loading compliance status…
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
          Could not load compliance status.
        </div>
      )}

      {/* HIPAA reference */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Regulatory References</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span><strong>45 CFR §164.312</strong> — Technical safeguards: access controls, audit controls, integrity, transmission security.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span><strong>45 CFR §164.308</strong> — Administrative safeguards: security management, training, contingency planning.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span><strong>45 CFR §164.502</strong> — Uses and disclosures of PHI — minimum necessary standard.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span><strong>BAA Requirements</strong> — Business Associates must contractually agree to protect PHI per §164.504(e).</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
