"use client";

import { Target, CheckCircle2, Clock, ArrowRight, ShieldCheck, Flag, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function ClientMilestones() {
  const { data: session } = useSession();
  const allSmartGoals = (useQuery(api.functions.listSmartGoals) ?? []) as any[];
  
  // Filter goals for the logged-in client
  const clientEmail = session?.user?.email ?? "";
  const milestones = allSmartGoals.filter(g => g.client === clientEmail);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-charcoal-900 tracking-tight">Your Journey <span className="text-teal-500">Milestones</span>.</h1>
          <p className="text-slate-500 mt-2 font-medium">Tracking your progress toward permanent stabilization and housing.</p>
        </div>
        <div className="flex gap-4">
           <Link href="/portal/client/goals/smart" className="bg-indigo-600 shadow-indigo-600/20 shadow-xl text-white px-6 py-4 rounded-3xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-3 active:scale-95 group">
              Weekly S.M.A.R.T. Goals <Sparkles className="w-5 h-5 text-teal-400 group-hover:rotate-12 transition-transform" />
           </Link>
           <div className="bg-teal-50 px-6 py-4 rounded-3xl border border-teal-100 flex items-center gap-4 hidden md:flex">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm border border-teal-100">
                 <Flag className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-none mb-1">Total S.M.A.R.T. Goals</p>
                 <p className="text-sm font-bold text-charcoal-900 leading-none">{milestones.length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Detailed Timeline */}
        <div className="lg:col-span-3 space-y-4">
           {milestones.length === 0 && (
             <div className="p-12 rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center gap-4">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                 <Target className="w-8 h-8 text-slate-200" />
               </div>
               <div>
                 <p className="text-sm font-bold text-slate-500">No weekly goals set yet.</p>
                 <p className="text-xs text-slate-400 mt-1">Create your first S.M.A.R.T. goal to start tracking your progress.</p>
               </div>
             </div>
           )}
           {milestones.map((m, i) => (
             <div key={i} className={`p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group ${
               m.status === 'completed' ? 'bg-white border-slate-100 opacity-60' : 
               m.status === 'active' ? 'bg-white border-teal-500 shadow-xl shadow-teal-500/10 scale-[1.02]' : 
               'bg-slate-50/50 border-slate-200 border-dashed'
             }`}>
                {m.status === 'active' && <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>}
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                   <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                        m.status === 'completed' ? 'bg-teal-50 text-teal-600 border-teal-100' : 
                        m.status === 'active' ? 'bg-teal-600 text-white border-teal-700 shadow-lg' : 
                        'bg-white text-slate-300 border-slate-100'
                      }`}>
                         {m.status === 'completed' ? <CheckCircle2 className="w-7 h-7" /> : <Target className="w-7 h-7" />}
                      </div>
                      <div>
                         <h3 className={`text-xl font-bold ${m.status === 'active' ? 'text-charcoal-950' : 'text-slate-600'}`}>{m.specific}</h3>
                         <p className="text-sm text-slate-400 mt-2 max-w-lg leading-relaxed">
                           <span className="font-bold text-slate-600">Measurable:</span> {m.measurable}
                         </p>
                         <p className="text-sm text-slate-400 mt-1 max-w-lg leading-relaxed">
                           <span className="font-bold text-slate-600">Target:</span> {m.timebound}
                         </p>
                      </div>
                   </div>
                   
                   <div className="text-left md:text-right shrink-0">
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${m.status === 'active' ? 'text-teal-600' : 'text-slate-400'}`}>
                         {m.status === 'completed' ? 'Completed' : m.status === 'active' ? 'Active Target' : 'Missed'}
                      </p>
                      <p className={`text-sm font-bold mt-1 ${m.status === 'active' ? 'text-charcoal-900' : 'text-slate-500'}`}>{m.date}</p>
                   </div>
                </div>
                
                {m.status === 'active' && (
                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-500">Discuss progress with your case manager.</span>
                     </div>
                     <Link href="/portal/client/messages" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition flex items-center gap-2 group active:scale-95">
                        Send Message <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </div>
                )}
             </div>
           ))}
        </div>

        {/* Right: Summary & Stats */}
        <div className="space-y-6">
           <div className="bg-charcoal-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl"></div>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-teal-400" /> Progress Summary
              </h2>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                       <span>Completion Rate</span>
                       <span>{milestones.length > 0 ? Math.round((milestones.filter(m => m.status === 'completed').length / milestones.length) * 100) : 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-teal-500 transition-all duration-500" 
                         style={{
                           width: milestones.length > 0 ? `${(milestones.filter(m => m.status === 'completed').length / milestones.length) * 100}%` : '0%'
                         }}
                       ></div>
                    </div>
                 </div>
                 
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Active Goals</span>
                    <span className="text-lg font-black text-teal-400">{milestones.filter(m => m.status === 'active').length}</span>
                 </div>
                 
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Completed</span>
                    <span className="text-lg font-black text-emerald-400">{milestones.filter(m => m.status === 'completed').length}</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
