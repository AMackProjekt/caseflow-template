"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  Home,
  CalendarDays,
  Plug,
  Settings,
  LogOut,
  ScrollText,
  ChevronRight,
  Gem,
  Shield,
} from "lucide-react";

const NAV = [
  { href: "/portal/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/admin/personnel", label: "Personnel", icon: UserCog },
  { href: "/portal/admin/caseload", label: "Caseload", icon: Users },
  { href: "/portal/admin/demographics", label: "Demographics", icon: BarChart3 },
  { href: "/portal/admin/housing", label: "Housing Matches", icon: Home },
  { href: "/portal/admin/scheduling", label: "Scheduling", icon: CalendarDays },
  { href: "/portal/admin/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/portal/admin/audit", label: "Audit Log", icon: ScrollText },
  { href: "/portal/admin/integrations", label: "Integrations", icon: Plug },
  { href: "/portal/admin/settings", label: "Settings", icon: Settings },
];

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-violet-600 text-white font-semibold"
          : "text-violet-200 hover:bg-violet-800/60 hover:text-white"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
      {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "Admin";
  const email = session?.user?.email ?? "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-violet-950 text-violet-100 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Brand */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-violet-800/50 shrink-0">
          <Gem className="w-5 h-5 text-violet-300" />
          <div>
            <div className="font-bold text-white text-sm leading-tight">Champion Admin</div>
            <div className="text-violet-400 text-[10px] leading-tight tracking-wider uppercase">Supervisor Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-violet-800/50 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{name}</p>
              <p className="text-violet-400 text-[10px] truncate">{email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login/staff" })}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-violet-300 hover:bg-violet-800/60 hover:text-red-300 transition text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main — offset by sidebar */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-20">
          <div className="flex-1">
            <Link
              href="/portal/enterprise"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100"
            >
              <Shield className="w-3.5 h-3.5" /> Workspace Control Plane
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-violet-500" />
            <span>Champion Admin — Full Access</span>
          </div>
        </header>

        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
