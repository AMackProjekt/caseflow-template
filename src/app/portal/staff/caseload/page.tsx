"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { AlertCircle, Search, Filter, MoreHorizontal, Plus, User, Zap } from "lucide-react";
import { useStaff } from "@/context/StaffContext";

const INSPIRATIONAL_QUOTES = [
  "We do this work because every stable day can become a turning point.",
  "Dignity grows when care is consistent, not occasional.",
  "Case management is hope made practical.",
  "Progress is built one follow-up, one note, one person at a time.",
  "When we stay present, people regain belief in what is possible.",
  "Structure and empathy together can change outcomes.",
];

export default function StaffDashboard() {
  const { participants, updateParticipantStatus } = useStaff();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [quoteIndex, setQuoteIndex] = useState(0);

  function cycleStatus(current: string): string {
    if (current.includes("Active")) return "Broken Platform";
    if (current === "Broken Platform") return "Empty";
    return "Active";
  }

  const metrics = useMemo(() => ({
    capacity: participants.length,
    active: participants.filter(c => c.status.includes("Active")).length,
    empty: participants.filter(c => c.status === "Empty").length,
    broken: participants.filter(c => c.status === "Broken Platform").length,
  }), [participants]);

  const statusBreakdown = useMemo(() => {
    const total = Math.max(1, participants.length);
    return [
      { label: "Active", count: metrics.active, color: "bg-teal-400", pct: Math.round((metrics.active / total) * 100) },
      { label: "Broken", count: metrics.broken, color: "bg-rose-400", pct: Math.round((metrics.broken / total) * 100) },
      { label: "Empty", count: metrics.empty, color: "bg-gray-400", pct: Math.round((metrics.empty / total) * 100) },
    ];
  }, [metrics, participants.length]);

  useEffect(() => {
    if (INSPIRATIONAL_QUOTES.length <= 1) return;
    const id = setInterval(() => {
      setQuoteIndex((current) => (current + 1) % INSPIRATIONAL_QUOTES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const filteredCaseload = useMemo(() => {
    return participants.filter((entry: any) => {
      if (activeFilter !== "All" && activeFilter !== entry.environment) return false;
      if (searchQuery.trim() === "") return true;
      const term = searchQuery.toLowerCase();
      return (
        entry.name.toLowerCase().includes(term) ||
        entry.slot.toLowerCase().includes(term) ||
        entry.status.toLowerCase().includes(term)
      );
    });
  }, [participants, searchQuery, activeFilter]);

  return (
    <div className="bg-gray-950 text-gray-100 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">

      {/* Cyberpunk grid overlay */}
      <div className="fixed inset-0 pointer-events-none cyber-grid-bg" />

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Zap className="w-6 h-6 text-teal-400" />
            <h1 className="text-3xl font-bold text-white tracking-tight">
              My <span className="text-teal-400 cyber-glow-teal">Caseload</span>
            </h1>
          </div>
          <p className="text-gray-500 mt-1 pl-9">Active capacity and client roster — real time.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/portal/staff/casenote/new"
            className="relative bg-teal-500/10 border border-teal-500/50 text-teal-400 px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-500/20 hover:border-teal-400 transition-all active:scale-95 flex items-center gap-2 cursor-pointer cyber-btn-add"
          >
            <Plus className="w-5 h-5" /> New Case Note
          </Link>
          <Link
            href="/portal/staff/caseload/new"
            className="relative bg-indigo-500/10 border border-indigo-500/50 text-indigo-400 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-500/20 hover:border-indigo-400 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" /> New Client
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative bg-gray-900 p-5 rounded-2xl border border-teal-500/20 overflow-hidden group hover:border-teal-500/50 transition-all cyber-card-shadow">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-teal-500/10 transition-colors" />
          <p className="text-xs font-semibold text-teal-500 uppercase tracking-widest mb-2">Total Capacity</p>
          <p className="text-4xl font-bold text-white cyber-glow-white">{metrics.capacity}</p>
          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-500/50 to-transparent w-full" />
        </div>

        <div className="relative bg-gray-900 p-5 rounded-2xl border border-teal-400/30 overflow-hidden group hover:border-teal-400/60 transition-all cyber-card-shadow-teal">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-400/5 rounded-full -mr-8 -mt-8 group-hover:bg-teal-400/10 transition-colors" />
          <p className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-2">Active Cases</p>
          <p className="text-4xl font-bold text-teal-400 cyber-glow-number">{metrics.active}</p>
          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-400/60 to-transparent w-full" />
        </div>

        <div className="relative bg-gray-900 p-5 rounded-2xl border border-gray-700/50 overflow-hidden group hover:border-gray-600 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-700/20 rounded-full -mr-8 -mt-8 group-hover:bg-gray-700/30 transition-colors" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Empty Slots</p>
          <p className="text-4xl font-bold text-gray-400">{metrics.empty}</p>
          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gray-600/50 to-transparent w-full" />
        </div>

        <div className="relative bg-gray-900 p-5 rounded-2xl border border-rose-500/20 overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-rose-500/10 transition-colors" />
          <p className="text-xs font-semibold text-rose-400/70 uppercase tracking-widest mb-2">Broken Platform</p>
          <p className="text-4xl font-bold text-rose-400">{metrics.broken}</p>
          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-rose-500/40 to-transparent w-full" />
        </div>
      </div>

      {/* Insights strip — compact single row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statusBreakdown.map((item) => (
          <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.label}</p>
              <p className="text-xl font-bold text-white">{item.count}</p>
            </div>
            <div className="w-1.5 h-10 rounded-full bg-gray-800 overflow-hidden flex flex-col-reverse">
              <div className={`${item.color} rounded-full transition-all`} style={{ height: `${item.pct}%` }} />
            </div>
          </div>
        ))}
        <div className="bg-gray-900 border border-indigo-500/20 rounded-xl px-4 py-3 col-span-2 lg:col-span-1 flex flex-col justify-center">
          <p className="text-[10px] text-indigo-400 uppercase tracking-widest mb-1">Motivation</p>
          <blockquote className="text-[11px] leading-relaxed text-gray-300 italic line-clamp-2">
            &ldquo;{INSPIRATIONAL_QUOTES[quoteIndex]}&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Caseload Table */}
      <div className="relative bg-gray-900 rounded-2xl border border-teal-500/20 overflow-hidden flex flex-col cyber-table-shadow">
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-teal-500/40 rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-teal-500/20 rounded-br-2xl pointer-events-none" />

        {/* Toolbar */}
        <div className="relative p-5 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-teal-500/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients or slots..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500/40 focus:border-teal-500/60 transition-all text-sm text-gray-300 placeholder-gray-600"
            />
          </div>
          <div className="flex items-center gap-2">
            {["All", "A-Block", "D-Block", "J-Block"].map(filterValue => (
              <button
                key={filterValue}
                title={`Filter by ${filterValue}`}
                onClick={() => setActiveFilter(filterValue)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeFilter === filterValue
                    ? "bg-teal-500/20 border border-teal-500/60 text-teal-400 cyber-btn-filter-active"
                    : "bg-gray-800 border border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400"
                }`}
              >
                {filterValue === "All" && <Filter className="w-3 h-3" />}
                {filterValue}
              </button>
            ))}
          </div>
        </div>

        {/* Table — fixed height, internal scroll */}
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)]">
          {filteredCaseload.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-600">
              <Search className="w-12 h-12 mb-3 text-gray-700" />
              <p className="text-lg font-medium text-gray-500">No matching slots found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-gray-900">
                <tr className="border-b border-gray-800 text-xs uppercase tracking-widest text-teal-500/60 font-semibold">
                  <th className="px-4 py-3">Slot</th>
                  <th className="px-4 py-3">Client Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 hidden md:table-cell">Block</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCaseload.map((entry, index) => (
                  <tr
                    key={index}
                    className={`group border-b border-gray-800/60 transition-all ${
                      entry.status === "Empty" ? "bg-gray-900/40" : "hover:bg-teal-500/5"
                    }`}
                  >
                    <td className="px-4 py-2.5 font-bold whitespace-nowrap">
                      <Link
                        href={`/portal/staff/caseload/${entry.slot}`}
                        className="text-teal-400 hover:text-teal-300 transition-colors font-mono tracking-widest text-xs cyber-slot-glow"
                      >
                        [{entry.slot}]
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {entry.status === "Empty" ? (
                          <div className="w-7 h-7 rounded-full border border-dashed border-gray-700 flex items-center justify-center bg-gray-800/50 shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0 cyber-avatar-glow">
                            {entry.name.charAt(0)}
                          </div>
                        )}
                        {entry.status === "Empty" || entry.status === "Broken Platform" ? (
                          <span className={`font-medium text-sm ${
                            entry.status === "Empty" ? "text-gray-600 italic" : "text-rose-400 italic"
                          }`}>
                            {entry.name}
                          </span>
                        ) : (
                          <Link
                            href={`/portal/staff/caseload/${entry.slot}`}
                            className="font-medium text-sm text-gray-200 hover:text-teal-300 transition-colors"
                          >
                            {entry.name}
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <button
                        title={`Cycle status for ${entry.slot} (currently: ${entry.status})`}
                        onClick={() => updateParticipantStatus(entry.slot, cycleStatus(entry.status))}
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                          entry.status.includes("Active")
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20"
                            : entry.status === "Broken Platform"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                            : "bg-gray-800 text-gray-500 border-gray-700 hover:bg-gray-700"
                        }`}
                      >
                        {entry.status.includes("Active") && (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mr-1.5 animate-pulse cyber-dot-glow" />
                        )}
                        {entry.status === "Broken Platform" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {entry.status}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap hidden md:table-cell">
                      <span className="text-xs text-gray-500 font-mono tracking-wider flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          entry.environment === "A-Block" ? "bg-teal-400 cyber-dot-glow" :
                          entry.environment === "D-Block" ? "bg-cyan-400 cyber-dot-glow-cyan" :
                          "bg-indigo-400 cyber-dot-glow-indigo"
                        }`} />
                        {entry.environment}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {entry.status !== "Empty" && (
                          <Link
                            href={`/portal/staff/caseload/${entry.slot}/demographics`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400 transition-all"
                          >
                            <User className="w-3 h-3" /> Demographics
                          </Link>
                        )}
                        <Link
                          href={`/portal/staff/caseload/${entry.slot}`}
                          title={`Open profile for ${entry.name}`}
                          className="p-2 text-gray-600 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all focus:outline-none"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
