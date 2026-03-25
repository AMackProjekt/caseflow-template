"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { CalendarDays } from "lucide-react";
import type { Doc } from "../../../../../convex/_generated/dataModel";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const HOUR_COLORS = [
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
];

export default function SchedulingPage() {
  const schedules = (useQuery(api.functions.listStaffSchedules) ?? []) as Doc<"staffSchedules">[];
  const teamMembers = useQuery(api.functions.listTeamMembers) ?? [];

  // Map staff names to color index
  const staffNames = Array.from(new Set(schedules.map((s) => s.staffName))) as string[];
  const staffColorMap = Object.fromEntries(
    staffNames.map((n, i) => [n, HOUR_COLORS[i % HOUR_COLORS.length]])
  );

  // Group schedules by day
  const byDay = DAYS.reduce<Record<string, typeof schedules>>((acc, d) => {
    acc[d] = schedules.filter((s) => s.dayOfWeek === d);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-violet-500" /> Staff Scheduling
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Weekly grid view — {teamMembers.length} staff, {schedules.length} schedule entries
        </p>
      </div>

      {/* Legend */}
      {staffNames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {staffNames.map((n) => (
            <span key={n} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${staffColorMap[n]}`}>
              {n}
            </span>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day) => (
          <div key={day} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-violet-950 text-violet-100 text-xs font-semibold px-3 py-2 text-center">
              {day.slice(0, 3).toUpperCase()}
            </div>
            <div className="p-2 space-y-1.5 min-h-[120px]">
              {byDay[day].length === 0 ? (
                <p className="text-[10px] text-slate-300 text-center pt-2">Off</p>
              ) : (
                byDay[day].map((s) => (
                  <div key={s._id}
                    className={`text-[10px] px-2 py-1.5 rounded-lg border ${staffColorMap[s.staffName] ?? HOUR_COLORS[0]}`}>
                    <p className="font-semibold leading-tight">{s.staffName}</p>
                    <p className="opacity-80">{s.startTime}–{s.endTime}</p>
                    {s.location && <p className="opacity-60 truncate">{s.location}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* List view */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">All Schedule Entries</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Staff", "Email", "Day", "Hours", "Location", "Notes"].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-slate-400 py-8 text-sm">
                No schedules yet. Add entries from the Personnel page.
              </td></tr>
            ) : (
              DAYS.flatMap((day) =>
                byDay[day].map((s) => (
                  <tr key={s._id} className="border-b border-slate-50 hover:bg-violet-50/20">
                    <td className="px-4 py-3 font-semibold text-slate-800">{s.staffName}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{s.staffEmail}</td>
                    <td className="px-4 py-3 text-slate-600">{s.dayOfWeek}</td>
                    <td className="px-4 py-3 text-slate-600">{s.startTime} – {s.endTime}</td>
                    <td className="px-4 py-3 text-slate-500">{s.location ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{s.notes ?? "—"}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
