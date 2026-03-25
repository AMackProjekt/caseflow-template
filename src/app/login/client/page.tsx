"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, ShieldCheck, UserRound, WifiOff, Chrome } from "lucide-react";

export default function ClientLogin() {
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const remembered = localStorage.getItem("caseflow_client_remembered_identifier");
    if (remembered) {
      setIdentifier(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleCredentialSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      if (!rememberMe) {
        await fetch("/api/auth/clear-client-session", { method: "POST" });
        localStorage.removeItem("caseflow_client_onboarded");
        sessionStorage.clear();
      }

      const result = await signIn("client-credentials", {
        identifier,
        password,
        redirect: false,
        callbackUrl: "/portal/client",
      });

      if (!result || result.error) {
        setError("Incorrect email/username or password.");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("caseflow_client_remembered_identifier", identifier.trim());
      } else {
        localStorage.removeItem("caseflow_client_remembered_identifier");
      }

      window.location.href = result.url ?? "/portal/client";
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSharedDevice = async () => {
    setClearing(true);
    setError("");
    setNotice("");

    try {
      await fetch("/api/auth/clear-client-session", { method: "POST" });
      localStorage.removeItem("caseflow_client_onboarded");
      localStorage.removeItem("caseflow_client_remembered_identifier");
      sessionStorage.clear();
      setIdentifier("");
      setPassword("");
      setRememberMe(false);
      setNotice("Shared-device sign-in data cleared from this browser.");
    } catch {
      setError("Could not clear shared-device session data.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* ── Left brand panel (desktop only) ── */}
      <aside className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-slate-800 border-r border-slate-700/50 p-10">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-900/40">
              <span className="text-teal-950 font-black text-xs tracking-tight">ORG</span>
            </div>
            <div>
              <span className="font-bold text-white block text-sm leading-none">CaseFlow</span>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Participant Portal</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Your journey<br />forward starts here.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Access your goals, messages, and case support resources — all in one secure place.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-3.5">
          {[
            { emoji: "🎯", label: "Track your SMART goals" },
            { emoji: "💬", label: "Message your case manager" },
            { emoji: "👤", label: "Update your profile & contact info" },
            { emoji: "📲", label: "Install for offline access on any device" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3 text-slate-300 text-sm">
              <span className="text-base leading-none">{f.emoji}</span>
              {f.label}
            </div>
          ))}
          <div className="pt-4 mt-1 border-t border-slate-700/50 flex items-center gap-2 text-xs text-teal-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            HIPAA-compliant · End-to-end encrypted
          </div>
        </div>
      </aside>

      {/* ── Right: sign-in form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
              <span className="text-teal-950 font-black text-xs">ORG</span>
            </div>
            <div>
              <span className="font-bold text-white block text-sm leading-none">CaseFlow</span>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Participant Portal</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-8">Sign in with your username or email and password.</p>

          <form onSubmit={handleCredentialSignIn} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-2">
                Email / Username
              </label>
              <div className="relative">
                <UserRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="name@example.com or username"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 pl-11 pr-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={rememberMe ? "current-password" : "off"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 pl-4 pr-11 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="inline-flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500/30"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-teal-400 hover:text-teal-300 font-medium transition">
                Forgot password?
              </Link>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClearSharedDevice}
                disabled={clearing}
                className="text-xs text-slate-500 hover:text-slate-300 font-medium transition disabled:opacity-60"
              >
                {clearing ? "Clearing…" : "Clear shared device"}
              </button>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-900/80 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            ) : null}

            {notice ? (
              <div className="rounded-xl border border-teal-900/80 bg-teal-950/40 px-4 py-3 text-sm text-teal-300">
                {notice}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 active:scale-[0.99] text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-teal-900/40 disabled:opacity-60 text-sm"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-500">or</span>
            </div>
          </div>

          {/* Google sign-in button */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/portal/client" })}
            className="w-full border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 text-slate-300 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          >
            <Chrome className="w-4 h-4" />
            Sign in with Google
          </button>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-800/60 p-4 text-xs text-slate-400 leading-relaxed">
            Use <span className="text-slate-200 font-semibold">Clear shared device</span> before leaving public or family devices.
            Leave <span className="text-slate-200 font-semibold">Remember me</span> off on shared phones, tablets, and computers.
          </div>

          <div className="mt-8 space-y-3 text-center text-sm text-slate-500">
            <p>
              No account yet?{" "}
              <Link href="/request-access" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                Request Access
              </Link>
            </p>
            <p>
              Staff member?{" "}
              <Link href="/login/staff" className="text-slate-400 hover:text-slate-200 font-semibold transition-colors">
                Staff Login →
              </Link>
            </p>
          </div>

          <div className="mt-10 flex items-center justify-center gap-1.5 text-xs text-slate-600">
            <WifiOff className="w-3 h-3" />
            <span>Offline access available after first sign-in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
