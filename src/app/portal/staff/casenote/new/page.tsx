"use client";

import { useState } from "react";
import { ArrowLeft, Save, Bolt, FileText, CheckSquare, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStaff } from "@/context/StaffContext";
import { useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";

const CASE_NOTE_TYPES = [
  "Participant Update", "Weekly Check-In", "Housing Navigation", 
  "Benefits Assistance", "Employment Support", "Medical / Behavioral Health Follow-Up", 
  "Advocacy / Accompaniment", "Crisis Support", "Incident Related", 
  "Transfer / Handoff", "Exit / Program Transition", "Attempt to Contact", 
  "No Activity", "Forms Check-In Review"
];

const CONTACT_TYPES = [
  "F2F", "Phone", "Outreach", "Forms", "Office", "Advocacy", "Incident", "Transfer", "Exit", "Attempt to Contact"
];

const LOCATIONS = [
  "O Lot", "Tier 3", "Tier 4", "Staff Office", "Phone", "Community", 
  "Outreach", "Offsite Appointment", "Housing Commission", "Hospital / ER", "Agency Partner Site"
];

export default function NewCaseNote() {
  const router = useRouter();
  const { addCaseNote, team } = useStaff();
  const { data: session } = useSession();
  const staffName = session?.user?.name ?? session?.user?.email ?? "Staff";
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const addToHmisQueue = useMutation(api.functions.addToHmisQueue);

  // Form State
  const [formData, setFormData] = useState({
    type: "",
    date: new Date().toISOString().split('T')[0],
    uid: "",
    caseManager: "",
    location: "O Lot",
    narrative: ""
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.uid || !formData.narrative || !formData.caseManager) return alert("Please fill in UID, Case Manager, and Narrative.");

    setIsSaving(true);

    await addCaseNote({
      clientName: formData.uid.toUpperCase(),
      date: new Date().toLocaleDateString(),
      type: formData.type || "Participant Update",
      summary: formData.narrative,
      staff: staffName
    });

    await addToHmisQueue({
      clientName: formData.uid.toUpperCase(),
      date: formData.date,
      type: formData.type || "Participant Update",
      summary: formData.narrative,
      staff: staffName,
    });

    setIsSaving(false);
    router.push(`/portal/staff/caseload/${formData.uid}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Top Navigation & Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/portal/staff" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-charcoal-900 hover:bg-slate-50 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-charcoal-900">New Case Note</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Enhanced CaseNote Standard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Securely
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Toggle Mode */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            type="button"
            onClick={() => setIsQuickMode(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${!isQuickMode ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FileText className="w-4 h-4" /> Full SOP Packet
          </button>
          <button 
            type="button"
            onClick={() => setIsQuickMode(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${isQuickMode ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Bolt className="w-4 h-4" /> Fast Field Version
          </button>
        </div>

        {/* Style Reminder Hint */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-4 my-6">
          <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-indigo-900">Narrative Style Rule Activated</h4>
            <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
              Write clean, direct, narrative style. Speak in your natural voice (human, not overly stiff) but clean enough for audit. <br/>
              <span className="font-semibold">Format Rule:</span> No bullet points in the header. UID = Tent Letter + Number.
            </p>
          </div>
        </div>

        {/* Common Header Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-charcoal-900 border-b border-slate-100 pb-3">1. Header Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CaseNote Type</label>
              <select 
                title="CaseNote Type"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none appearance-none"
              >
                <option value="">Select Type...</option>
                {CASE_NOTE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
              <input 
                type="date"
                title="Date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned CaseMgr <span className="text-rose-500">*</span></label>
              <select 
                title="Assigned Case Manager"
                value={formData.caseManager}
                onChange={(e) => setFormData({...formData, caseManager: e.target.value})}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none appearance-none"
              >
                <option value="">Select Manager...</option>
                {team.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">UID (Tent + Number)</label>
              <input 
                type="text" 
                placeholder="e.g. A1, D9, J8" 
                required
                value={formData.uid}
                onChange={(e) => setFormData({...formData, uid: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
              <select 
                title="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none appearance-none"
              >
                <option value="">Select Location...</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CaseMgr</label>
            <input type="text" title="Case Manager" defaultValue="Case Manager" readOnly className="w-full bg-slate-100 border border-slate-200 text-slate-500 font-medium rounded-xl px-4 py-2.5 outline-none cursor-not-allowed" />
          </div>
          {!isQuickMode && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Program Tier</label>
                <input type="text" placeholder="e.g. Tier 3" className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Type</label>
                <select title="Contact Type" className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none appearance-none">
                  <option value="">Select Contact Type...</option>
                  {CONTACT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {isQuickMode ? (
        /* FAST FIELD VERSION */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-charcoal-900 border-b border-slate-100 pb-3">2. Core Narrative Body</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal-900 mb-2">Client Concern / Situation</label>
              <textarea placeholder="Document why contact occurred, context, participant reports..." className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none resize-y"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal-900 mb-2">Staff Intervention</label>
              <textarea placeholder="Document what you did (advocacy, referrals, boundary setting)..." className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none resize-y"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal-900 mb-2">Client Response</label>
              <textarea placeholder="Document response, demeanor, engagement level, statements..." className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none resize-y"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-charcoal-900 mb-2">Next Step / Follow-Up</label>
              <textarea placeholder="Clear actionable next steps..." className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 h-20 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none resize-y"></textarea>
            </div>
          </div>
        </div>
      ) : (
        /* FULL SOP EXPANDED VERSION */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6 w-full">
            <h2 className="text-lg font-bold text-charcoal-900 border-b border-slate-100 pb-3">2. Core Narrative Structure</h2>
            
            <div className="space-y-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-charcoal-800 uppercase mb-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs">I</span> Presenting Issue / Contact Context
                </label>
                <textarea placeholder="Why the contact happened, where, scheduled/unscheduled, immediate background..." className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none resize-y"></textarea>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-charcoal-800 uppercase mb-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs">II</span> Participant Statement / Client Concern
                </label>
                <textarea placeholder="Direct concerns, requested needs, housing updates, medical concerns... (Include quotes if useful)" className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none resize-y"></textarea>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-charcoal-800 uppercase mb-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs">III</span> Case Manager Observation
                </label>
                <textarea placeholder="Participant presentation, mood, grooming, safety concerns, motivation, body language..." className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none resize-y"></textarea>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-charcoal-800 uppercase mb-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs">IV</span> Interventions / Actions Taken
                </label>
                <p className="text-xs text-slate-500 mb-2 italic">Write as paragraph narrative, not checklist: Advocacy, referrals, forms, coordination, de-escalation...</p>
                <textarea placeholder="Exactly what you did during the contact..." className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none resize-y"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-charcoal-800 uppercase mb-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs">V</span> Immediate Needs
                  </label>
                  <textarea placeholder="Housing, ID, Meds, Safety, Food..." className="w-full bg-amber-50/30 border border-amber-200 text-slate-700 rounded-xl px-4 py-3 h-28 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition outline-none resize-y"></textarea>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-charcoal-800 uppercase mb-2">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">VI</span> Barriers / Risk
                  </label>
                  <textarea placeholder="Avoidance, medical instability, lost docs, conflict..." className="w-full bg-rose-50/30 border border-rose-200 text-slate-700 rounded-xl px-4 py-3 h-28 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition outline-none resize-y"></textarea>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-charcoal-800 uppercase mb-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs">VII</span> Plan / Next Steps
                </label>
                <textarea placeholder="Clear, actionable, near-term next steps..." className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none resize-y"></textarea>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-charcoal-800 uppercase mb-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs">VIII</span> Clinical / Engagement Impression
                </label>
                <textarea placeholder="A brief professional summary of stability (e.g., Participant presents with ongoing frustration...)" className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition outline-none resize-y"></textarea>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 text-sm font-bold tracking-wide text-charcoal-800 uppercase mb-4">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs">IX</span> Follow-Up Target
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Next Date</label>
                    <input type="date" title="Next follow-up date" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Follow-Up Type</label>
                    <input type="text" placeholder="e.g. Phone check-in" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Priority Level</label>
                    <select title="Priority Level" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none appearance-none">
                      <option>Low / Routine</option>
                      <option>Medium / Time-Sensitive</option>
                      <option>High / Urgent</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Packet Checklist */}
          <div className="bg-indigo-900 rounded-2xl shadow-sm border border-indigo-800 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <CheckSquare className="w-5 h-5 text-teal-400" /> Default SOP Packet Attached
              </h3>
              <p className="text-indigo-200 text-sm max-w-lg">
                Per standing preference, the full packet (Case Manager Action Plan, Follow-Up Log, Checklist, SMART Goals, Compliance Check) will automatically append on save.
              </p>
            </div>
            <button type="button" className="text-sm px-4 py-2 rounded-lg bg-indigo-800 hover:bg-indigo-700 transition font-medium whitespace-nowrap">
              Customize Packet
            </button>
          </div>
        </div>
      )}

      {/* CORE CASE NOTE COMPLETION CHECKLIST */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <CheckSquare className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-charcoal-900">CORE CASE NOTE COMPLETION CHECKLIST</h2>
        </div>
        <p className="text-sm text-slate-500 font-medium pb-2">Meets Requirements Verify:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
          {[
            "Participant / UID Verified",
            "Date of Contact Documented",
            "Location of Contact Documented",
            "Contact Type Identified",
            "Case Manager Name Listed",
            "Client Concern / Presenting Issue Clearly Stated",
            "Staff Intervention Clearly Documented",
            "Client Response / Engagement Documented",
            "Observations Included (if applicable)",
            "Immediate Needs Identified or Ruled Out",
            "Barriers / Risks Addressed or Noted",
            "Next Step / Follow-Up Action Included",
            "Narrative Is Clear, Objective, and Audit-Ready",
            "Note Uses Correct UID Format (Tent Letter + Number)",
            "Note Matches New SOP Structure"
          ].map((item, i) => (
            <label key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-100">
              <input type="checkbox" className="mt-1 w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-600" />
              <span className="text-sm text-slate-700 leading-tight">{item}</span>
            </label>
          ))}
        </div>
      </div>

        {/* Action Footer */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-6 pt-10 border-t border-slate-200">
          <label className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl cursor-pointer hover:bg-indigo-100 transition">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500" />
            <div className="text-xs">
              <p className="font-bold text-indigo-900 leading-none">Email Forwarding Active</p>
              <p className="text-indigo-600 mt-1 font-medium">Push copy to secure staff inbox</p>
            </div>
          </label>

          <div className="flex gap-3 w-full md:w-auto">
            <Link href="/portal/staff" className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition text-center text-sm md:text-base">
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 active:scale-95 transition flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Case Note
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
