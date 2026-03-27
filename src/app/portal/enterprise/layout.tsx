"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Shield,
  Settings2,
  Building2,
  UserCog,
  Briefcase,
  Users,
  LogOut,
  KeyRound,
  Palette,
  Plug,
  ScrollText,
  Rocket,
} from "lucide-react";

const NAV = [
  { href: "/portal/enterprise", label: "Workspace Control", icon: Settings2, exact: true },
  { href: "/portal/enterprise/identity", label: "Identity & Access", icon: KeyRound },
  { href: "/portal/enterprise/organization", label: "Organization & Tenant", icon: Palette },
  { href: "/portal/enterprise/integrations", label: "Integrations", icon: Plug },
  { href: "/portal/enterprise/audit", label: "Audit & Governance", icon: ScrollText },
  { href: "/portal/enterprise/operations", label: "Platform Operations", icon: Rocket },
];

const PORTAL_NAV = [
  { href: "/portal/admin", label: "Admin Portal", icon: UserCog },
  { href: "/portal/staff", label: "Staff Portal", icon: Briefcase },
  { href: "/portal/client", label: "Client Portal", icon: Users },
];

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-72 bg-slate-950 text-slate-100 fixed inset-y-0 left-0 z-30 flex flex-col">
        <div className="h-16 px-5 border-b border-slate-800 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <div>
            <p className="text-sm font-semibold text-white">Enterprise Workspace</p>
            <p className="text-[11px] text-slate-400">Global Control Plane</p>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  active ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="mt-4 px-3 pt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 border-t border-slate-800">
            Managed Portals
          </div>

          {PORTAL_NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3 text-xs text-slate-400">
          <div className="mb-2 rounded-lg bg-slate-900 p-2">
            <p className="text-slate-200 text-xs font-semibold">{session?.user?.name ?? "Admin"}</p>
            <p className="truncate">{session?.user?.email ?? ""}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login/staff" })}
            className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="ml-72 flex-1 min-h-screen">
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-sm text-slate-600">
            <Building2 className="w-4 h-4 text-cyan-600" />
            Enterprise Workspace Administration
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
