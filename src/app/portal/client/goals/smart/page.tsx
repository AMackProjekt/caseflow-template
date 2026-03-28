"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Clock,
  Check
} from "lucide-react";
import Link from "next/link";
import { useStaff } from "@/context/StaffContext";
import { useSession } from "next-auth/react";

export default function SmartGoalSheet() {
  const { addSmartGoal, smartGoals } = useStaff();
  const { data: session } = useSession();
  const mySlot = session?.user?.email ?? "unknown";

  const [form, setForm] = useState({
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timebound: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.specific || !form.timebound) return;

    addSmartGoal({
      client: mySlot,
      date: new Date().toLocaleDateString(),
      ...form,
      status: 'active'
    });
    setForm({ specific: "", measurable: "", achievable: "", relevant: "", timebound: "" });
    alert("Weekly S.M.A.R.T. Goal Saved! Your case manager will review this during your next session.");
  };

  const myActiveGoals = smartGoals.filter(g => g.client === mySlot);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/portal/client/goals" className="flex items-center gap-2 text-slate-500 hover:text-charcoal-900 transition font-bold text-sm">
           <ArrowLeft className="w-4 h-4" /> Back to Milestones
        </Link>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100 italic">Self-Directed Compliance</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
           <h1 className="text-4xl md:text-5xl font-black text-charcoal-900 tracking-tighter mb-4">
              Weekly <span className="text-indigo-600 italic">S.M.A.R.T.</span> Goal Sheet
           </h1>
           <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
              Define your objectives for this week. Use the S.M.A.R.T. logic to ensure high success rates.
           </p>
        </div>

        {/* FORM AREA */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
           <div className="p-10 md:p-14">
              <form onSubmit={handleSubmit} className="space-y-10">
                 
                 {/* Specific */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-indigo-500/20">S</div>
                       <h3 className="text-xl font-bold text-charcoal-950 italic">Specific</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest pl-1">What exactly do you want to achieve?</p>
                    <textarea 
                      value={form.specific}
                      onChange={(e) => setForm({...form, specific: e.target.value})}
                      placeholder="e.g. Schedule my DMV appointment and obtain the ID replacement receipt."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-700 text-lg outline-none focus:ring-2 focus:ring-indigo-500/20 transition shadow-inner font-serif italic"
                    />
                 </div>

                 <div className="grid md:grid-cols-2 gap-12">
                    {/* Measurable */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-teal-500 text-white rounded-xl flex items-center justify-center font-black">M</div>
                          <h3 className="font-bold text-charcoal-950">Measurable</h3>
                       </div>
                       <input 
                         value={form.measurable}
                         onChange={(e) => setForm({...form, measurable: e.target.value})}
                         placeholder="How will you track it?"
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 transition"
                       />
                    </div>
                    {/* Achievable */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-500 text-white rounded-xl flex items-center justify-center font-black">A</div>
                          <h3 className="font-bold text-charcoal-950">Achievable</h3>
                       </div>
                       <input 
                         value={form.achievable}
                         onChange={(e) => setForm({...form, achievable: e.target.value})}
                         placeholder="Is this realistic today?"
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                       />
                    </div>
                    {/* Relevant */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center font-black">R</div>
                          <h3 className="font-bold text-charcoal-950">Relevant</h3>
                       </div>
                       <input 
                         value={form.relevant}
                         onChange={(e) => setForm({...form, relevant: e.target.value})}
                         placeholder="Why does this matter?"
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition"
                       />
                    </div>
                    {/* Time-bound */}
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-xl flex items-center justify-center font-black">T</div>
                          <h3 className="font-bold text-charcoal-950">Time-bound</h3>
                       </div>
                       <input 
                         value={form.timebound}
                         onChange={(e) => setForm({...form, timebound: e.target.value})}
                         placeholder="Target completion date?"
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                       />
                    </div>
                 </div>

                 <button className="w-full py-5 bg-charcoal-900 hover:bg-black text-white font-black rounded-2xl text-lg transition-all shadow-2xl flex items-center justify-center gap-4 group italic">
                    LOCK IN WEEKLY GOAL <CheckCircle2 className="w-6 h-6 text-teal-400 group-hover:scale-125 transition-transform" />
                 </button>
              </form>
           </div>
        </div>

        {/* ACTIVE GOALS DISPLAY */}
        <div className="space-y-6">
           <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-4">Past S.M.A.R.T. Log</h2>
           <div className="grid gap-4">
              {myActiveGoals.map(goal => (
                 <div key={goal._id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-500/30 transition">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">G</div>
                       <div>
                          <p className="text-lg font-black text-charcoal-900 italic leading-tight mb-1">\"{goal.specific}\"</p>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {goal.timebound}</span>
                             <span>//</span>
                             <span className="text-teal-600">Locked in on {goal.date}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                         goal.status === 'active' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-teal-50 text-teal-600 border-teal-100'
                       }`}>
                          {goal.status}
                       </span>
                       <button title="Mark goal complete" className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition whitespace-nowrap">
                          <Check className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              ))}
              {myActiveGoals.length === 0 && (
                <div className="py-20 bg-slate-50 border border-slate-100 border-dashed rounded-[3rem] text-center">
                   <p className="text-slate-300 font-bold uppercase tracking-widest italic">No S.M.A.R.T. Goals Logged Yet.</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
