"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { BarChart3, Search, Download } from "lucide-react";
import type { Doc } from "../../../../../convex/_generated/dataModel";

function Bar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-32 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-10 text-right">{value} ({pct}%)</span>
    </div>
  );
}

function Section({ title, data, color }: { title: string; data: Record<string, number>; color: string }) {
  const total = Object.values(data).reduce((s, v) => s + v, 0);
  if (total === 0) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      <div className="space-y-2.5">
        {Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .map(([k, v]) => <Bar key={k} label={k} value={v} total={total} color={color} />)}
      </div>
    </div>
  );
}

export default function DemographicsPage() {
  const demographics = (useQuery(api.functions.listDemographics) ?? []) as Doc<"demographics">[];
  const participants = (useQuery(api.functions.listParticipants) ?? []) as Doc<"participants">[];
  const [search, setSearch] = useState("");

  // Aggregate breakdowns
  function agg(field: keyof typeof demographics[0]) {
    const out: Record<string, number> = {};
    for (const d of demographics) {
      const val = (d[field] as string | undefined) ?? "Unknown";
      out[val] = (out[val] ?? 0) + 1;
    }
    return out;
  }

  const filtered = demographics.filter((d) => {
    const name = `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim().toLowerCase();
    return name.includes(search.toLowerCase()) || d.slot.toLowerCase().includes(search.toLowerCase());
  });

  const slotMap = Object.fromEntries(participants.map((p) => [p.slot, p.name]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-violet-500" /> Demographics
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Aggregate data for {demographics.length} enrolled clients
        </p>
      </div>

      {/* Summary charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Section title="Gender" data={agg("gender")} color="bg-violet-500" />
        <Section title="Race / Ethnicity" data={agg("race")} color="bg-teal-500" />
        <Section title="Housing Status" data={agg("housingStatus")} color="bg-emerald-500" />
        <Section title="Employment Status" data={agg("employmentStatus")} color="bg-amber-500" />
        <Section title="Education Level" data={agg("educationLevel")} color="bg-blue-500" />
        <Section title="Veteran Status" data={agg("veteranStatus")} color="bg-indigo-500" />
        <Section title="Preferred Language" data={agg("preferredLanguage")} color="bg-rose-500" />
        <Section title="Insurance Type" data={agg("insuranceType")} color="bg-slate-500" />
        <Section title="Marital Status" data={agg("maritalStatus")} color="bg-pink-500" />
      </div>

      {/* Full table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or slot…"
              className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <span className="text-xs text-slate-400 ml-auto">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Slot", "Name", "DOB", "Gender", "Race", "Housing", "Employment", "Case Manager", "Intake Date"].map((h) => (
                  <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-slate-400 py-10 text-sm">No demographic records found.</td></tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d._id} className="border-b border-slate-50 hover:bg-violet-50/20">
                    <td className="px-3 py-2.5 font-mono text-xs text-slate-400">{d.slot}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">
                      {d.firstName ?? ""} {d.lastName ?? slotMap[d.slot] ?? ""}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 text-xs">{d.dob}</td>
                    <td className="px-3 py-2.5 text-slate-600">{d.gender}</td>
                    <td className="px-3 py-2.5 text-slate-500">{d.race ?? "—"}</td>
                    <td className="px-3 py-2.5 text-slate-500">{d.housingStatus ?? "—"}</td>
                    <td className="px-3 py-2.5 text-slate-500">{d.employmentStatus ?? "—"}</td>
                    <td className="px-3 py-2.5 text-slate-600">{d.caseManager}</td>
                    <td className="px-3 py-2.5 text-slate-400 text-xs">{d.intakeDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
