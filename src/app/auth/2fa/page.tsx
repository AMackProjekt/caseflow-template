"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, RefreshCw, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function TwoFAPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function sendCode() {
    setSending(true);
    setError("");
    const res = await fetch("/api/auth/2fa/send", { method: "POST" });
    setSending(false);
    if (res.ok) {
      setSent(true);
      setCountdown(60);
      inputRef.current?.focus();
    } else {
      setError("Failed to send code. Please try again.");
    }
  }

  useEffect(() => {
    if (status === "authenticated" && !sent) {
      sendCode();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [countdown]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return;
    setVerifying(true);
    setError("");
    const res = await fetch("/api/auth/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    setVerifying(false);
    if (res.ok) {
      // Redirect to whichever portal the user belongs to
      const role = (session?.user as { role?: string })?.role;
      router.replace(role === "staff" ? "/portal/staff" : "/portal/client");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Verification failed.");
      setCode("");
      inputRef.current?.focus();
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.replace("/login/staff");
    return null;
  }

  const email = session?.user?.email ?? "";
  const masked = email.replace(/(.{2}).+(@.+)/, "$1***$2");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-charcoal-900 px-8 py-6 text-center">
          <div className="w-14 h-14 bg-teal-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-7 h-7 text-teal-400" />
          </div>
          <h1 className="text-white font-bold text-xl">Two-Step Verification</h1>
          <p className="text-slate-400 text-sm mt-1">CaseFlow Security</p>
        </div>

        <div className="px-8 py-8 space-y-6">
          <p className="text-slate-600 text-sm text-center leading-relaxed">
            {sent
              ? <>A 6-digit code was sent to <span className="font-bold text-charcoal-900">{masked}</span>. Enter it below to continue.</>
              : "Sending your verification code…"}
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full text-center text-4xl font-black tracking-[.5em] py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition placeholder:text-slate-300 placeholder:text-2xl"
                disabled={!sent || verifying}
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <p className="text-rose-500 text-sm font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={code.length !== 6 || verifying || !sent}
              className="w-full bg-charcoal-900 text-white font-bold py-3.5 rounded-xl hover:bg-charcoal-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? "Verifying…" : "Verify & Continue"}
            </button>
          </form>

          <div className="flex items-center justify-between text-sm">
            <button
              onClick={sendCode}
              disabled={sending || countdown > 0}
              className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-semibold disabled:text-slate-400 disabled:cursor-not-allowed transition"
            >
              <RefreshCw className={`w-4 h-4 ${sending ? "animate-spin" : ""}`} />
              {sending ? "Sending…" : countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/login/staff" })}
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-500 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
