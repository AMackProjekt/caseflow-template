"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Lock,
  KeyRound,
  Database,
  UserCheck,
  FileCheck2,
  Cloud,
} from "lucide-react";
import type { ComplianceStatus } from "@/app/api/admin/compliance/route";

const CHECK_META: Record<
  keyof ComplianceStatus["checks"],
  { label: string; description: string; icon: React.ElementType }
> = {
  phi_workflow_approved: {
    label: "PHI Workflow Approved",
    description: "PHI_WORKFLOW_APPROVED env var confirms the PHI data handling process has been reviewed and approved.",
    icon: FileCheck2,
  },
  baa_confirmed: {
    label: "BAA Confirmed",
    description: "BAA_CONFIRMED env var confirms a Business Associate Agreement is in place for HIPAA compliance.",
    icon: UserCheck,
  },
  encryption_key_configured: {
    label: "Encryption Key",
    description: "DATA_ENCRYPTION_KEY is set — participant data is encrypted at rest before storage.",
    icon: KeyRound,
  },
  auth_secret_configured: {
    label: "Auth Secret",
    description: "AUTH_SECRET is set — session tokens are signed and tamper-proof.",
    icon: Lock,
  },
  google_oauth_configured: {
    label: "Google OAuth",
    description: "AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET are configured for identity verification.",
    icon: UserCheck,
  },
  kv_store_configured: {
    label: "KV Store",
    description: "KV_REST_API_URL and KV_REST_API_TOKEN are set — durable encrypted storage is active.",
    icon: Database,
  },
};

export default function CompliancePage() {
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch("/api/admin/compliance")
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<ComplianceStatus>;
      })
      .then((data) => {
        setCompliance(data);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const overallConfig = compliance
    ? compliance.overall === "approved"
      ? { icon: ShieldCheck, label: "Approved", color: "text-teal-400", bg: "bg-teal-500/15", border: "border-teal-500/30", ring: "ring-teal-500/10" }
      : compliance.overall === "pending"
      ? { icon: ShieldAlert, label: "Pending", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", ring: "ring-amber-500/10" }
      : { icon: ShieldOff, label: "Not Configured", color: "text-rose-400", bg: "bg-rose-500/15", border: "border-rose-500/30", ring: "ring-rose-500/10" }
    : null;

  const passCount = compliance
    ? Object.values(compliance.checks).filter(Boolean).length
    : 0;
  const totalCount = 6;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Compliance Status</h1>
          <p className="text-slate-500 mt-1">System-level security and regulatory configuration review.</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-6 py-4 text-sm font-medium">
          Failed to load compliance data (HTTP {error}). You may not have permission or the API is unavailable.
        </div>
      )}

      {/* Overall Status Banner */}
      {compliance && overallConfig && (
        <div className={`flex items-center gap-5 p-6 rounded-2xl border ${overallConfig.bg} ${overallConfig.border} ring-4 ${overallConfig.ring}`}>
          <div className={`p-3 rounded-xl ${overallConfig.bg}`}>
            <overallConfig.icon className={`w-8 h-8 ${overallConfig.color}`} />
          </div>
          <div className="flex-1">
            <p className={`text-lg font-bold ${overallConfig.color}`}>
              Compliance: {overallConfig.label}
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              {passCount} of {totalCount} checks passing &nbsp;·&nbsp; Last evaluated{" "}
              {new Date(compliance.evaluated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className={`text-3xl font-black ${overallConfig.color}`}>
            {passCount}/{totalCount}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !compliance && (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Individual Checks */}
      {compliance && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Configuration Checks</h2>
          {(Object.entries(compliance.checks) as [keyof ComplianceStatus["checks"], boolean][]).map(
            ([key, passing]) => {
              const meta = CHECK_META[key];
              const Icon = meta.icon;
              return (
                <div
                  key={key}
                  className={`flex items-center gap-4 p-5 rounded-2xl border bg-white transition ${
                    passing ? "border-slate-200" : "border-rose-200 bg-rose-50/30"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${passing ? "bg-teal-50 text-teal-600" : "bg-rose-50 text-rose-500"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-charcoal-900 text-sm">{meta.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{meta.description}</p>
                  </div>
                  {passing ? (
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </div>
              );
            }
          )}
        </div>
      )}

      {/* KV Store note */}
      {compliance && !compliance.checks.kv_store_configured && (
        <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-sm">
          <Cloud className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800">Using in-memory adapter</p>
            <p className="text-amber-700 mt-0.5">
              KV store is not configured. Participant data will not persist across server restarts.
              Set <code className="font-mono bg-amber-100 px-1 rounded">KV_REST_API_URL</code> and{" "}
              <code className="font-mono bg-amber-100 px-1 rounded">KV_REST_API_TOKEN</code> in your Vercel environment variables.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
