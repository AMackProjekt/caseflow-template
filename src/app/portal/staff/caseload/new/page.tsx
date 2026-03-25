"use client";

import { useState } from "react";
import { ArrowLeft, Save, ShieldCheck, User, MapPin, AlertCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStaff } from "@/context/StaffContext";

const ENVIRONMENTS = [
  "O Lot", "Tier 3", "Tier 4", "Staff Office", "Community", "Outreach", "Offsite"
];

const STATUSES = ["Active", "Inactive", "On Hold", "Exited"];

const CASE_MANAGERS = [
  { id: "abby",     name: "Alex" },
  { id: "amalia",   name: "Morgan" },
  { id: "coco",     name: "Jordan" },
  { id: "jonathan", name: "Riley" },
  { id: "lawanda",  name: "Casey" },
  { id: "mack",     name: "Taylor" },
  { id: "spencer",  name: "Sam" },
  { id: "tey",      name: "Quinn" },
  { id: "tonya",    name: "Drew" },
  { id: "william",  name: "Blake" },
];

export default function NewClientIntake() {
  const router = useRouter();
  const { participants, addParticipant } = useStaff();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    slot: "",
    environment: "",
    status: "Active",
    caseManager: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.slot || !formData.caseManager) {
      return alert("Please complete all required fields.");
    }

    setIsSaving(true);

    const clientName = `${formData.firstName} ${formData.lastName}`;
    const clientSlot = formData.slot.toUpperCase();

    addParticipant({
      slot: clientSlot,
      name: clientName,
      status: formData.status,
      environment: formData.environment,
      email: formData.email || undefined,
    });

    // If the client has a Gmail address, notify the Google Chat channel
    if (formData.email && formData.email.toLowerCase().endsWith("@gmail.com")) {
      try {
        await fetch("/api/google-chat-invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: clientName,
            email: formData.email,
            slot: clientSlot,
          }),
        });
      } catch {
        // Non-blocking — don't prevent navigation if this fails
      }
    }

    setIsSaving(false);
    router.push("/portal/staff/caseload");
  };

  const usedSlots = new Set(participants.map(p => p.slot));

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-3xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/portal/staff/caseload" className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add New Client</h1>
            <p className="text-sm text-slate-500 mt-0.5">Enter the basic placement details to add this client to the caseload.</p>
          </div>
        </div>

        {/* HIPAA Notice Banner */}
        <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-2xl p-4">
          <ShieldCheck className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
          <div className="text-sm text-teal-800">
            <p className="font-semibold mb-0.5">Protected Health Information — Minimum Necessary Standard</p>
            <p className="text-teal-700 leading-relaxed">Only collect information directly relevant to service delivery. Full demographics, contact, and clinical intake details can be completed in the Demographics form after the profile is created.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Identity */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-teal-600" />
              <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Client Name</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">First Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Last Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address
                  {formData.email.toLowerCase().endsWith("@gmail.com") && (
                    <span className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
                      Gmail — will notify chat channel
                    </span>
                  )}
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                placeholder="client@gmail.com (optional)"
              />
            </div>
          </section>

          {/* Placement */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Placement</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assigned Slot / Unit <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  name="slot"
                  value={formData.slot}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                  placeholder="e.g. T3-12A"
                />
                {formData.slot && usedSlots.has(formData.slot.toUpperCase()) && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Slot already assigned to another participant
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Environment / Site</label>
                <select
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  title="Environment / Site"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                >
                  <option value="">Select...</option>
                  {ENVIRONMENTS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assigned Case Manager <span className="text-rose-500">*</span></label>
                <select
                  name="caseManager"
                  value={formData.caseManager}
                  onChange={handleChange}
                  required
                  title="Assigned Case Manager"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                >
                  <option value="">Select...</option>
                  {CASE_MANAGERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  title="Status"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 resize-none"
                placeholder="Brief notes about placement or immediate needs…"
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Link href="/portal/staff/caseload" className="text-sm text-slate-500 hover:text-slate-700 transition font-medium">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-700 transition shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Adding..." : "Add Client to Caseload"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
