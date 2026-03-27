"use client";

import { useEffect, useState } from "react";
import { Database, Download, RefreshCw, Rocket, Users, Mail } from "lucide-react";
import { fetchEnterpriseControlCenter, type EnterpriseControlCenterResponse } from "@/lib/enterprise-control-client";

export default function EnterpriseOperationsPage() {
  const [data, setData] = useState<EnterpriseControlCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      setData(await fetchEnterpriseControlCenter());
    } catch {
      setMessage("Failed to load platform operations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function runAction(key: string, path: string, method: "GET" | "POST", successMessage: string) {
    setBusy(key);
    setMessage("");
    try {
      const res = await fetch(path, { method });
      if (!res.ok) throw new Error();

      if (path === "/api/admin/export-caseload") {
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

      setMessage(successMessage);
      await load();
    } catch {
      setMessage("Operation failed.");
    } finally {
      setBusy(null);
    }
  }

  if (loading || !data) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading platform operations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Platform Operations</h1>
          <p className="mt-1 text-sm text-slate-500">Operational jobs, exports, seed routines, and environment readiness.</p>
        </div>
        <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Reseed Staff</p><p className="mt-2 text-sm font-semibold text-slate-800">{data.platformOperations.canReseedStaff ? "Ready" : "Unavailable"}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Reseed Caseload</p><p className="mt-2 text-sm font-semibold text-slate-800">{data.platformOperations.canReseedCaseload ? "Ready" : "Unavailable"}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Export Snapshot</p><p className="mt-2 text-sm font-semibold text-slate-800">{data.platformOperations.canExportCaseload ? "Ready" : "Unavailable"}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Setup Token</p><p className="mt-2 text-sm font-semibold text-slate-800">{data.platformOperations.hasSetupToken ? "Present" : "Missing"}</p></div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <button type="button" onClick={() => void runAction("seed-staff", "/api/admin/seed-staff", "POST", "Staff roster reseeded.")} disabled={busy !== null || !data.platformOperations.canReseedStaff} className="rounded-xl border border-slate-200 bg-white p-5 text-left hover:bg-slate-50 disabled:opacity-60">
          <Users className="h-5 w-5 text-cyan-600" />
          <p className="mt-3 text-sm font-semibold text-slate-800">Reseed Staff Directory</p>
          <p className="mt-1 text-xs text-slate-500">Rebuild the team member dataset from the controlled enterprise seed source.</p>
        </button>
        <button type="button" onClick={() => void runAction("seed-caseload", "/api/admin/seed-caseload", "POST", "Caseload reseeded.")} disabled={busy !== null || !data.platformOperations.canReseedCaseload} className="rounded-xl border border-slate-200 bg-white p-5 text-left hover:bg-slate-50 disabled:opacity-60">
          <Database className="h-5 w-5 text-cyan-600" />
          <p className="mt-3 text-sm font-semibold text-slate-800">Reseed Caseload</p>
          <p className="mt-1 text-xs text-slate-500">Restore the governed participant baseline dataset into Convex.</p>
        </button>
        <button type="button" onClick={() => void runAction("export", "/api/admin/export-caseload", "GET", "Caseload export generated.")} disabled={busy !== null || !data.platformOperations.canExportCaseload} className="rounded-xl border border-slate-200 bg-white p-5 text-left hover:bg-slate-50 disabled:opacity-60">
          <Download className="h-5 w-5 text-cyan-600" />
          <p className="mt-3 text-sm font-semibold text-slate-800">Export Caseload Snapshot</p>
          <p className="mt-1 text-xs text-slate-500">Produce a current governed export across participants, notes, documents, and housing state.</p>
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-700 inline-flex items-center gap-2"><Rocket className="h-4 w-4 text-cyan-600" /> Operations Guidance</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">Platform operations here orchestrate lower-level admin APIs but are governed from the Enterprise workspace.</div>
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 inline-flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-600" /> Email delivery readiness: {data.platformOperations.canTestEmail ? "Available" : "Unavailable"}</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">{message || "Platform operations workspace is online."}</div>
    </div>
  );
}
