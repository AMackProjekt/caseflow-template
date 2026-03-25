"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Video, 
  Link as LinkIcon, 
  CheckCircle2, 
  Bot, 
  Send,
  Zap,
  MoreVertical,
  Settings2,
  RefreshCw
} from "lucide-react";

export default function CalendarIntegrations() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: 'agent', content: "Hello. I can help with workflow summaries, scheduling, and operational follow-ups using UID-only references." }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages([...chatMessages, { role: 'user', content: chatInput }]);
    setChatInput("");
    setChatMessages(prev => [...prev, { 
      role: 'agent', 
      content: "AI integration is not yet connected. Check back once the workflow backend is configured."
    }]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Calendar & Integrations</h1>
          <p className="text-slate-500 mt-1">Unified scheduling and automated workflow orchestration.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-all ${activeTab === 'calendar' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-slate-500 hover:text-charcoal-700'}`}
          >
            My Schedule
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-all ${activeTab === 'integrations' ? 'bg-white text-charcoal-900 shadow-sm' : 'text-slate-500 hover:text-charcoal-700'}`}
          >
            Connected Apps
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'calendar' ? (
            /* CALENDAR TAB */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-charcoal-900">Today's Agenda</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">Live</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Outlook Sink
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Google Sync
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Event 1 (Google) */}
                <div className="p-6 hover:bg-slate-50 transition border-l-4 border-l-emerald-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-charcoal-900 text-lg">Housing Program Coordination Zoom</h4>
                      <div className="mt-2 space-y-1.5">
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" /> 10:00 AM - 11:30 AM
                        </p>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <Video className="w-4 h-4 text-slate-400" /> Google Meet (Invited via Workspace)
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg text-sm border border-emerald-200 hover:bg-emerald-100 transition">
                      Join Call
                    </button>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold">Client: UID-A3</span>
                  </div>
                </div>

                {/* Event 2 (Outlook) */}
                <div className="p-6 hover:bg-slate-50 transition border-l-4 border-l-blue-500 bg-blue-50/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-charcoal-900 text-lg">Staff Strategy Huddle</h4>
                      <div className="mt-2 space-y-1.5">
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" /> 1:00 PM - 2:00 PM
                        </p>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" /> Main Office Boardroom
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">via Outlook Teams</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* INTEGRATIONS TAB */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Google Workspace */}
                <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm flex flex-col justify-between group hover:border-emerald-400 transition">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-100 transition">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-900 flex items-center gap-2">
                        Google Workspace
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-tighter">Active</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Calendar, Meet, Docs, and Google Chat.</p>
                    </div>
                  </div>
                  <button className="w-full py-2 border border-slate-100 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition text-xs uppercase tracking-widest">Connect Drive & Notes</button>
                </div>

                {/* Microsoft Office 365 */}
                <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm flex flex-col justify-between group hover:border-blue-400 transition">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-100 transition">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.55 21H3v-8.55h8.55V21zM21 21h-8.55v-8.55H21V21zm-9.45-9.45H3V3h8.55v8.55zm9.45 0h-8.55V3H21v8.55z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-900 flex items-center gap-2">
                        MSFT Office 365
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-tighter">Active</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Outlook, Teams, and OneNote.</p>
                    </div>
                  </div>
                  <button className="w-full py-2 border border-slate-100 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-blue-50 hover:text-blue-700 transition text-xs uppercase tracking-widest">Connect OneDrive</button>
                </div>

                {/* Curiosity Intelligence */}
                <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between group hover:border-amber-400 transition">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-amber-100 transition">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-900 flex items-center gap-2">
                        curiosity
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-tighter">Active</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Deep search & contextual linking.</p>
                    </div>
                  </div>
                  <button className="w-full py-2 border border-slate-100 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-amber-50 hover:text-amber-700 transition text-xs uppercase tracking-widest">Sync Search Hub</button>
                </div>

                {/* OpenAI / ChatGPT */}
                <div className="bg-white p-6 rounded-2xl border border-slate-900/10 shadow-sm flex flex-col justify-between group hover:border-slate-900/30 transition">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg transition">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-900 flex items-center gap-2">
                        ChatGPT OpenAI
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-tighter">Active</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">AI drafting and SOP analysis.</p>
                    </div>
                  </div>
                  <button className="w-full py-2 border border-slate-100 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition text-xs uppercase tracking-widest">Settings & Tokens</button>
                </div>
              </div>

              {/* Microsoft Forms & AppScripts */}
              <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 text-teal-400 rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:rotate-6 transition-transform">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Advanced Workflow Automation</h2>
                      <p className="text-indigo-100/70 text-sm max-w-lg leading-relaxed">Microsoft Forms and Google AppScripts are connected for workflow automation with UID-only processing standards.</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Webhooks: Online
                        </span>
                        <span className="px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> SOP Check: Enabled
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-2xl transition-all shadow-xl shadow-teal-500/30 hover:scale-105 active:scale-95 whitespace-nowrap">
                    Orchestrate Scripts
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* AI AGENT SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full min-h-[600px] relative">
            
            {/* Fancy Glow Backgrounds */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none"></div>

            <div className="p-5 border-b border-slate-800 flex items-center justify-between relative z-10 bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">CaseFlow AI Agent</h3>
                  <p className="text-xs font-medium text-teal-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span> AppScripts Online
                  </p>
                </div>
              </div>
              <button title="More options" className="p-2 text-slate-400 hover:text-white transition">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5 relative z-10 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`text-xs font-semibold mb-1.5 px-1 tracking-wide ${msg.role === 'user' ? 'text-slate-400' : 'text-indigo-400'}`}>
                    {msg.role === 'user' ? 'MACK' : 'AGENT'}
                  </div>
                  <div className={`px-4 py-3 text-sm max-w-[90%] font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl rounded-tr-sm' 
                      : 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-50 rounded-2xl rounded-tl-sm shadow-inner'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/80 border-t border-slate-800 relative z-10 backdrop-blur-xl">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about a client, script, or form..." 
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition text-sm"
                />
                <button type="submit" title="Send message" disabled={!chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 disabled:opacity-50 disabled:hover:bg-teal-600 transition shadow-lg shadow-teal-500/20">
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                <button type="button" onClick={() => setChatInput("Look up D10 in Microsoft Forms")} className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition whitespace-nowrap bg-slate-800/50">
                  Lookup Form Data
                </button>
                <button type="button" onClick={() => setChatInput("Draft email using AppScripts for UID-A3")} className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition whitespace-nowrap bg-slate-800/50">
                  Run AppScript
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
