"use client";

import { useState } from "react";
import { Mail, ShieldPlus, Save, CheckCircle2, MessageSquare, BrainCircuit, Bot, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [emailForwarding, setEmailForwarding] = useState(true);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Staff Settings</h1>
          <p className="text-slate-500 mt-1">Configure your aesthetics, notifications, and security preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${savedStatus ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20 active:scale-95'}`}
        >
          {savedStatus ? <><CheckCircle2 className="w-4 h-4" /> Optimization Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="space-y-6">

        {/* THEME SELECTION */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm transition-all group overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl -mr-10 -mt-10"></div>
           <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 flex items-center justify-center rounded-lg text-indigo-600">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-charcoal-900">Visual Aesthetic</h2>
                <p className="text-sm text-slate-500 font-medium">Customize the portal's light, dark, and glass environments.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
               {/* Glass Mode */}
               <button 
                 onClick={() => setTheme('glass')}
                 className={`p-6 rounded-2xl border-2 transition flex flex-col items-center gap-4 group/card ${theme === 'glass' ? 'bg-indigo-50 border-indigo-600 ring-4 ring-indigo-600/5' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
               >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${theme === 'glass' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover/card:text-indigo-600'}`}>
                     <Monitor className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                     <p className={`font-bold text-sm ${theme === 'glass' ? 'text-indigo-950' : 'text-slate-600'}`}>Glass (Default)</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Premium Translucent</p>
                  </div>
               </button>

               {/* Dark Mode */}
               <button 
                 onClick={() => setTheme('dark')}
                 className={`p-6 rounded-2xl border-2 transition flex flex-col items-center gap-4 group/card ${theme === 'dark' ? 'bg-charcoal-900 border-teal-500 ring-4 ring-teal-500/5' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
               >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${theme === 'dark' ? 'bg-teal-500 text-white' : 'bg-white text-slate-400 group-hover/card:text-charcoal-950'}`}>
                     <Moon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                     <p className={`font-bold text-sm ${theme === 'dark' ? 'text-teal-400' : 'text-slate-600'}`}>Night Focus</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Deep Obsidian</p>
                  </div>
               </button>

               {/* Light Mode */}
               <button 
                 onClick={() => setTheme('light')}
                 className={`p-6 rounded-2xl border-2 transition flex flex-col items-center gap-4 group/card ${theme === 'light' ? 'bg-amber-50 border-amber-600 ring-4 ring-amber-600/5' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
               >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${theme === 'light' ? 'bg-amber-600 text-white' : 'bg-white text-slate-400 group-hover/card:text-amber-600'}`}>
                     <Sun className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                     <p className={`font-bold text-sm ${theme === 'light' ? 'text-amber-950' : 'text-slate-600'}`}>Daylight</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Classic High Contrast</p>
                  </div>
               </button>
            </div>
        </div>
        
        {/* Email Settings Block */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 flex items-center justify-center rounded-lg text-indigo-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-charcoal-900">Email & Notification Forwarding</h2>
              <p className="text-sm text-slate-500 font-medium">Manage how alerts from CaseFlow reach you off-platform.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="font-bold text-charcoal-900 block mb-1">Primary Email Forwarding Address</label>
                <p className="text-sm text-slate-500 mb-2 md:mb-0">All case notes, document uploads, and direct messages will be securely carbon-copied here.</p>
              </div>
              <input 
                type="email" 
                title="Primary Email Forwarding Address"
                disabled 
                value={process.env.NEXT_PUBLIC_NOTIFY_EMAIL ?? "notifications@sdtoolsinc.org"} 
                className="bg-slate-200 border border-slate-300 text-slate-600 font-bold px-4 py-2 rounded-lg cursor-not-allowed w-full md:w-auto text-sm"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer" onClick={() => setEmailForwarding(!emailForwarding)}>
              <div>
                <label className="font-bold text-charcoal-900 block cursor-pointer">Activate Forwarding Bridge</label>
                <p className="text-sm text-slate-500">Instantly push portal updates to your T.O.O.LS INC inbox.</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors relative ${emailForwarding ? 'bg-teal-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${emailForwarding ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Notifications Block */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* ... notifications content ... */}
        </div>

        {/* INTEGRATED ECOSYSTEM & PLUG-INS */}
        <div className="bg-charcoal-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
           
           <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-teal-400">
                 <ShieldPlus className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-xl font-bold tracking-tight">Connected Ecosystem</h2>
                 <p className="text-sm text-white/50 font-medium">Manage your external workspace links and AI assistants.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {/* Plugin 1 */}
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition group/item">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-5 h-5" />
                       </div>
                       <span className="font-bold text-sm">Google Chat Bridge</span>
                    </div>
                    <div className="w-10 h-5 bg-teal-500 rounded-full relative shadow-inner">
                       <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                 </div>
                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">Status: Connected to workspace account</p>
              </div>

              {/* Plugin 2 */}
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition opacity-60">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
                          <BrainCircuit className="w-5 h-5" />
                       </div>
                       <span className="font-bold text-sm italic">Curiosity Legacy</span>
                    </div>
                    <div className="w-10 h-5 bg-white/20 rounded-full relative">
                       <div className="absolute top-1 left-1 w-3 h-3 bg-white/50 rounded-full"></div>
                    </div>
                 </div>
                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">Status: Disconnected (V2 Pending)</p>
              </div>

              {/* Bot 1: System Reliability Bot */}
              <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/30 hover:bg-indigo-500/20 transition group/item col-span-1 md:col-span-2 ring-1 ring-indigo-500/20">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
                          <Bot className="w-6 h-6" />
                       </div>
                       <div>
                          <span className="font-bold text-base block">System Reliability Agent (Auto-Bot)</span>
                          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Active • Monitoring runtime errors</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-bold text-indigo-300">Live Repair Active</span>
                       <div className="w-12 h-6 bg-teal-500 rounded-full relative cursor-pointer shadow-lg shadow-teal-500/10">
                          <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"></div>
                       </div>
                    </div>
                 </div>
                 <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <p className="text-xs text-white/40 leading-relaxed max-w-lg italic font-medium">Automatically detects page timeouts or "500 Internal" errors and attempts a silent refresh or state restoration for Case Managers.</p>
                    <button className="px-4 py-1.5 bg-white/5 text-[10px] font-bold text-white uppercase tracking-widest rounded-lg border border-white/10 hover:bg-white/10 transition">Run Diagnostics</button>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
