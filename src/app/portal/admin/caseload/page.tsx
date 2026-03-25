"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Users, Search, UserCheck, ChevronDown } from "lucide-react";
import type { Doc } from "../../../../../convex/_generated/dataModel";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-500",
  pending: "bg-amber-100 text-amber-700",
  exited: "bg-rose-100 text-rose-600",
};

export default function AdminCaseloadPage() {
  const participants = (useQuery(api.functions.listParticipants) ?? []) as Doc<"participants">[];
  const demographics = (useQuery(api.functions.listDemographics) ?? []) as Doc<"demographics">[];
  const teamMembers = (useQuery(api.functions.listTeamMembers) ?? []) as Doc<"teamMembers">[];
  const requests = (useQuery(api.functions.listRequests) ?? []) as Doc<"requests">[];
  const updateRequestStatus = useMutation(api.functions.updateRequestStatus);
  const reassignCaseManager = useMutation(api.functions.reassignCaseManager);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigningSlot, setAssigningSlot] = useState<string | null>(null);
  const [newManager, setNewManager] = useState("");

  const demoBySLot = Object.fromEntries(demographics.map((d) => [d.slot, d]));
  const requestsByClient = requests.reduce<Record<string, typeof requests>>((acc, r) => {
    acc[r.client] = acc[r.client] ?? [];
    acc[r.client].push(r);
    return acc;
  }, {});

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slot.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleReassign(slot: string) {
    if (!newManager) return;
    await reassignCaseManager({ slot, caseManager: newManager });
    setAssigningSlot(null);
    setNewManager("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-500" /> Full Caseload
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          All {participants.length} clients — reassign case managers, review requests
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients…"
            className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 w-56"
          />
        </div>
        <select
          title="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
          <option value="exited">Exited</option>
        </select>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Slot", "Client Name", "Status", "Case Manager", "Environment", "Open Requests", ""].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-slate-400 py-10 text-sm">No clients found.</td></tr>
            ) : (
              filtered.map((p) => {
                const demo = demoBySLot[p.slot];
                const openReqs = (requestsByClient[p.name] ?? []).filter((r) => r.status === "pending").length;
                const isAssigning = assigningSlot === p.slot;
                return (
                  <tr key={p._id} className="border-b border-slate-50 hover:bg-violet-50/30">
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{p.slot}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status] ?? "bg-slate-100 text-slate-500"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {isAssigning ? (
                        <div className="flex items-center gap-2">
                          <select
                            title="Select case manager"
                            value={newManager}
                            onChange={(e) => setNewManager(e.target.value)}
                            className="text-xs border border-violet-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-400"
                          >
                            <option value="">Select…</option>
                            {teamMembers.map((m) => (
                              <option key={m._id} value={m.name}>{m.name}</option>
                            ))}
                          </select>
                          <button onClick={() => handleReassign(p.slot)}
                            className="text-xs bg-violet-600 text-white px-2 py-1 rounded hover:bg-violet-700 transition">
                            Save
                          </button>
                          <button onClick={() => { setAssigningSlot(null); setNewManager(""); }}
                            className="text-xs text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                      ) : (
                        <span>{demo?.caseManager ?? "—"}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{p.environment}</td>
                    <td className="px-4 py-3 text-center">
                      {openReqs > 0 ? (
                        <span className="bg-rose-100 text-rose-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">{openReqs}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setAssigningSlot(isAssigning ? null : p.slot); setNewManager(""); }}
                        className="text-xs text-violet-600 hover:text-violet-800 font-medium flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Reassign
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pending requests section */}
      {requests.filter((r) => r.status === "pending").length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Pending Client Requests</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Client", "Type", "Note", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.filter((r) => r.status === "pending").map((r) => (
                <tr key={r._id} className="border-b border-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{r.client}</td>
                  <td className="px-4 py-3 text-slate-600">{r.type}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{r.note}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{r.date}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button onClick={() => updateRequestStatus({ id: r._id, status: "approved" })}
                      className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-2 py-1 rounded transition">Approve</button>
                    <button onClick={() => updateRequestStatus({ id: r._id, status: "denied" })}
                      className="text-xs bg-rose-100 text-rose-600 hover:bg-rose-200 px-2 py-1 rounded transition">Deny</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
