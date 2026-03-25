"use client";

import Link from "next/link";
import { useState } from "react";
import { MailCheck, ShieldCheck, UserRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Unable to send reset email. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* ── Left brand panel (desktop only) ── */}
      <aside className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-slate-800 border-r border-slate-700/50 p-10">
        <div>
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
            Let&apos;s get you<br />back in.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Enter the email address or username linked to your account and we&apos;ll send you a secure reset link.
          </p>
        </div>

        <div className="space-y-3.5">
          {[
            { emoji: "📧", label: "Check your inbox for the reset link" },
            { emoji: "⏱️", label: "Link expires after 1 hour" },
            { emoji: "🔒", label: "One-time use — can't be reused" },
            { emoji: "🛡️", label: "Your data stays encrypted and safe" },
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

      {/* ── Right: form or success ── */}
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

          {submitted ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/15 border border-teal-500/30 mb-6">
                <MailCheck className="w-8 h-8 text-teal-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">Check your inbox</h1>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                If an account exists for{" "}
                <span className="text-slate-200 font-semibold">{identifier}</span>, we&apos;ve sent
                a password reset link. The link expires in 1 hour.
              </p>
              <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4 text-xs text-slate-400 leading-relaxed mb-8 text-left">
                <p className="font-semibold text-slate-300 mb-1">Didn&apos;t get the email?</p>
                <p>Check your spam or junk folder. If it still isn&apos;t there, make sure you entered the correct email address or username.</p>
              </div>
              <div className="space-y-3 text-sm text-slate-500">
                <p>
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setIdentifier(""); }}
                    className="text-teal-400 hover:text-teal-300 font-semibold transition-colors"
                  >
                    Try a different address
                  </button>
                </p>
                <p>
                  <Link href="/login/client" className="text-slate-400 hover:text-slate-200 font-semibold transition-colors">
                    ← Back to Sign In
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* ── Request form ── */
            <>
              <h1 className="text-2xl font-bold text-white mb-1">Forgot your password?</h1>
              <p className="text-slate-400 text-sm mb-8">
                Enter your email address or username and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-2"
                  >
                    Email / Username
                  </label>
                  <div className="relative">
                    <UserRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="identifier"
                      type="text"
                      autoComplete="username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="name@example.com or username"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 pl-11 pr-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-900/80 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-400 active:scale-[0.99] text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-teal-900/40 disabled:opacity-60 text-sm"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-slate-500">
                <Link href="/login/client" className="text-slate-400 hover:text-slate-200 font-semibold transition-colors">
                  ← Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
