"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Eye, EyeOff, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

type Strength = "empty" | "weak" | "fair" | "strong";

function getPasswordStrength(password: string): Strength {
  if (!password) return "empty";
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score <= 1) return "weak";
  if (score === 2) return "fair";
  return "strong";
}

const strengthConfig: Record<Strength, { label: string; color: string; barColor: string; bars: number }> = {
  empty:  { label: "",        color: "text-slate-600",  barColor: "bg-slate-700",  bars: 0 },
  weak:   { label: "Weak",   color: "text-rose-400",   barColor: "bg-rose-500",   bars: 1 },
  fair:   { label: "Fair",   color: "text-amber-400",  barColor: "bg-amber-500",  bars: 2 },
  strong: { label: "Strong", color: "text-teal-400",   barColor: "bg-teal-500",   bars: 3 },
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(newPassword);
  const strengthInfo = strengthConfig[strength];
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsDiffer = confirmPassword && newPassword !== confirmPassword;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Unable to reset password. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 mb-6">
          <XCircle className="w-8 h-8 text-rose-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Invalid reset link</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          This link is missing its reset token. Please use the link from your email exactly as it was sent.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all text-sm"
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/15 border border-teal-500/30 mb-6">
          <CheckCircle2 className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Password updated!</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Your password has been changed successfully. You can now sign in with your new password.
        </p>
        <Link
          href="/login/client"
          className="inline-block bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all text-sm"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-1">Set a new password</h1>
      <p className="text-slate-400 text-sm mb-8">
        Choose something strong that you haven&apos;t used before.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New password */}
        <div>
          <label
            htmlFor="new-password"
            className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-500 pl-4 pr-11 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength meter */}
          {newPassword && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      bar <= strengthInfo.bars ? strengthInfo.barColor : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs font-semibold ${strengthInfo.color}`}>
                {strengthInfo.label}
                {strength === "weak" && (
                  <span className="font-normal text-slate-500"> — add uppercase letters, numbers, or symbols</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-400 mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your new password"
              className={`w-full rounded-xl border bg-slate-800/80 text-white placeholder:text-slate-500 pl-4 pr-11 py-3 text-sm outline-none focus:ring-2 transition ${
                passwordsDiffer
                  ? "border-rose-600 focus:border-rose-500 focus:ring-rose-500/20"
                  : passwordsMatch
                  ? "border-teal-600 focus:border-teal-500 focus:ring-teal-500/20"
                  : "border-slate-700 focus:border-teal-500 focus:ring-teal-500/20"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordsDiffer && (
            <p className="mt-1.5 text-xs text-rose-400">Passwords don&apos;t match.</p>
          )}
          {passwordsMatch && (
            <p className="mt-1.5 text-xs text-teal-400">Passwords match ✓</p>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-rose-900/80 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
            {error}
            {(error.includes("expired") || error.includes("invalid") || error.includes("already been used")) && (
              <Link href="/forgot-password" className="block mt-2 font-semibold text-rose-300 underline underline-offset-2 hover:text-rose-200 transition">
                Request a new reset link →
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !!passwordsDiffer || !newPassword || !confirmPassword}
          className="w-full bg-teal-500 hover:bg-teal-400 active:scale-[0.99] text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-teal-900/40 disabled:opacity-60 text-sm"
        >
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link href="/login/client" className="text-slate-500 hover:text-slate-300 font-semibold transition-colors">
          ← Back to Sign In
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
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
            Create a new<br />strong password.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Pick something you haven&apos;t used before and keep it somewhere safe.
          </p>
        </div>

        <div className="space-y-3.5">
          {[
            { emoji: "🔡", label: "At least 8 characters" },
            { emoji: "🔢", label: "Mix of letters and numbers" },
            { emoji: "🔣", label: "Special characters make it stronger" },
            { emoji: "🔁", label: "One-time link — won't work twice" },
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

      {/* ── Right: form ── */}
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

          <Suspense fallback={<p className="text-slate-400 text-sm">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
