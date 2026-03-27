"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzyNvrR1_6vUpgHpFS2wzxm2WoTN0_512atGZHmD9wLFp5VW7NuAyflmGYrQBOyQFnY/exec";

export default function JoinChatPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        // Apps Script requires text/plain for no-cors mode; mode no-cors means we can't read the response
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      // no-cors always returns an opaque response — treat reaching here as success
      setStatus("success");
    } catch {
      setErrorMsg("Unable to submit. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-charcoal-950 to-indigo-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">Request Sent!</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your request to join the Team Channel has been sent to the Org team. We&apos;ll add you to the space shortly.
          </p>
          <div className="mt-8 p-4 bg-teal-50 rounded-xl border border-teal-200 text-sm text-teal-800 leading-relaxed">
            <strong>What happens next:</strong> A staff member will send you a Google Chat invitation to <strong>{email}</strong>. Check your inbox and accept the invite.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-charcoal-950 to-indigo-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header band */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-8 py-7 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Image
                src="/amp-logo.jpeg"
                alt="T.O.O.LS INC"
                width={36}
                height={36}
                className="rounded-xl object-cover"
              />
            </div>
            <div>
              <p className="text-teal-100 text-xs font-bold uppercase tracking-widest">T.O.O.LS INC</p>
              <h1 className="text-white text-xl font-black leading-tight">Join the Team Channel</h1>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4 mb-7">
              <MessageSquare className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
              <p className="text-sm text-teal-800 leading-relaxed">
                Fill out this form and a Org staff member will send a Google Chat invite to your email address.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                />
              </div>

              {status === "error" && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-teal-600 hover:bg-teal-500 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-teal-600/30 disabled:opacity-60 text-sm flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Request to Join
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="px-8 pb-6 text-center text-xs text-slate-400">
            T.O.O.LS INC · Team Channel · Google Chat
          </div>
        </div>
      </div>
    </div>
  );
}
