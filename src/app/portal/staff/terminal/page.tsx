"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, ChevronRight, Zap, ShieldAlert, Cpu, FileText } from "lucide-react";
import { useStaff } from "@/context/StaffContext";

export default function TerminalPage() {
  const { participants, caseNotes, documents } = useStaff();
  const checkInFormUrl = "https://forms.cloud.microsoft/Pages/DesignPageV2.aspx?subpage=design&token=6ec69437e59a458687568715bd02e703&id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAAZQOUnpUNzdFMjk2VDVTSVBIQU80QlBBMkpYMVk3US4u&analysis=true";
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "PowerShell 7.4.1",
    "(c) Microsoft Corporation. All rights reserved.",
    "",
    "D-MACK Workbench (V8_CORE-9) - Restricted Execution Mode",
    "Real Terminal Logic [PWSH 7.4] Session Attached.",
    ""
  ]);
  
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const newHistory = [...history, `PS C:\\Users\\donyalemack> ${input}`];
    
    if (cmd.toLowerCase() === 'clear') {
       setHistory([]);
       setInput("");
       return;
    }

    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await response.json();

      if (!response.ok) {
        newHistory.push(`ERROR ${response.status}: ${data?.error ?? "Terminal request failed."}`);
      } else if (data.output) {
        newHistory.push(...data.output.split('\n'));
      } else {
        newHistory.push("No output returned.");
      }
    } catch (err) {
      newHistory.push(`ERROR: API Connectivity failure. Local logic offline.`);
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-charcoal-900 border border-teal-500/20 text-teal-400 rounded-lg">
            <TerminalIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-charcoal-900 flex items-center gap-2">
              PowerShell <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full tracking-tighter">V7.4.1</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Real-time local machine logic engine. No mock layers.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> V8 Core Ready</span>
          <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-teal-500" /> Admin Restricted</span>
          <span className="flex items-center gap-1.5 text-blue-600 underline font-bold cursor-pointer" onClick={() => window.open(checkInFormUrl, '_blank')}>
            <FileText className="w-4 h-4" /> Open MSFT Check-In Form
          </span>
        </div>
      </div>

      <div className="flex-1 bg-charcoal-950 rounded-3xl border border-charcoal-800 shadow-2xl relative overflow-hidden flex flex-col font-mono text-sm group">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] pointer-events-none group-hover:bg-teal-500/10 transition-colors duration-1000"></div>
        
        {/* Terminal Output */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-8 space-y-0.5 text-slate-300 relative z-10 custom-scrollbar scroll-smooth"
        >
          {history.map((line, i) => (
            <div key={i} className={line.startsWith('PS') ? "text-teal-400 font-bold mt-2" : line.includes('ERROR') ? "text-rose-500 font-bold" : ""}>
              {line}
            </div>
          ))}
          <div className="h-4 w-full"></div>
        </div>

        {/* Input Prompt */}
        <div className="p-6 bg-charcoal-900/50 backdrop-blur-md border-t border-charcoal-800 relative z-10">
          <form onSubmit={handleCommand} className="flex items-center gap-3">
            <span className="text-teal-500 font-bold shrink-0">PS C:\Users\donyalemack&gt;</span>
            <input 
              type="text" 
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter PowerShell command..."
              className="flex-1 bg-transparent border-none outline-none text-teal-50 font-mono placeholder:text-charcoal-700"
            />
          </form>
        </div>
      </div>

      {/* Quick Tooltip */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setInput("$PSVersionTable")} className="text-[10px] font-bold px-3 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-charcoal-900 transition uppercase tracking-widest">Version</button>
        <button onClick={() => setInput("Get-Process")} className="text-[10px] font-bold px-3 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-charcoal-900 transition uppercase tracking-widest">Active Processes</button>
        <button onClick={() => setInput("Git Status")} className="text-[10px] font-bold px-3 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-charcoal-900 transition uppercase tracking-widest">Git Status</button>
        <button onClick={() => setInput("ls")} className="text-[10px] font-bold px-3 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-charcoal-900 transition uppercase tracking-widest">List Directories</button>
        <button 
          onClick={() => window.open(checkInFormUrl, '_blank')}
          id="msft-intake-form"
          className="text-[10px] font-bold px-3 py-1.5 bg-indigo-600 text-white border border-indigo-700 rounded-lg hover:bg-indigo-700 transition uppercase tracking-wider shadow-lg shadow-indigo-500/20"
        >
          MSFT Check-In Form 🔗
        </button>
      </div>
    </div>
  );
}
