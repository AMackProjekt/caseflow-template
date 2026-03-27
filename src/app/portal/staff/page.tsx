"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  CalendarDays,
  Clock,
  ArrowRight,
  FileText,
  Users,
  FileUp,
  Bot,
  Zap,
  ListTodo,
  CheckSquare,
  CalendarCheck,
  Timer,
  Plus,
  X,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Quote,
  UserCheck,
  Inbox,
  ShieldCheck,
  Video,
  ExternalLink,
  Brain,
  Wind,
  Music,
  Activity,
  Sparkles,
  Flame,
  Dumbbell,
  Info,
  Star
} from "lucide-react";
import { useStaff } from "@/context/StaffContext";
import IntegrationHub from "@/components/IntegrationHub";

const STAFF_QUOTES = [
  "The most important thing you can do for your clients is show up — fully, consistently, and with purpose.",
  "Every case note you write is an act of advocacy. Make it count.",
  "Burnout is real. Protect your energy so you can protect others.",
  "You are not just a caseworker — you are a bridge to possibility.",
  "Strong documentation today prevents crises tomorrow.",
  "Your compassion is a professional skill. Never apologize for it.",
  "The work is hard because the people matter.",
  "Every small win you celebrate with a client is a building block for their future.",
  "Consistency is the most underrated form of care.",
  "You chose this work. That says everything about your character.",
  "A warm handoff can change someone's entire trajectory.",
  "You don't have to have all the answers — just the commitment to find them.",
  "Your caseload is made of real people with real dreams. Never lose sight of that.",
  "Rest is part of the mission. You can't pour from an empty cup.",
  "The notes you take today are the evidence that someone's life changed.",
  "Excellence in service starts with clarity in purpose.",
  "Every referral you make is a seed planted. Some bloom later than you expect.",
  "Trauma-informed is not a buzzword — it's a commitment to seeing the whole person.",
  "Your follow-through builds the trust that your clients have never had before.",
  "Progress in case management is measured one milestone at a time.",
  "You are doing work that most people couldn't comprehend. Be proud of that.",
  "A single conversation can shift someone's belief that change is possible.",
  "Document the journey, not just the outcome. The process tells the full story.",
  "Meeting people where they are — that is the foundation of everything.",
  "Your presence in this work is making the invisible visible.",
];

type Priority = "high" | "med" | "low";
interface TodoItem { id: number; text: string; priority: Priority; done: boolean; }
const WORK_SECS = 25 * 60;
const BREAK_SECS = 5 * 60;

export default function MainDashboard() {
  const { participants, documents, caseNotes, notifications, requests, updateRequestStatus, team, mission } = useStaff();
  
  // Real Logic for Metrics
  const activeCount = participants.filter(p => (p as any).status.includes('Active')).length;
  const inProgressCount = participants.filter(p => (p as any).status === 'Active - SOP Audit').length;
  const placementCount = participants.filter(p => (p as any).status === 'Active - Housing Match').length;
  const pendingCount = requests.filter(r => (r as any).status === 'pending').length;
  const approvedCount = requests.filter(r => (r as any).status === 'approved').length;

  const [staffQuote, setStaffQuote] = useState(() => STAFF_QUOTES[Math.floor(Math.random() * STAFF_QUOTES.length)]);

  // ── Todos & Tasks ──────────────────────────────────────────────────────────
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: "Review SOP audit for current caseload", priority: "high", done: false },
    { id: 2, text: "Follow up on housing match placements", priority: "high", done: false },
    { id: 3, text: "Update participant progress notes", priority: "med", done: false },
    { id: 4, text: "Schedule team check-in meeting", priority: "low", done: false },
  ]);
  const [tasks, setTasks] = useState<TodoItem[]>([
    { id: 1, text: "Complete compliance documentation", priority: "high", done: false },
    { id: 2, text: "Submit monthly caseload report", priority: "high", done: false },
    { id: 3, text: "Review new participant intake files", priority: "med", done: false },
    { id: 4, text: "Update shared team calendar", priority: "low", done: false },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>("med");
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("med");

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: newTodo.trim(), priority: newTodoPriority, done: false }]);
    setNewTodo("");
  };
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask.trim(), priority: newTaskPriority, done: false }]);
    setNewTask("");
  };
  const toggleTodo = (id: number) => setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTodo = (id: number) => setTodos(prev => prev.filter(t => t.id !== id));
  const toggleTask = (id: number) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id: number) => setTasks(prev => prev.filter(t => t.id !== id));
  const priorityCounts = (items: TodoItem[]) => ({
    high: items.filter(t => t.priority === "high" && !t.done).length,
    med:  items.filter(t => t.priority === "med"  && !t.done).length,
    low:  items.filter(t => t.priority === "low"  && !t.done).length,
  });

  // ── Upcoming Events ────────────────────────────────────────────────────────
  const upcomingEvents = [
    { title: "Team Standup",           date: "Today",    time: "9:00 AM",  type: "team"       },
    { title: "SOP Audit Review",       date: "Tomorrow", time: "11:00 AM", type: "compliance" },
    { title: "Housing Partner Call",   date: "Mar 25",   time: "2:00 PM",  type: "external"   },
    { title: "Monthly Case Review",    date: "Mar 28",   time: "10:00 AM", type: "internal"   },
    { title: "Staff Training Session", date: "Mar 31",   time: "1:00 PM",  type: "training"   },
  ];
  const eventTypeColor: Record<string, string> = {
    team:       "bg-indigo-100 text-indigo-700",
    compliance: "bg-rose-100 text-rose-700",
    external:   "bg-teal-100 text-teal-700",
    internal:   "bg-amber-100 text-amber-700",
    training:   "bg-purple-100 text-purple-700",
  };

  // ── Pomodoro ───────────────────────────────────────────────────────────────
  const [pomMode, setPomMode] = useState<"work" | "break">("work");
  const [pomSeconds, setPomSeconds] = useState(WORK_SECS);
  const [pomRunning, setPomRunning] = useState(false);
  const [pomSessions, setPomSessions] = useState(0);
  const pomRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (pomRunning) {
      pomRef.current = setInterval(() => {
        setPomSeconds(s => {
          if (s <= 1) {
            clearInterval(pomRef.current!);
            const nextMode = pomMode === "work" ? "break" : "work";
            setPomMode(nextMode);
            setPomRunning(false);
            if (pomMode === "work") setPomSessions(n => n + 1);
            return nextMode === "work" ? WORK_SECS : BREAK_SECS;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(pomRef.current!);
    }
    return () => clearInterval(pomRef.current!);
  }, [pomRunning, pomMode]);

  const pomReset = () => { setPomRunning(false); setPomSeconds(WORK_SECS); setPomMode("work"); };
  const pomTotal = pomMode === "work" ? WORK_SECS : BREAK_SECS;
  const pomPct   = Math.round(((pomTotal - pomSeconds) / pomTotal) * 100);
  const pomMins  = String(Math.floor(pomSeconds / 60)).padStart(2, "0");
  const pomSecs  = String(pomSeconds % 60).padStart(2, "0");

  // ── Productivity Corner ───────────────────────────────────────────────────
  const [brainDump, setBrainDump] = useState("");
  const [breathStep, setBreathStep] = useState<"idle"|"inhale"|"hold1"|"exhale"|"hold2">("idle");
  const breathTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startBoxBreath = () => {
    if (breathStep !== "idle") return;
    breathTimers.current.forEach(clearTimeout);
    setBreathStep("inhale");
    breathTimers.current = [
      setTimeout(() => setBreathStep("hold1"),  4000),
      setTimeout(() => setBreathStep("exhale"), 8000),
      setTimeout(() => setBreathStep("hold2"),  12000),
      setTimeout(() => setBreathStep("idle"),   16000),
    ];
  };
  const AFFIRMATIONS_STAFF = [
    "I am making a real difference today.",
    "I show up fully for the people in my care.",
    "My work changes lives, even when I can't see it.",
    "I protect my energy so I can protect others.",
    "I am trauma-informed, compassionate, and effective.",
    "I am doing extraordinary work in ordinary moments.",
    "Rest is not laziness — it is how I stay effective.",
    "I lead with empathy and follow through with action.",
    "My consistency builds the trust my clients have never had.",
    "I chose this work because the people matter.",
  ];
  const [staffAffirmIdx, setStaffAffirmIdx] = useState(0);
  const STRETCHES = [
    "Roll your shoulders back 5 times. Breathe deep.",
    "Drop your chin slowly to your chest. Hold 10 sec.",
    "Reach both arms overhead. Stretch and hold 10 sec.",
    "Rotate your neck gently left-to-right 3 times.",
    "Stand up and shake out your hands and arms. Reset.",
    "Interlace fingers, push palms outward. Hold 10 sec.",
    "Look away from your screen. Focus far away 20 sec.",
  ];
  const [stretchIdx, setStretchIdx] = useState(0);
  const FOCUS_PLAYLISTS = [
    { name: "Lo-Fi Hip Hop",   url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", emoji: "🎧" },
    { name: "Ambient Focus",   url: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY", emoji: "🌊" },
    { name: "Deep Work Mix",   url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ", emoji: "🔥" },
    { name: "Nature Sounds",   url: "https://www.youtube.com/watch?v=eKFTSSKCzWA", emoji: "🌿" },
    { name: "Jazz for Focus",  url: "https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt", emoji: "🎷" },
  ];
  const DEBRIEF_PROMPTS = [
    "What's one win from today — big or small?",
    "What's one thing I'm intentionally leaving at work?",
    "How did I show up for my clients today?",
    "What would I do differently tomorrow?",
    "Who on my caseload deserves extra attention next shift?",
  ];
  const [debriefIdx, setDebriefIdx] = useState(0);
  const [debriefText, setDebriefText] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── HERO BAR ────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-charcoal-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#6366f1_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl -ml-16 -mb-16" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-8 bg-indigo-500 rounded-full" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">T.O.O.LS INC · Case Management</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic mb-2">
              Staff <span className="text-teal-400">Operations</span> Hub
            </h1>
            <p className="text-white/40 text-sm font-medium italic leading-relaxed border-l-2 border-indigo-500/50 pl-4 max-w-xl">
              "{mission}"
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link 
              href="https://sites.google.com/your-org-site" 
              target="_blank"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition"
            >
              Google Site <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/portal/staff/compliance"
              className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-charcoal-950 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition shadow-xl shadow-teal-500/20"
            >
              <ShieldCheck className="w-3 h-3" /> Compliance
            </Link>
          </div>
        </div>
        {/* Inline quick stats */}
        <div className="relative z-10 mt-6 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: "Active",     val: activeCount,          color: "text-teal-400" },
            { label: "Caseload",   val: participants.length,  color: "text-indigo-400" },
            { label: "Case Notes", val: caseNotes.length,     color: "text-purple-400" },
            { label: "Documents",  val: documents.length,     color: "text-blue-400" },
            { label: "Pending",    val: pendingCount,         color: "text-amber-400" },
            { label: "Approved",   val: approvedCount,        color: "text-emerald-400" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center">
              <p className={`text-xl font-black ${s.color} tracking-tighter`}>{s.val}</p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-tight mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── OPERATIONAL ROW: Team + Health + AI ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Team Snapshot */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-black text-sm text-charcoal-900 uppercase tracking-tight">Team</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {team.map((m, i) => (
              <div key={i} title={`${m.name} — ${m.role}`}
                className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-xl px-2.5 py-1.5 cursor-default hover:bg-indigo-100 transition">
                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[8px] font-black text-white">{m.name[0]}</div>
                <span className="text-[10px] font-bold text-indigo-800">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute inset-0" />
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              </div>
            </div>
            <h3 className="font-black text-sm text-charcoal-900 uppercase tracking-tight">System Health</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: "API Status",       status: "Online",     ok: true },
              { label: "Convex DB",        status: "Synced",     ok: true },
              { label: "Auth Provider",    status: "Active",     ok: true },
              { label: "File Storage",     status: "Healthy",    ok: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">{item.label}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Block compact */}
        <div className="bg-gradient-to-br from-charcoal-900 to-indigo-950 rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col gap-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-teal-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">AI Case Manager</h3>
              <p className="text-[10px] text-white/40 font-medium">Insight · Analysis · Bulk Actions</p>
            </div>
          </div>
          <p className="relative z-10 text-white/50 text-[11px] leading-relaxed italic">
            Run caseload analysis, generate follow-ups, and surface compliance gaps.
          </p>
          <Link href="/portal/staff/terminal" className="relative z-10 mt-auto px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-charcoal-950 font-black rounded-xl text-[10px] uppercase tracking-widest transition shadow-lg shadow-teal-500/20 text-center">
            Open AI Terminal →
          </Link>
        </div>
      </div>

      {/* ── STAFF QUOTE CARD ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-950 to-charcoal-900 rounded-[2rem] px-8 py-5 flex items-center justify-between gap-6 shadow-lg">
        <div className="flex items-start gap-4 min-w-0">
          <Quote className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-sm text-indigo-100 italic font-medium leading-relaxed">{staffQuote}</p>
        </div>
        <button
          onClick={() => setStaffQuote(STAFF_QUOTES[Math.floor(Math.random() * STAFF_QUOTES.length)])}
          title="New quote"
          className="shrink-0 text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition whitespace-nowrap"
        >
          <Zap className="w-3 h-3" /> New
        </button>
      </div>

      {/* ── INTEGRATION HUB ───────────────────────────────────────────────── */}
      <IntegrationHub role="staff" />

      {/* ── KPI WIDGET CARDS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TODOS */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="font-black text-sm text-charcoal-900 tracking-tight uppercase">Todos</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">{todos.filter(t => !t.done).length} open</span>
          </div>
          <div className="flex gap-2">
            <span className="flex-1 text-center py-1 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-black border border-rose-100">H {priorityCounts(todos).high}</span>
            <span className="flex-1 text-center py-1 rounded-lg bg-amber-50 text-amber-600 text-[11px] font-black border border-amber-100">M {priorityCounts(todos).med}</span>
            <span className="flex-1 text-center py-1 rounded-lg bg-slate-50 text-slate-500 text-[11px] font-black border border-slate-200">L {priorityCounts(todos).low}</span>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {todos.map(t => (
              <div key={t.id} className={`flex items-start gap-2 group ${t.done ? "opacity-40" : ""}`}>
                <button onClick={() => toggleTodo(t.id)} aria-label="Toggle todo" className="mt-0.5 shrink-0">
                  <CheckCircle2 className={`w-4 h-4 ${t.done ? "text-emerald-500" : "text-slate-200 group-hover:text-slate-300"}`} />
                </button>
                <span className={`text-[12px] flex-1 leading-snug ${t.done ? "line-through text-slate-400" : "text-slate-700"}`}>{t.text}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`text-[9px] font-black px-1.5 rounded-full ${
                    t.priority === "high" ? "bg-rose-100 text-rose-600" :
                    t.priority === "med"  ? "bg-amber-100 text-amber-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>{t.priority[0].toUpperCase()}</span>
                  <button onClick={() => removeTodo(t.id)} aria-label="Remove todo" className="opacity-0 group-hover:opacity-100 transition">
                    <X className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex gap-1">
              {(["high", "med", "low"] as Priority[]).map(p => (
                <button key={p} onClick={() => setNewTodoPriority(p)}
                  className={`flex-1 text-[10px] font-black py-1 rounded-lg uppercase tracking-wide transition ${
                    newTodoPriority === p
                      ? p === "high" ? "bg-rose-500 text-white" : p === "med" ? "bg-amber-500 text-white" : "bg-slate-500 text-white"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}>{p}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newTodo} onChange={e => setNewTodo(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTodo()} placeholder="Add todo…"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 bg-slate-50" />
              <button onClick={addTodo} aria-label="Add todo" className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* TASKS */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="font-black text-sm text-charcoal-900 tracking-tight uppercase">Tasks</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">{tasks.filter(t => !t.done).length} open</span>
          </div>
          <div className="flex gap-2">
            <span className="flex-1 text-center py-1 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-black border border-rose-100">H {priorityCounts(tasks).high}</span>
            <span className="flex-1 text-center py-1 rounded-lg bg-amber-50 text-amber-600 text-[11px] font-black border border-amber-100">M {priorityCounts(tasks).med}</span>
            <span className="flex-1 text-center py-1 rounded-lg bg-slate-50 text-slate-500 text-[11px] font-black border border-slate-200">L {priorityCounts(tasks).low}</span>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {tasks.map(t => (
              <div key={t.id} className={`flex items-start gap-2 group ${t.done ? "opacity-40" : ""}`}>
                <button onClick={() => toggleTask(t.id)} aria-label="Toggle task" className="mt-0.5 shrink-0">
                  <CheckCircle2 className={`w-4 h-4 ${t.done ? "text-emerald-500" : "text-slate-200 group-hover:text-slate-300"}`} />
                </button>
                <span className={`text-[12px] flex-1 leading-snug ${t.done ? "line-through text-slate-400" : "text-slate-700"}`}>{t.text}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`text-[9px] font-black px-1.5 rounded-full ${
                    t.priority === "high" ? "bg-rose-100 text-rose-600" :
                    t.priority === "med"  ? "bg-amber-100 text-amber-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>{t.priority[0].toUpperCase()}</span>
                  <button onClick={() => removeTask(t.id)} aria-label="Remove task" className="opacity-0 group-hover:opacity-100 transition">
                    <X className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex gap-1">
              {(["high", "med", "low"] as Priority[]).map(p => (
                <button key={p} onClick={() => setNewTaskPriority(p)}
                  className={`flex-1 text-[10px] font-black py-1 rounded-lg uppercase tracking-wide transition ${
                    newTaskPriority === p
                      ? p === "high" ? "bg-rose-500 text-white" : p === "med" ? "bg-amber-500 text-white" : "bg-slate-500 text-white"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}>{p}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newTask} onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Add task…"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-400 bg-slate-50" />
              <button onClick={addTask} aria-label="Add task" className="w-8 h-8 bg-teal-600 text-white rounded-xl flex items-center justify-center hover:bg-teal-700 transition shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* UPCOMING EVENTS */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-black text-sm text-charcoal-900 tracking-tight uppercase">Upcoming Events</h3>
          </div>
          <div className="space-y-1 flex-1 max-h-52 overflow-y-auto pr-1">
            {upcomingEvents.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="text-center shrink-0 w-14">
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-tight">{ev.date}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">{ev.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-charcoal-900 leading-snug truncate">{ev.title}</p>
                  <span className={`text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full ${eventTypeColor[ev.type]}`}>{ev.type}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-1 border-t border-slate-100">
            <Link href="/portal/staff/calendar" className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 flex items-center gap-1 transition">
              View Full Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* POMODORO */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pomMode === "work" ? "bg-indigo-50" : "bg-teal-50"}`}>
                {pomMode === "work" ? <Timer className="w-4 h-4 text-indigo-600" /> : <Coffee className="w-4 h-4 text-teal-600" />}
              </div>
              <div>
                <h3 className="font-black text-sm text-charcoal-900 tracking-tight uppercase">Pomodoro</h3>
                <p className="text-[10px] text-slate-400 leading-snug mt-0.5">Work 25 min, rest 5 min. Reduces mental fatigue &amp; sharpens focus.</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pomSessions, 4) }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-indigo-400" />
              ))}
              {pomSessions > 4 && <span className="text-[10px] font-black text-indigo-500 ml-1">+{pomSessions - 4}</span>}
            </div>
          </div>
          <div className={`text-center py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${pomMode === "work" ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-600"}`}>
            {pomMode === "work" ? "🎯 Focus Session" : "☕ Short Break"}
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className={`text-5xl font-black tracking-tighter tabular-nums ${pomMode === "work" ? "text-indigo-700" : "text-teal-600"}`}>
              {pomMins}:{pomSecs}
            </span>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${pomMode === "work" ? "bg-indigo-500" : "bg-teal-500"}`}
                style={{ width: `${pomPct}%` }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPomRunning(r => !r)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition shadow-sm ${
                pomMode === "work" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}>
              {pomRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {pomRunning ? "Pause" : "Start"}
            </button>
            <button onClick={pomReset} aria-label="Reset timer" className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center transition">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-medium">
            {pomSessions} session{pomSessions !== 1 ? "s" : ""} completed today
          </p>
        </div>

      </div>

      {/* ── STAFF WELLNESS & PRODUCTIVITY CORNER ─────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <h3 className="font-black text-sm text-charcoal-900 uppercase tracking-tight">Wellness &amp; Productivity Corner</h3>
              <p className="text-[10px] text-slate-400 font-medium">Recharge, refocus, and reset between sessions</p>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Brain Dump */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Brain Dump</h4>
              <span className="text-[9px] text-slate-400 font-medium">Clear your mind before a session</span>
            </div>
            <textarea
              value={brainDump}
              onChange={e => setBrainDump(e.target.value)}
              placeholder="Dump everything on your mind here — worries, tasks, random thoughts. Get it out so you can focus fully."
              className="w-full h-32 text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/60 resize-none focus:outline-none focus:border-indigo-300 focus:bg-white transition leading-relaxed"
            />
            <button
              onClick={() => setBrainDump("")}
              className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition"
            >
              ✕ Clear &amp; Release
            </button>
          </div>

          {/* Box Breathing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-500" />
              <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Box Breathing</h4>
              <span className="text-[9px] text-slate-400 font-medium">4-4-4-4 for calm &amp; clarity</span>
            </div>
            <div className={`rounded-xl p-5 text-center transition-all duration-700 ${
              breathStep === "idle"   ? "bg-slate-50 border border-slate-200" :
              breathStep === "inhale" ? "bg-blue-50 border border-blue-200" :
              breathStep === "hold1"  ? "bg-amber-50 border border-amber-200" :
              breathStep === "exhale" ? "bg-teal-50 border border-teal-200" :
              "bg-purple-50 border border-purple-200"
            }`}>
              <p className="text-3xl mb-1.5">
                {breathStep === "idle" ? "🌬️" : breathStep === "inhale" ? "⬆️" : breathStep === "hold1" ? "⏸️" : breathStep === "exhale" ? "⬇️" : "⏸️"}
              </p>
              <p className={`text-xs font-black uppercase tracking-widest ${
                breathStep === "idle"   ? "text-slate-400" :
                breathStep === "inhale" ? "text-blue-600" :
                breathStep === "hold1"  ? "text-amber-600" :
                breathStep === "exhale" ? "text-teal-600" : "text-purple-600"
              }`}>
                {breathStep === "idle" ? "Ready when you are" :
                 breathStep === "inhale" ? "Inhale… 4 counts" :
                 breathStep === "hold1"  ? "Hold… 4 counts" :
                 breathStep === "exhale" ? "Exhale… 4 counts" : "Hold… 4 counts"}
              </p>
            </div>
            <button
              onClick={startBoxBreath}
              disabled={breathStep !== "idle"}
              className="w-full text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {breathStep === "idle" ? "Begin Breath Cycle" : "Breathing…"}
            </button>
          </div>

          {/* Focus Playlists */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-500" />
              <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Focus Playlists</h4>
              <span className="text-[9px] text-slate-400 font-medium">Music for deep work</span>
            </div>
            <div className="space-y-2">
              {FOCUS_PLAYLISTS.map((pl, i) => (
                <a key={i} href={pl.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition text-xs font-bold text-charcoal-900 group"
                >
                  <span className="text-base">{pl.emoji}</span>
                  <span className="flex-1">{pl.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-purple-500 transition" />
                </a>
              ))}
            </div>
          </div>

          {/* Micro Stretch */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Micro Stretch</h4>
              <span className="text-[9px] text-slate-400 font-medium">30-sec desk breaks</span>
            </div>
            <div className="p-5 bg-amber-50 rounded-xl border border-amber-100 text-center">
              <p className="text-3xl mb-2">🤸</p>
              <p className="text-sm font-bold text-charcoal-900 leading-snug">{STRETCHES[stretchIdx]}</p>
            </div>
            <button
              onClick={() => setStretchIdx(i => (i + 1) % STRETCHES.length)}
              className="w-full text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition"
            >
              Next Stretch →
            </button>
          </div>

          {/* Staff Affirmation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Your Affirmation</h4>
              <span className="text-[9px] text-slate-400 font-medium">Tap to refresh</span>
            </div>
            <div className="p-5 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100 min-h-[88px] flex items-center justify-center">
              <p className="text-sm text-center font-bold text-rose-800 italic leading-snug">
                &ldquo;{AFFIRMATIONS_STAFF[staffAffirmIdx]}&rdquo;
              </p>
            </div>
            <button
              onClick={() => setStaffAffirmIdx(i => (i + 1) % AFFIRMATIONS_STAFF.length)}
              className="w-full text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition"
            >
              New Affirmation ✦
            </button>
          </div>

          {/* Shift Debrief */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Shift Debrief</h4>
              <span className="text-[9px] text-slate-400 font-medium">Reflect before you log off</span>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-wider mb-2">Prompt {debriefIdx + 1}/{DEBRIEF_PROMPTS.length}</p>
              <p className="text-xs font-bold text-charcoal-900 leading-snug">{DEBRIEF_PROMPTS[debriefIdx]}</p>
            </div>
            <textarea
              value={debriefText}
              onChange={e => setDebriefText(e.target.value)}
              placeholder="Your reflection…"
              className="w-full h-16 text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/60 resize-none focus:outline-none focus:border-orange-300 focus:bg-white transition"
            />
            <button
              onClick={() => { setDebriefIdx(i => (i + 1) % DEBRIEF_PROMPTS.length); setDebriefText(""); }}
              className="w-full text-[11px] font-black uppercase tracking-widest py-2 rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition"
            >
              Next Prompt →
            </button>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Roadmap & Live Approval Hub */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Caseload Roadmap... (Existing) */}

          {/* LIVE APPROVAL HUB */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col group/hub">
             <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div>
                   <h3 className="font-black text-xl text-charcoal-900 flex items-center gap-3 tracking-tighter">
                      <Clock className="w-6 h-6 text-indigo-500" />
                      Live Approval Queue
                   </h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pending Participant Requests</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending Review</span>
                </div>
             </div>

             <div className="p-0 divide-y divide-slate-50">
                {requests.filter(r => r.status === 'pending').map((req, i) => (
                   <div key={i} className="p-8 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm border border-indigo-100 shadow-sm">
                            {req.client.split(' ')[0][0]}{req.client.split(' ').slice(-1)[0][0]}
                         </div>
                         <div>
                            <p className="text-sm font-black text-charcoal-900 tracking-tight">{req.client}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5">
                               <span className="text-[10px] font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-widest">{req.type}</span>
                               <span className="text-[11px] text-slate-400 font-medium italic">"{req.note}"</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <button 
                           onClick={() => updateRequestStatus(req._id, 'denied')}
                           className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95"
                         >
                            Deny
                         </button>
                         <button 
                           onClick={() => updateRequestStatus(req._id, 'approved')}
                           className="px-8 py-2.5 bg-emerald-600 text-white font-black rounded-xl text-[11px] uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                         >
                            Approve
                         </button>
                      </div>
                   </div>
                ))}
                {requests.filter(r => r.status === 'pending').length === 0 && (
                   <div className="py-20 text-center text-slate-300">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-slate-100" />
                      <p className="text-sm font-bold text-slate-400 italic font-serif">Queue Clear. No pending requests from participants.</p>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Activity Feed (Blank) */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-md overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-8 py-8 border-b border-slate-50">
              <h3 className="font-black text-xl text-charcoal-900 tracking-tighter flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-teal-500" />
                Recent Activity
              </h3>
            </div>
            <div className="p-10 flex-1 flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-16 h-16 bg-teal-50 text-teal-200 rounded-2xl flex items-center justify-center border border-teal-100 rotate-12">
                  <FileText className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-400 italic">No interaction logs detected yet.</p>
                  <Link href="/portal/staff/casenote/new" className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-2 block hover:underline">Start a log manually</Link>
               </div>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
              <Link href="/portal/staff/caseload" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 flex items-center justify-center gap-2 transition">
                Explore Full Roster <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
