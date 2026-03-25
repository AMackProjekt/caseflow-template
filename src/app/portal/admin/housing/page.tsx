"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Home, Plus, Save, Search } from "lucide-react";
import type { Id, Doc } from "../../../../../convex/_generated/dataModel";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  active: "bg-emerald-100 text-emerald-700",
  exited: "bg-slate-100 text-slate-500",
};

export default function HousingPage() {
  const matches = (useQuery(api.functions.listHousingMatches) ?? []) as Doc<"housingMatches">[];
  const participants = (useQuery(api.functions.listParticipants) ?? []) as Doc<"participants">[];
  const upsertMatch = useMutation(api.functions.upsertHousingMatch);
  const updateStatus = useMutation(api.functions.updateHousingMatchStatus);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "exited">("all");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    clientSlot: "",
    clientName: "",
    unitAddress: "",
    landlord: "",
    matchedDate: new Date().toISOString().slice(0, 10),
    status: "pending" as "pending" | "active" | "exited",
    notes: "",
  });

  const filtered = matches.filter((m) => {
    const matchSearch =
      m.clientName.toLowerCase().includes(search.toLowerCase()) ||
      m.unitAddress.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === "all" || m.status === filter;
    return matchSearch && matchStatus;
  });

  async function handleAdd() {
    if (!form.clientSlot || !form.clientName || !form.unitAddress) return;
    await upsertMatch({
      ...form,
      landlord: form.landlord || undefined,
      notes: form.notes || undefined,
    });
    setForm({ clientSlot: "", clientName: "", unitAddress: "", landlord: "", matchedDate: new Date().toISOString().slice(0, 10), status: "pending", notes: "" });
    setAdding(false);
  }

  const totals = {
    all: matches.length,
    pending: matches.filter((m) => m.status === "pending").length,
    active: matches.filter((m) => m.status === "active").length,
    exited: matches.filter((m) => m.status === "exited").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Home className="w-5 h-5 text-violet-500" /> Housing Matches
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Track client housing placements and unit statuses</p>
        </div>
        <button onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition">
          <Plus className="w-4 h-4" /> New Match
        </button>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3">
        {(["all", "pending", "active", "exited"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === s ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({totals[s]})
          </button>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">Client Slot</label>
            <select value={form.clientSlot}
              title="Client slot"
              onChange={(e) => {
                const p = participants.find((p) => p.slot === e.target.value);
                setForm((s) => ({ ...s, clientSlot: e.target.value, clientName: p?.name ?? "" }));
              }}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 w-36">
              <option value="">Select…</option>
              {participants.map((p) => <option key={p.slot} value={p.slot}>{p.slot} — {p.name}</option>)}
            </select>
          </div>
          {[
            { key: "unitAddress", label: "Unit Address", w: "w-52" },
            { key: "landlord", label: "Landlord", w: "w-36" },
            { key: "matchedDate", label: "Match Date", w: "w-36", type: "date" },
            { key: "notes", label: "Notes", w: "w-44" },
          ].map(({ key, label, w, type }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">{label}</label>
              <input type={type ?? "text"} value={(form as Record<string, string>)[key]}
                onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
                title={label} placeholder={label}
                className={`px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 ${w}`} />
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">Status</label>
            <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as typeof form.status }))}
              title="Housing match status"
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400">
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="exited">Exited</option>
            </select>
          </div>
          <button onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search client or address…"
          className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-400" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Client", "Slot", "Unit Address", "Landlord", "Match Date", "Status", "Notes", ""].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center text-slate-400 py-10 text-sm">No housing matches yet.</td></tr>
            ) : (
              filtered.map((m) => (
                <tr key={m._id} className="border-b border-slate-50 hover:bg-violet-50/20">
                  <td className="px-4 py-3 font-semibold text-slate-800">{m.clientName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{m.clientSlot}</td>
                  <td className="px-4 py-3 text-slate-600">{m.unitAddress}</td>
                  <td className="px-4 py-3 text-slate-500">{m.landlord ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{m.matchedDate}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[m.status]}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs max-w-[140px] truncate">{m.notes ?? "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      title="Update status"
                      value={m.status}
                      onChange={(e) => updateStatus({ id: m._id as Id<"housingMatches">, status: e.target.value as "pending" | "active" | "exited" })}
                      className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="exited">Exited</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
