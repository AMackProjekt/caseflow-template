"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import {
  Users,
  UserCheck,
  Home,
  FileText,
  ClipboardList,
  ScrollText,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const participants = (useQuery(api.functions.listParticipants) ?? []) as Doc<"participants">[];
  const caseNotes = useQuery(api.functions.listCaseNotes) ?? [];
  const documents = useQuery(api.functions.listDocuments) ?? [];
  const teamMembers = useQuery(api.functions.listTeamMembers) ?? [];
  const housingMatches = (useQuery(api.functions.listHousingMatches) ?? []) as Doc<"housingMatches">[];
  const auditLogs = (useQuery(api.functions.listAuditLogs) ?? []) as Doc<"auditLogs">[];
  const demographics = (useQuery(api.functions.listDemographics) ?? []) as Doc<"demographics">[];
  const requests = (useQuery(api.functions.listRequests) ?? []) as Doc<"requests">[];

  const totalClients = participants.length;
  const activeClients = participants.filter((p) => p.status === "active").length;
  const housed = housingMatches.filter((h) => h.status === "active").length;
  const pending = requests.filter((r) => r.status === "pending").length;

  // Demographics breakdown
  const genderBreakdown: Record<string, number> = {};
  const housingStatusBreakdown: Record<string, number> = {};
  for (const d of demographics) {
    if (d.gender) genderBreakdown[d.gender] = (genderBreakdown[d.gender] ?? 0) + 1;
    if (d.housingStatus) housingStatusBreakdown[d.housingStatus] = (housingStatusBreakdown[d.housingStatus] ?? 0) + 1;
  }

  const recentAudit = auditLogs.slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Champion Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Full-access supervisor view — Your Organization</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Clients" value={totalClients} icon={Users} color="bg-violet-100 text-violet-700" />
        <KpiCard label="Active Clients" value={activeClients} icon={UserCheck} color="bg-teal-100 text-teal-700" />
        <KpiCard label="Stably Housed" value={housed} icon={Home} color="bg-emerald-100 text-emerald-700" />
        <KpiCard label="Staff Members" value={teamMembers.length} icon={Users} color="bg-blue-100 text-blue-700" />
        <KpiCard label="Case Notes" value={caseNotes.length} icon={ClipboardList} color="bg-indigo-100 text-indigo-700" />
        <KpiCard label="Documents" value={documents.length} icon={FileText} color="bg-amber-100 text-amber-700" />
        <KpiCard label="Pending Requests" value={pending} icon={AlertCircle} color="bg-rose-100 text-rose-700" sub="Awaiting review" />
        <KpiCard label="Audit Events" value={auditLogs.length} icon={ScrollText} color="bg-slate-100 text-slate-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demographic summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-500" /> Demographics Snapshot
          </h2>
          {demographics.length === 0 ? (
            <p className="text-slate-400 text-sm">No demographic data yet.</p>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Gender</p>
                <div className="space-y-1">
                  {Object.entries(genderBreakdown).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-violet-500 h-2 rounded-full"
                          style={{ width: `${Math.round((v / demographics.length) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-20 shrink-0">{k} ({v})</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Housing Status</p>
                <div className="space-y-1">
                  {Object.entries(housingStatusBreakdown).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-teal-500 h-2 rounded-full"
                          style={{ width: `${Math.round((v / demographics.length) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-20 shrink-0">{k} ({v})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Housing matches */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-500" /> Housing Overview
          </h2>
          {housingMatches.length === 0 ? (
            <p className="text-slate-400 text-sm">No housing matches recorded.</p>
          ) : (
            <div className="space-y-2">
              {housingMatches.slice(0, 5).map((h) => (
                <div key={h._id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{h.clientName}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[160px]">{h.unitAddress}</p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      h.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : h.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent audit log */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-slate-500" /> Recent Audit Events
          </h2>
          {recentAudit.length === 0 ? (
            <p className="text-slate-400 text-sm">No audit events yet.</p>
          ) : (
            <div className="space-y-2">
              {recentAudit.map((log) => (
                <div key={log._id} className="flex flex-col gap-0.5 py-1.5 border-b border-slate-50 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 truncate">{log.actor}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pending requests */}
      {pending > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-rose-700">{pending} pending client request{pending !== 1 ? "s" : ""} awaiting review</p>
            <p className="text-xs text-rose-500">Visit the Caseload page to review and act.</p>
          </div>
        </div>
      )}
    </div>
  );
}
