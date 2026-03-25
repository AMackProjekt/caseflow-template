"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface App {
  name: string;
  desc: string;
  url: string;
  bg: string;         // Tailwind bg class
  text: string;       // Tailwind text class
  logo: string;       // Short label / emoji / initial shown in icon box
  badge?: string;     // Optional small badge text
}

// ── App definitions ──────────────────────────────────────────────────────────
const GOOGLE_STAFF: App[] = [
  { name: "Gmail",           desc: "Org email",              url: "https://mail.google.com",                      bg: "bg-red-50",    text: "text-red-600",    logo: "M" },
  { name: "Calendar",        desc: "Schedule & events",      url: "https://calendar.google.com",                  bg: "bg-blue-50",   text: "text-blue-600",   logo: "📅" },
  { name: "Drive",           desc: "Cloud file storage",     url: "https://drive.google.com",                     bg: "bg-yellow-50", text: "text-yellow-700", logo: "△" },
  { name: "Meet",            desc: "Video calls",            url: "https://meet.google.com",                      bg: "bg-green-50",  text: "text-green-700",  logo: "📹" },
  { name: "Docs",            desc: "Word processing",        url: "https://docs.google.com",                      bg: "bg-blue-50",   text: "text-blue-700",   logo: "D" },
  { name: "Sheets",          desc: "Spreadsheets",           url: "https://sheets.google.com",                    bg: "bg-emerald-50",text: "text-emerald-700",logo: "S" },
  { name: "Forms",           desc: "Surveys & intake forms", url: "https://forms.google.com",                     bg: "bg-purple-50", text: "text-purple-700", logo: "F" },
  { name: "Slides",          desc: "Presentations",          url: "https://slides.google.com",                    bg: "bg-orange-50", text: "text-orange-700", logo: "P" },
  { name: "Internal Site",       desc: "Internal org site",      url: "https://sites.google.com/your-org-site", bg: "bg-teal-50", text: "text-teal-700", logo: "🏠", badge: "ORG" },
  { name: "Workspace Admin", desc: "User & app management",  url: "https://admin.google.com",                     bg: "bg-slate-100", text: "text-slate-700",  logo: "⚙" },
  { name: "Gemini",          desc: "Google AI assistant",    url: "https://gemini.google.com",                    bg: "bg-violet-50", text: "text-violet-700", logo: "✦" },
  { name: "Keep",            desc: "Notes & reminders",      url: "https://keep.google.com",                      bg: "bg-yellow-50", text: "text-yellow-700", logo: "📝" },
];

const GOOGLE_CLIENT: App[] = [
  { name: "Gmail",      desc: "Your email",             url: "https://mail.google.com",      bg: "bg-red-50",    text: "text-red-600",    logo: "M" },
  { name: "Calendar",   desc: "View your appointments", url: "https://calendar.google.com",  bg: "bg-blue-50",   text: "text-blue-600",   logo: "📅" },
  { name: "Drive",      desc: "Your files & documents", url: "https://drive.google.com",     bg: "bg-yellow-50", text: "text-yellow-700", logo: "△" },
  { name: "Meet",       desc: "Video call your CM",     url: "https://meet.google.com",      bg: "bg-green-50",  text: "text-green-700",  logo: "📹" },
  { name: "Maps",       desc: "Find services near you", url: "https://maps.google.com",      bg: "bg-blue-50",   text: "text-blue-700",   logo: "🗺" },
  { name: "YouTube",    desc: "Learning & skills",      url: "https://youtube.com",          bg: "bg-red-50",    text: "text-red-700",    logo: "▶" },
  { name: "Translate",  desc: "Language support",       url: "https://translate.google.com", bg: "bg-sky-50",    text: "text-sky-700",    logo: "T" },
  { name: "Keep",       desc: "Notes & reminders",      url: "https://keep.google.com",      bg: "bg-yellow-50", text: "text-yellow-700", logo: "📝" },
];

const MICROSOFT_STAFF: App[] = [
  { name: "Outlook",     desc: "Email & calendar",      url: process.env.NEXT_PUBLIC_OUTLOOK_URL ?? "https://outlook.office.com",          bg: "bg-blue-50",   text: "text-blue-700",   logo: "O" },
  { name: "Teams",       desc: "Chat & meetings",       url: process.env.NEXT_PUBLIC_TEAMS_URL  ?? "https://teams.microsoft.com",           bg: "bg-indigo-50", text: "text-indigo-700", logo: "T" },
  { name: "OneDrive",    desc: "Cloud storage",         url: "https://onedrive.live.com",                                                   bg: "bg-sky-50",    text: "text-sky-700",    logo: "☁" },
  { name: "SharePoint",  desc: "Team file sharing",     url: process.env.NEXT_PUBLIC_SHAREPOINT_URL ?? "https://sharepoint.com",            bg: "bg-teal-50",   text: "text-teal-700",   logo: "S" },
  { name: "Word Online", desc: "Documents",             url: "https://office.live.com/start/Word.aspx",                                     bg: "bg-blue-50",   text: "text-blue-800",   logo: "W" },
  { name: "Excel Online",desc: "Spreadsheets",          url: "https://office.live.com/start/Excel.aspx",                                    bg: "bg-emerald-50",text: "text-emerald-800",logo: "X" },
  { name: "PowerPoint",  desc: "Presentations",         url: "https://office.live.com/start/PowerPoint.aspx",                               bg: "bg-orange-50", text: "text-orange-700", logo: "P" },
  { name: "OneNote",     desc: "Notebooks & notes",     url: "https://onenote.com",                                                         bg: "bg-purple-50", text: "text-purple-700", logo: "N" },
  { name: "Copilot",     desc: "Microsoft AI assistant",url: "https://copilot.microsoft.com",                                               bg: "bg-sky-50",    text: "text-sky-700",    logo: "✦", badge: "AI" },
  { name: "Forms",       desc: "Org surveys & quizzes", url: "https://forms.microsoft.com",                                                 bg: "bg-violet-50", text: "text-violet-700", logo: "F" },
  { name: "Planner",     desc: "Task management",       url: "https://tasks.office.com",                                                    bg: "bg-green-50",  text: "text-green-700",  logo: "📋" },
  { name: "Power BI",    desc: "Data dashboards",       url: "https://app.powerbi.com",                                                     bg: "bg-yellow-50", text: "text-yellow-700", logo: "📊" },
];

const MICROSOFT_CLIENT: App[] = [
  { name: "Outlook",    desc: "Email",               url: "https://outlook.live.com",       bg: "bg-blue-50",   text: "text-blue-700",   logo: "O" },
  { name: "Teams",      desc: "Chat & video",        url: process.env.NEXT_PUBLIC_TEAMS_URL ?? "https://teams.microsoft.com", bg: "bg-indigo-50", text: "text-indigo-700", logo: "T" },
  { name: "OneDrive",   desc: "Store your files",    url: "https://onedrive.live.com",      bg: "bg-sky-50",    text: "text-sky-700",    logo: "☁" },
  { name: "Word Online",desc: "Write documents",     url: "https://office.live.com/start/Word.aspx", bg: "bg-blue-50", text: "text-blue-800", logo: "W" },
  { name: "Excel",      desc: "Budgets & tracking",  url: "https://office.live.com/start/Excel.aspx", bg: "bg-emerald-50", text: "text-emerald-800", logo: "X" },
  { name: "Copilot",    desc: "AI assistant",        url: "https://copilot.microsoft.com",  bg: "bg-sky-50",    text: "text-sky-700",    logo: "✦", badge: "AI" },
];

const PRODUCTIVITY_STAFF: App[] = [
  { name: "Zoom",          desc: "Video meetings",        url: process.env.NEXT_PUBLIC_ZOOM_URL ?? "https://zoom.us/join", bg: "bg-blue-50",   text: "text-blue-700",   logo: "Z" },
  { name: "Notion",        desc: "Docs & databases",      url: "https://notion.so",                                        bg: "bg-slate-100", text: "text-slate-800",  logo: "N" },
  { name: "Slack",         desc: "Team messaging",        url: "https://slack.com",                                        bg: "bg-purple-50", text: "text-purple-700", logo: "S" },
  { name: "Canva",          desc: "Flyers & graphics",     url: "https://canva.com",              bg: "bg-violet-50", text: "text-violet-700", logo: "C" },
  { name: "Adobe Express",  desc: "Quick design & flyers",  url: "https://express.adobe.com",     bg: "bg-red-50",    text: "text-red-700",    logo: "Ae" },
  { name: "Adobe Acrobat",  desc: "PDF editing & forms",    url: "https://acrobat.adobe.com",     bg: "bg-red-50",    text: "text-red-800",    logo: "Ac" },
  { name: "Adobe Sign",     desc: "e-Signatures & approvals",url: "https://acrobat.adobe.com/sign", bg: "bg-red-50",    text: "text-red-700",    logo: "✍", badge: "Sign" },
  { name: "DocuSign",      desc: "e-Signatures",          url: "https://docusign.com",                                     bg: "bg-yellow-50", text: "text-yellow-700", logo: "✍" },
  { name: "Typeform",      desc: "Beautiful forms",       url: "https://typeform.com",                                     bg: "bg-blue-50",   text: "text-blue-600",   logo: "T" },
  { name: "Loom",          desc: "Screen recording",      url: "https://loom.com",                                         bg: "bg-violet-50", text: "text-violet-700", logo: "🎥" },
  { name: "ChatGPT",       desc: "OpenAI assistant",      url: "https://chatgpt.com",                                      bg: "bg-emerald-50",text: "text-emerald-700",logo: "✦", badge: "AI" },
  { name: "LinkedIn",      desc: "Professional network",  url: "https://linkedin.com",                                     bg: "bg-blue-50",   text: "text-blue-800",   logo: "in" },
  { name: "Cal.com",       desc: "Scheduling links",      url: "https://cal.com",                                          bg: "bg-teal-50",   text: "text-teal-700",   logo: "📅" },
  { name: "Dropbox",       desc: "File sync & sharing",   url: "https://dropbox.com",                                      bg: "bg-blue-50",   text: "text-blue-700",   logo: "D" },
  { name: "LastPass",      desc: "Password manager",      url: "https://lastpass.com",                                     bg: "bg-red-50",    text: "text-red-700",    logo: "🔑" },
];

const PRODUCTIVITY_CLIENT: App[] = [
  { name: "Zoom",         desc: "Video call",            url: process.env.NEXT_PUBLIC_ZOOM_URL ?? "https://zoom.us/join", bg: "bg-blue-50",   text: "text-blue-700",   logo: "Z" },
  { name: "Indeed",       desc: "Find jobs",             url: "https://indeed.com",                                        bg: "bg-sky-50",    text: "text-sky-700",    logo: "i" },
  { name: "LinkedIn",     desc: "Professional profile",  url: "https://linkedin.com",                                      bg: "bg-blue-50",   text: "text-blue-800",   logo: "in" },
  { name: "CareerOneStop",desc: "Workforce resources",   url: "https://careeronestop.org",                                 bg: "bg-green-50",  text: "text-green-700",  logo: "C" },
  { name: "Benefits.gov", desc: "Benefit programs",      url: "https://benefits.gov",                                      bg: "bg-amber-50",  text: "text-amber-700",  logo: "★" },
  { name: "211 San Diego",desc: "Community resources",   url: "https://211sandiego.org",                                   bg: "bg-teal-50",   text: "text-teal-700",   logo: "211" },
  { name: "Khan Academy", desc: "Free education",        url: "https://khanacademy.org",                                   bg: "bg-green-50",  text: "text-green-700",  logo: "K" },
  { name: "ChatGPT",      desc: "AI writing help",       url: "https://chatgpt.com",           bg: "bg-emerald-50",text: "text-emerald-700",logo: "✦", badge: "AI" },
  { name: "Adobe Express", desc: "Free design tool",       url: "https://express.adobe.com",     bg: "bg-red-50",    text: "text-red-700",    logo: "Ae" },
  { name: "Canva",         desc: "Resumes & flyers",       url: "https://canva.com",             bg: "bg-violet-50", text: "text-violet-700", logo: "C" },
];

// ── Subcomponent: App Card ───────────────────────────────────────────────────
function AppCard({ app }: { app: App }) {
  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-300 hover:shadow-md transition-all active:scale-95"
    >
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${app.bg} ${app.text} shrink-0`}>
          {app.logo}
        </div>
        <div className="flex items-center gap-1">
          {app.badge && (
            <span className="text-[9px] font-black px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded-full uppercase tracking-wide">
              {app.badge}
            </span>
          )}
          <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition" />
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-800 leading-tight">{app.name}</p>
        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{app.desc}</p>
      </div>
    </a>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
interface Props {
  role: "staff" | "client";
}

type Tab = "google" | "microsoft" | "productivity";

const TAB_META: Record<Tab, { label: string; color: string; activeBg: string; activeText: string }> = {
  google:       { label: "Google Workspace",  color: "text-slate-500", activeBg: "bg-[#4285F4]", activeText: "text-white" },
  microsoft:    { label: "Microsoft 365",     color: "text-slate-500", activeBg: "bg-[#0078D4]", activeText: "text-white" },
  productivity: { label: "Productivity",      color: "text-slate-500", activeBg: "bg-slate-800",  activeText: "text-white" },
};

export default function IntegrationHub({ role }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("google");
  const [collapsed, setCollapsed] = useState(false);

  const apps: Record<Tab, App[]> = {
    google:       role === "staff" ? GOOGLE_STAFF       : GOOGLE_CLIENT,
    microsoft:    role === "staff" ? MICROSOFT_STAFF    : MICROSOFT_CLIENT,
    productivity: role === "staff" ? PRODUCTIVITY_STAFF : PRODUCTIVITY_CLIENT,
  };

  const currentApps = apps[activeTab];

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {/* Google G */}
            <span className="w-5 h-5 rounded-full bg-[#4285F4] flex items-center justify-center text-white text-[9px] font-black">G</span>
            {/* Microsoft */}
            <span className="w-5 h-5 rounded-none grid grid-cols-2 gap-[1px] overflow-hidden">
              <span className="bg-[#F25022]" />
              <span className="bg-[#7FBA00]" />
              <span className="bg-[#00A4EF]" />
              <span className="bg-[#FFB900]" />
            </span>
          </div>
          <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">
            Integration Hub
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
            Google · Microsoft · Productivity
          </span>
        </div>
        {collapsed
          ? <ChevronDown className="w-4 h-4 text-slate-400" />
          : <ChevronUp   className="w-4 h-4 text-slate-400" />}
      </button>

      {!collapsed && (
        <div className="px-6 pb-6 space-y-4">
          {/* Tab bar */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {(Object.entries(TAB_META) as [Tab, typeof TAB_META[Tab]][]).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wide transition ${
                  activeTab === key
                    ? `${meta.activeBg} ${meta.activeText} shadow`
                    : `${meta.color} hover:bg-white`
                }`}
              >
                {meta.label}
              </button>
            ))}
          </div>

          {/* App grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {currentApps.map((app) => (
              <AppCard key={app.name} app={app} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
