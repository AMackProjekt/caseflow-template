"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Gem, ShieldCheck, UserRound, ScrollText, Users, BarChart3 } from "lucide-react";

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908C16.658 14.017 17.64 11.71 17.64 9.2z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

const FEATURES = [
  { icon: Eye, label: "Full auditory scope — every action logged" },
  { icon: ShieldCheck, label: "HIPAA compliance monitoring" },
  { icon: Users, label: "Case manager assignment & personnel" },
  { icon: BarChart3, label: "Demographics & housing oversight" },
  { icon: ScrollText, label: "Real-time audit log access" },
  { icon: Gem, label: "Google & Microsoft integrations" },
];

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const remembered = localStorage.getItem("caseflow_admin_remembered_identifier");
    if (remembered) {
      setIdentifier(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleCredentialSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("admin-credentials", {
        identifier,
        password,
        redirect: false,
        callbackUrl: "/portal/admin",
      });

      if (!result || result.error) {
        setError("Incorrect email/username or password.");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("caseflow_admin_remembered_identifier", identifier.trim());
      } else {
        localStorage.removeItem("caseflow_admin_remembered_identifier");
      }

      window.location.href = result.url ?? "/portal/admin";
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120520] flex">
      {/* Left brand panel (desktop only) */}
      <aside className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-violet-950 border-r border-violet-900/50 p-10">
        <div>
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/60">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white block text-sm leading-none">CaseFlow</span>
              <span className="text-[10px] text-violet-300 font-bold uppercase tracking-widest">Champion Admin</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Full administrative<br />access &amp; oversight.
          </h2>
          <p className="text-violet-300 text-sm leading-relaxed">
            Supervisor-level access to personnel, compliance, audit logs, housing matches, and all organizational data.
          </p>
        </div>

        <div className="space-y-3.5">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-start gap-2.5 text-violet-300 text-sm">
              <f.icon className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
              {f.label}
            </div>
          ))}
          <div className="pt-4 mt-1 border-t border-violet-900/50 text-xs text-violet-600 font-semibold">
            Access restricted to authorized supervisors only.
          </div>
        </div>
      </aside>

      {/* Right: sign-in form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white block text-sm leading-none">CaseFlow</span>
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Champion Admin</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
          <p className="text-violet-300 text-sm mb-3">Sign in with your admin credentials or Google account.</p>

          <div className="inline-flex items-center gap-1.5 bg-violet-950 border border-violet-800/70 text-violet-300 text-xs font-bold px-3 py-1.5 rounded-full mb-8">
            <ShieldCheck className="w-3 h-3" />
            Allowlist-gated &middot; All sessions audited
          </div>

          <form onSubmit={handleCredentialSignIn} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-xs font-bold uppercase tracking-[0.18em] text-violet-400 mb-2">
                Email / Username
              </label>
              <div className="relative">
                <UserRound className="w-4 h-4 text-violet-600 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                      placeholder="name@sdtoolsinc.org"
                  className="w-full rounded-xl border border-violet-800/60 bg-violet-950/50 text-white placeholder:text-violet-700 pl-11 pr-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.18em] text-violet-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-violet-800/60 bg-violet-950/50 text-white placeholder:text-violet-700 pl-4 pr-11 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-600 hover:text-violet-300 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="inline-flex items-center gap-2 text-violet-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-violet-700 bg-violet-950 text-violet-500 focus:ring-violet-500/30"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-violet-400 hover:text-violet-300 font-medium transition">
                Forgot password?
              </Link>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-900/80 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-violet-900/50 disabled:opacity-60 text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-violet-900/60"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#120520] text-violet-700">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/portal/admin" })}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-800 font-semibold py-3 px-4 rounded-xl transition-all shadow-md text-sm"
          >
            <GoogleG />
            Continue with Google
          </button>

          <div className="mt-8 space-y-3 text-center text-sm text-violet-600">
            <p>
              Staff member?{" "}
              <Link href="/login/staff" className="text-slate-400 hover:text-slate-200 font-semibold transition-colors">
                Staff Login
              </Link>
            </p>
            <p>
              Participant?{" "}
              <Link href="/login/client" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                Client Login
              </Link>
            </p>
          </div>

          <p className="mt-10 text-xs text-violet-800 text-center leading-relaxed">
            All sign-in attempts are logged and monitored.<br />
            Unauthorized access attempts will be reported.
          </p>
        </div>
      </div>
    </div>
  );
}