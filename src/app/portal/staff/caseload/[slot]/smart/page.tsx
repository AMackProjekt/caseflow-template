"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStaff } from "@/context/StaffContext";
import {
  ArrowLeft,
  Clock,
  Save,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";

export default function StaffSmartGoalSheet() {
  const { slot } = useParams();
  const slotStr = Array.isArray(slot) ? slot[0] ?? "" : slot ?? "";
  const router = useRouter();
  const { participants } = useStaff();
  
  const allSmartGoals = (useQuery(api.functions.listSmartGoals) ?? []) as any[];
  const addSmartGoal = useMutation(api.functions.addSmartGoal);

  const client = participants.find((p) => p.slot === slotStr);

  const [form, setForm] = useState({
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timebound: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.specific || !form.timebound) return alert("Please complete Specific and Time-bound fields.");

    setIsSaving(true);
    try {
      await addSmartGoal({
        client: slotStr,
        date: new Date().toLocaleDateString(),
        specific: form.specific,
        measurable: form.measurable,
        achievable: form.achievable,
        relevant: form.relevant,
        timebound: form.timebound,
        status: 'active'
      });
      setForm({ specific: "", measurable: "", achievable: "", relevant: "", timebound: "" });
      alert("Professional S.M.A.R.T. Goal created for this client!");
    } finally {
      setIsSaving(false);
    }
  };

  const clientGoals = allSmartGoals.filter(g => g.client === slotStr);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <Link href={`/portal/staff/caseload/${slotStr}`} className="flex items-center gap-2 text-slate-500 hover:text-charcoal-900 transition font-bold text-sm">
           <ArrowLeft className="w-4 h-4" /> Back to {client?.name || slotStr}
        </Link>
        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-100 italic">Professional Goals</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
           <h1 className="text-4xl md:text-5xl font-black text-charcoal-900 tracking-tighter mb-4">
              Professional <span className="text-amber-600 italic">S.M.A.R.T.</span> Goals
           </h1>
           <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
              Create program-focused goals for {client?.name || slotStr}. These track professional and program milestones.
           </p>
        </div>

        {/* FORM AREA */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
           <div className="p-10 md:p-14">
              <form onSubmit={handleSubmit} className="space-y-10">
                 
                 {/* Specific */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-amber-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-amber-500/20">S</div>
                       <h3 className="text-xl font-bold text-charcoal-950 italic">Specific</h3>
                    </div>
                    <label className="block">
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">What is the specific professional goal? (e.g., "Complete job training certification")</span>
                       <textarea
                         name="specific"
                         value={form.specific}
                         onChange={(e) => setForm({ ...form, specific: e.target.value })}
                         placeholder="e.g., Complete GED by end of quarter"
                         className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition resize-none h-24"
                         required
                       />
                    </label>
                 </div>

                 {/* Measurable */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-amber-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-amber-500/20">M</div>
                       <h3 className="text-xl font-bold text-charcoal-950 italic">Measurable</h3>
                    </div>
                    <label className="block">
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">How will we measure progress? (e.g., "Passing score on 4 GED practice exams")</span>
                       <textarea
                         name="measurable"
                         value={form.measurable}
                         onChange={(e) => setForm({ ...form, measurable: e.target.value })}
                         placeholder="e.g., Score 250+ on GED practice test"
                         className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition resize-none h-24"
                       />
                    </label>
                 </div>

                 {/* Achievable */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-amber-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-amber-500/20">A</div>
                       <h3 className="text-xl font-bold text-charcoal-950 italic">Achievable</h3>
                    </div>
                    <label className="block">
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Is this goal realistic and within their capacity with support? Why?</span>
                       <textarea
                         name="achievable"
                         value={form.achievable}
                         onChange={(e) => setForm({ ...form, achievable: e.target.value })}
                         placeholder="e.g., Client has strong math skills, motivated to advance employment prospects"
                         className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition resize-none h-24"
                       />
                    </label>
                 </div>

                 {/* Relevant */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-amber-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-amber-500/20">R</div>
                       <h3 className="text-xl font-bold text-charcoal-950 italic">Relevant</h3>
                    </div>
                    <label className="block">
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Why is this goal important to their program and stabilization plan?</span>
                       <textarea
                         name="relevant"
                         value={form.relevant}
                         onChange={(e) => setForm({ ...form, relevant: e.target.value })}
                         placeholder="e.g., GED opens employment opportunities, increases self-sufficiency toward housing stability"
                         className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition resize-none h-24"
                       />
                    </label>
                 </div>

                 {/* Timebound */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-amber-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-amber-500/20">T</div>
                       <h3 className="text-xl font-bold text-charcoal-950 italic">Time-bound</h3>
                    </div>
                    <label className="block">
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">What is the deadline? (e.g., "December 31, 2025")</span>
                       <input
                         type="date"
                         name="timebound"
                         value={form.timebound}
                         onChange={(e) => setForm({ ...form, timebound: e.target.value })}
                         className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition"
                         required
                       />
                    </label>
                 </div>

                 {/* Submit */}
                 <div className="flex gap-4 pt-6 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 px-6 py-3 rounded-2xl border border-slate-200 font-bold text-charcoal-900 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Create Professional Goal
                    </button>
                 </div>
              </form>
           </div>
        </div>

        {/* Active Goals */}
        {clientGoals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-charcoal-900">Program Goals for {client?.name}</h2>
            {clientGoals.map((goal, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${
                goal.status === 'active' ? 'bg-amber-50 border-amber-200' : 
                goal.status === 'completed' ? 'bg-emerald-50 border-emerald-200' : 
                'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-charcoal-900">{goal.specific}</h3>
                    <p className="text-sm text-slate-600 mt-2">{goal.measurable}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 font-bold">
                      <Clock className="w-3 h-3" /> {goal.timebound}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                    goal.status === 'active' ? 'bg-amber-200 text-amber-800' :
                    goal.status === 'completed' ? 'bg-emerald-200 text-emerald-800' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {goal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
