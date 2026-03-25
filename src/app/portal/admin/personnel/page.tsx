"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { UserCog, Plus, Trash2, Save, Search } from "lucide-react";
import type { Id, Doc } from "../../../../../convex/_generated/dataModel";

export default function PersonnelPage() {
  const teamMembers = (useQuery(api.functions.listTeamMembers) ?? []) as Doc<"teamMembers">[];
  const schedules = (useQuery(api.functions.listStaffSchedules) ?? []) as Doc<"staffSchedules">[];
  const addTeamMember = useMutation(api.functions.addTeamMember);
  const upsertSchedule = useMutation(api.functions.upsertStaffSchedule);
  const deleteSchedule = useMutation(api.functions.deleteStaffSchedule);

  const [search, setSearch] = useState("");
  const [newMember, setNewMember] = useState({ memberId: "", name: "", role: "" });
  const [addingMember, setAddingMember] = useState(false);

  const [schedForm, setSchedForm] = useState({
    staffEmail: "",
    staffName: "",
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "17:00",
    location: "",
    notes: "",
  });
  const [addingSched, setAddingSched] = useState(false);

  const filtered = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAddMember() {
    if (!newMember.memberId || !newMember.name || !newMember.role) return;
    await addTeamMember(newMember);
    setNewMember({ memberId: "", name: "", role: "" });
    setAddingMember(false);
  }

  async function handleAddSchedule() {
    if (!schedForm.staffEmail || !schedForm.staffName) return;
    await upsertSchedule(schedForm);
    setSchedForm({ staffEmail: "", staffName: "", dayOfWeek: "Monday", startTime: "09:00", endTime: "17:00", location: "", notes: "" });
    setAddingSched(false);
  }

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-violet-500" /> Personnel Management
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Staff directory, roles, and schedules</p>
        </div>
      </div>

      {/* Staff Directory */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff…"
              className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <button
            onClick={() => setAddingMember((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>

        {addingMember && (
          <div className="p-4 border-b border-slate-100 bg-violet-50 flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600 font-medium">Member ID</label>
              <input value={newMember.memberId} onChange={(e) => setNewMember((s) => ({ ...s, memberId: e.target.value }))}
                title="Member ID" placeholder="e.g., ORG-001"
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 w-36" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600 font-medium">Name</label>
              <input value={newMember.name} onChange={(e) => setNewMember((s) => ({ ...s, name: e.target.value }))}
                title="Staff member name" placeholder="Full name"
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 w-44" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600 font-medium">Role / Title</label>
              <input value={newMember.role} onChange={(e) => setNewMember((s) => ({ ...s, role: e.target.value }))}
                title="Role or title" placeholder="e.g., Case Manager"
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 w-44" />
            </div>
            <button onClick={handleAddMember}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        )}

        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Member ID</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Schedule Entries</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-slate-400 py-8 text-sm">No staff members yet.</td></tr>
            ) : (
              filtered.map((m) => {
                const memberSchedules = schedules.filter((s) => s.staffName === m.name);
                return (
                  <tr key={m._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-800">{m.name}</td>
                    <td className="px-4 py-3 text-slate-600">{m.role}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{m.memberId}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">
                        {memberSchedules.length}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Staff Schedules */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Staff Schedules</h2>
          <button onClick={() => setAddingSched((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>

        {addingSched && (
          <div className="p-4 border-b border-slate-100 bg-violet-50 flex flex-wrap gap-3 items-end">
            {[
              { key: "staffEmail", label: "Staff Email", w: "w-44" },
              { key: "staffName", label: "Staff Name", w: "w-36" },
              { key: "location", label: "Location", w: "w-36" },
              { key: "notes", label: "Notes", w: "w-40" },
            ].map(({ key, label, w }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-slate-600 font-medium">{label}</label>
                <input value={(schedForm as Record<string, string>)[key]}
                  onChange={(e) => setSchedForm((s) => ({ ...s, [key]: e.target.value }))}
                  title={label} placeholder={label}
                  className={`px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 ${w}`} />
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600 font-medium">Day</label>
              <select value={schedForm.dayOfWeek} onChange={(e) => setSchedForm((s) => ({ ...s, dayOfWeek: e.target.value }))}              title="Day of week"                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400">
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            {["startTime", "endTime"].map((k) => (
              <div key={k} className="flex flex-col gap-1">
                <label className="text-xs text-slate-600 font-medium">{k === "startTime" ? "Start" : "End"}</label>
                <input type="time" value={(schedForm as Record<string, string>)[k]}
                  onChange={(e) => setSchedForm((s) => ({ ...s, [k]: e.target.value }))}
                  title={k === "startTime" ? "Start time" : "End time"}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 w-28" />
              </div>
            ))}
            <button onClick={handleAddSchedule}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        )}

        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Staff", "Day", "Hours", "Location", "Notes", ""].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-slate-400 py-8 text-sm">No schedule entries yet.</td></tr>
            ) : (
              schedules.map((s) => (
                <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800">{s.staffName}</td>
                  <td className="px-4 py-3 text-slate-600">{s.dayOfWeek}</td>
                  <td className="px-4 py-3 text-slate-600">{s.startTime} – {s.endTime}</td>
                  <td className="px-4 py-3 text-slate-500">{s.location ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{s.notes ?? "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteSchedule({ id: s._id as Id<"staffSchedules"> })}
                      title="Delete schedule entry"
                      className="text-slate-300 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
