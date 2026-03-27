import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Users,
  FileText,
  MessageSquare,
  CalendarDays,
  BarChart3,
  Gem,
  WifiOff,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, label: "HIPAA Compliant", desc: "End-to-end encryption and PHI workflow approvals baked in." },
  { icon: Users, label: "Caseload Management", desc: "Full client roster, demographics, housing matches, and status tracking." },
  { icon: FileText, label: "Secure Documents", desc: "Upload, store, and share files with role-gated access controls." },
  { icon: MessageSquare, label: "Google Chat Built-In", desc: "Real-time messaging with clients and team through Google Workspace." },
  { icon: CalendarDays, label: "Scheduling & Calendar", desc: "F2F visits, appointments, and staff schedules in one place." },
  { icon: BarChart3, label: "Demographics & Analytics", desc: "Live breakdowns across gender, housing status, employment, and more." },
  { icon: Gem, label: "Champion Admin", desc: "Supervisor-level oversight — audit logs, compliance, personnel, and integrations." },
  { icon: WifiOff, label: "Offline Access", desc: "Client portal works offline after first sign-in — no connection needed." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 md:px-12 h-16 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-900/40">
            <span className="text-teal-950 font-black text-[10px] tracking-tight">CF</span>
          </div>
          <span className="font-bold text-white text-sm leading-none">CaseFlow Operations</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login/client" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
            Participant Sign In
          </Link>
          <Link
            href="/login/staff"
            className="bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Staff Sign In
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-950 border border-teal-800/60 text-teal-400 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
            <ShieldCheck className="w-3 h-3" />
            HIPAA-Compliant Case Management Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="text-white">Case management</span>
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">
              built for Dreams
            </span>
            <br />
            <span className="text-white">For Change.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            One secure platform connecting case managers, participants, and supervisors —
            with real-time data, offline access, and Google &amp; Microsoft integrations.
          </p>

          {/* Portal entry cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            {/* Client */}
            <Link
              href="/login/client"
              className="group flex flex-col items-center gap-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-700/60 rounded-2xl p-6 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/25 transition-colors">
                <Users className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="font-bold text-white text-sm mb-1">Participant Portal</div>
                <div className="text-slate-500 text-xs leading-snug">Goals, messages &amp; profile access</div>
              </div>
              <div className="flex items-center gap-1 text-teal-400 text-xs font-semibold mt-auto group-hover:gap-2 transition-all">
                Sign in <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            {/* Staff */}
            <Link
              href="/login/staff"
              className="group flex flex-col items-center gap-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-700/50 border border-slate-700 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <FileText className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <div className="font-bold text-white text-sm mb-1">Staff Portal</div>
                <div className="text-slate-500 text-xs leading-snug">Caseload, notes &amp; documents</div>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mt-auto group-hover:gap-2 group-hover:text-slate-300 transition-all">
                Sign in <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            {/* Admin */}
            <Link
              href="/login/admin"
              className="group flex flex-col items-center gap-3 bg-slate-900 hover:bg-violet-950/80 border border-slate-800 hover:border-violet-700/60 rounded-2xl p-6 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-600/15 border border-violet-600/20 flex items-center justify-center group-hover:bg-violet-600/25 transition-colors">
                <Gem className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <div className="font-bold text-white text-sm mb-1">Admin Portal</div>
                <div className="text-slate-500 text-xs leading-snug">Full oversight &amp; audit access</div>
              </div>
              <div className="flex items-center gap-1 text-violet-400 text-xs font-semibold mt-auto group-hover:gap-2 transition-all">
                Sign in <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </div>

          <p className="text-slate-600 text-xs">
            New participant?{" "}
            <Link href="/request-access" className="text-teal-500 hover:text-teal-400 font-semibold transition-colors">
              Request access →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 md:px-12 py-20 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
            Everything your team needs
          </h2>
          <p className="text-slate-500 text-center text-sm mb-12 max-w-xl mx-auto">
            Built for the real-world demands of housing-focused case management organizations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center mb-3">
                  <f.icon className="w-4 h-4 text-teal-400" />
                </div>
                <div className="font-semibold text-white text-sm mb-1">{f.label}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/60 px-6 md:px-12 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-8">
            {/* Org brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                  <span className="text-teal-950 font-black text-[10px]">CF</span>
                </div>
                <span className="font-bold text-white text-sm">T.O.O.LS INC</span>
              </div>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                T.O.O.LS INC builds intelligent tools for social services and case management organizations.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-x-16 gap-y-2 text-xs">
              <div className="space-y-2">
                <div className="text-slate-600 font-bold uppercase tracking-widest text-[10px] mb-2">Portals</div>
                <Link href="/login/client" className="block text-slate-400 hover:text-white transition-colors">Participant Portal</Link>
                <Link href="/login/staff" className="block text-slate-400 hover:text-white transition-colors">Staff Portal</Link>
                <Link href="/login/admin" className="block text-slate-400 hover:text-white transition-colors">Admin Portal</Link>
                <Link href="/request-access" className="block text-slate-400 hover:text-white transition-colors">Request Access</Link>
              </div>
              <div className="space-y-2">
                <div className="text-slate-600 font-bold uppercase tracking-widest text-[10px] mb-2">Legal</div>
                <Link href="/legal/terms" className="block text-slate-400 hover:text-white transition-colors">Terms of Use</Link>
                <Link href="/legal/privacy" className="block text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/legal/cookies" className="block text-slate-400 hover:text-white transition-colors">Cookie Policy</Link>
                <Link href="/api/health" className="block text-slate-400 hover:text-white transition-colors">System Status</Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800/60 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="text-xs text-slate-600 text-center md:text-left leading-relaxed">
                <p>© {new Date().getFullYear()} T.O.O.LS INC. All rights reserved.</p>
                <p className="mt-1">
                  This platform is intended for authorized users only. Unauthorized access is prohibited and may be subject to legal action.
                  All user activity is logged and audited.
                </p>
              </div>

              {/* AMP branding */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest">Powered By</span>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                  <Image
                    src="/amp-logo.jpeg"
                    alt="A MackProjekt"
                    width={24}
                    height={24}
                    className="rounded-md object-cover"
                  />
                  <span className="text-slate-300 font-bold text-xs tracking-wide">A MackProjekt</span>
                </div>
              </div>
            </div>

            {/* Legal notice */}
            <p className="mt-6 text-[10px] text-slate-700 text-center leading-relaxed max-w-4xl mx-auto">
              CaseFlow Operations is a proprietary platform developed by A MackProjekt for T.O.O.LS INC. Use of this platform constitutes
              acceptance of the Terms of Use and Privacy Policy. This system processes Protected Health Information (PHI) in accordance with
              HIPAA (45 CFR Parts 160 and 164). Unauthorized disclosure of PHI may result in civil and criminal penalties. All data is
              encrypted in transit and at rest. This platform uses cookies essential to site security and session management. By continuing
              to use this platform you consent to our Cookie Policy.
            </p>
            <p className="mt-3 text-[10px] text-slate-800 text-center leading-relaxed max-w-3xl mx-auto border border-slate-800 rounded-xl px-4 py-2">
              This platform — including its design, architecture, source code, workflows, and all associated intellectual property — was
              conceived, designed, and built solely by <span className="text-slate-500 font-bold">A MackProjekt</span>.
              Deployed by T.O.O.LS INC. No license, assignment, or transfer of ownership is granted or implied. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

