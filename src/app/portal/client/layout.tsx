"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Home,
  ArrowLeft,
  User,
  Settings,
  HelpCircle,
  MessageSquare,
  Target,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { StaffProvider } from "@/context/StaffContext";
import { signOut, useSession } from "next-auth/react";
import type { SecuritySummary } from "@/app/api/compliance/status/route";
import WelcomeModal from "@/components/WelcomeModal";
import OnboardingTour, { type TourStep } from "@/components/OnboardingTour";
import PWASetup from "@/components/PWASetup";
import PortalChat from "@/components/PortalChat";
import OfflineIndicator from "@/components/OfflineIndicator";

function ClientBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      title="Go back"
      aria-label="Go back"
      className="p-2 rounded-xl text-slate-400 hover:text-charcoal-900 hover:bg-slate-100 transition"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  badge,
  tourId,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: React.ReactNode;
  tourId?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/portal/client" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      data-tour={tourId}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        isActive
          ? "bg-teal-500/20 text-teal-300 shadow-sm"
          : "text-slate-400 hover:bg-slate-700/60 hover:text-white"
      }`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-teal-400" : ""}`} />
      <span className="flex-1">{label}</span>
      {badge}
    </Link>
  );
}

const CLIENT_STEPS: TourStep[] = [
  { target: '[data-tour="client-dashboard"]', title: "Dashboard", body: "Your home base — see your goals, messages, and important updates at a glance.", placement: "right" },
  { target: '[data-tour="client-goals"]', title: "My Goals", body: "Set SMART goals and track your progress. Celebrate milestones as you achieve them.", placement: "right" },
  { target: '[data-tour="client-messages"]', title: "Messages", body: "Stay in touch with your case manager and support team via Google Chat.", placement: "right" },
  { target: '[data-tour="client-profile"]', title: "Profile", body: "Update your photo, phone number, and contact information any time.", placement: "right" },
  { target: '[data-tour="client-settings"]', title: "Settings", body: "Manage your account preferences and notification settings.", placement: "right" },
  { target: '[data-tour="client-help"]', title: "Help & Support", body: "Need help? Find answers and reach your support team here.", placement: "right" },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [security, setSecurity] = useState<SecuritySummary | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const completeOnboarding = () => {
    localStorage.setItem("caseflow_client_onboarded", "1");
    setShowWelcome(false);
    setShowTour(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("caseflow_client_onboarded")) {
      setShowWelcome(true);
    }
  }, []);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    fetch("/api/compliance/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: SecuritySummary | null) => setSecurity(data))
      .catch(() => setSecurity(null));
  }, []);

  return (
    <StaffProvider>
      <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden">

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-slate-800 text-slate-300 flex flex-col shrink-0 transition-transform duration-300 md:static md:translate-x-0 md:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Brand */}
          <div className="h-16 flex items-center px-5 border-b border-slate-700/60">
            <div>
              <span className="font-bold text-white text-base tracking-wide block leading-tight">CaseFlow</span>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest leading-none">Participant Portal</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-5 space-y-1">
            <NavLink href="/portal/client" icon={LayoutDashboard} label="Dashboard" tourId="client-dashboard" />
            <NavLink href="/portal/client/goals" icon={Target} label="My Goals" tourId="client-goals" />
            <NavLink
              href="/portal/client/messages"
              icon={MessageSquare}
              label="Messages"
              tourId="client-messages"
              badge={<span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />}
            />
          </nav>

          {/* Bottom */}
          <div className="px-3 py-4 border-t border-slate-700/60 space-y-1">
            <NavLink href="/portal/client/profile" icon={User} label="Profile" tourId="client-profile" />
            <NavLink href="/portal/client/settings" icon={Settings} label="Settings" tourId="client-settings" />
            <NavLink href="/portal/client/help" icon={HelpCircle} label="Help & Support" tourId="client-help" />
            <button
              onClick={() => signOut({ callbackUrl: "/login/client" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-left mt-1"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Right column */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Top header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-6 shrink-0">
            <div className="flex items-center gap-1">
              {/* Hamburger (mobile only) */}
              <button
                title="Toggle menu"
                aria-label="Toggle sidebar"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-charcoal-900 hover:bg-slate-100 transition"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Link
                href="/portal/client"
                title="Home"
                className="p-2 rounded-xl text-slate-400 hover:text-charcoal-900 hover:bg-slate-100 transition"
              >
                <Home className="w-4 h-4" />
              </Link>
              <ClientBackButton />
            </div>

            <div className="flex items-center gap-4">
              {/* Security badge */}
              {security && (
                <div
                  title={
                    `Encryption: ${security.data_encrypted ? "Active" : "Not configured"} · ` +
                    `Auth: ${security.auth_configured ? "Active" : "Not configured"} · ` +
                    `Session: ${security.session_active ? "Active" : "Inactive"}`
                  }
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    security.status === "secured"
                      ? "bg-teal-50 text-teal-700 border-teal-200"
                      : security.status === "partial"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {security.status === "secured" ? (
                    <ShieldCheck className="w-3 h-3" />
                  ) : security.status === "partial" ? (
                    <ShieldAlert className="w-3 h-3" />
                  ) : (
                    <ShieldOff className="w-3 h-3" />
                  )}
                  {security.status === "secured"
                    ? "Secured"
                    : security.status === "partial"
                    ? "Partial"
                    : "Unsecured"}
                </div>
              )}

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 focus:outline-none"
                  aria-label="Open profile menu"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-charcoal-900 leading-none">{session?.user?.name ?? "Participant"}</p>
                    <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mt-0.5">My Account</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-5 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-charcoal-900 leading-tight">{session?.user?.name ?? "Participant"}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[140px]">{session?.user?.email ?? ""}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/portal/client/profile"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-charcoal-900 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Profile
                      </Link>
                      <Link
                        href="/portal/client/settings"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-charcoal-900 transition"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                      </Link>
                      <Link
                        href="/portal/client/help"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-charcoal-900 transition"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        Help &amp; Support
                      </Link>
                    </div>
                    <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                      <button
                        onClick={() => { setShowProfile(false); signOut({ callbackUrl: "/login/client" }); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 pb-28 md:p-10 md:pb-10 relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10 max-w-5xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
        {showWelcome && (
          <WelcomeModal
            userName={session?.user?.name}
            portalType="client"
            onStartTour={() => { setShowWelcome(false); setShowTour(true); }}
            onSkip={completeOnboarding}
          />
        )}
        {showTour && (
          <OnboardingTour steps={CLIENT_STEPS} onComplete={completeOnboarding} />
        )}
        <PortalChat role="client" />
        <PWASetup />
        <OfflineIndicator />
    </StaffProvider>
  );
}
