"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { ScrollText, Search } from "lucide-react";
import type { Doc } from "../../../../../convex/_generated/dataModel";

const ACTION_COLOR: Record<string, string> = {
  login: "bg-blue-100 text-blue-700",
  logout: "bg-slate-100 text-slate-600",
  create: "bg-emerald-100 text-emerald-700",
  update: "bg-amber-100 text-amber-700",
  delete: "bg-rose-100 text-rose-700",
  view: "bg-violet-100 text-violet-700",
  upload: "bg-teal-100 text-teal-700",
  export: "bg-indigo-100 text-indigo-700",
};

function actionColor(action: string) {
  const key = Object.keys(ACTION_COLOR).find((k) => action.toLowerCase().startsWith(k));
  return key ? ACTION_COLOR[key] : "bg-slate-100 text-slate-600";
}

export default function AuditLogPage() {
  const auditLogs = (useQuery(api.functions.listAuditLogs) ?? []) as Doc<"auditLogs">[];
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const roles = (Array.from(new Set(auditLogs.map((l) => l.actorRole))) as string[]).sort();

  const filtered = auditLogs.filter((l) => {
    const matchSearch =
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.target ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || l.actorRole === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-violet-500" /> Audit Log
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Complete immutable record of all system actions — {auditLogs.length} events
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actor, action, target…"
            className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 w-64"
          />
        </div>
        <select
          title="Filter by role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="all">All Roles</option>
          {roles.map((r) => <option key={r}>{r}</option>)}
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} event{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        {auditLogs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <ScrollText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No audit events recorded yet.</p>
            <p className="text-xs mt-1 text-slate-300">Events are logged as staff and clients perform actions in the portal.</p>
          </div>
        ) : (
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Timestamp", "Actor", "Role", "Action", "Target", "Detail", "IP"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log._id} className="border-b border-slate-50 hover:bg-violet-50/20">
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: "short", day: "numeric",
                      hour: "2-digit", minute: "2-digit", second: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-800 font-medium max-w-[180px] truncate">{log.actor}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">{log.actorRole}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${actionColor(log.action)}`}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-[140px] truncate">{log.target ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs max-w-[180px] truncate">{log.detail ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{log.ip ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
