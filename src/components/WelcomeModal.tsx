"use client";

import { Sparkles } from "lucide-react";

interface Props {
  userName?: string | null;
  portalType: "staff" | "client";
  onStartTour: () => void;
  onSkip: () => void;
}

export default function WelcomeModal({ userName, portalType, onStartTour, onSkip }: Props) {
  const firstName = userName?.split(" ")[0] ?? null;

  const staffFeatures = [
    "📋  Manage your full caseload and client profiles",
    "📁  Upload and share HIPAA-safe documents",
    "💬  Message clients via Google Chat",
    "🛡️  Monitor compliance status in real time",
  ];

  const clientFeatures = [
    "🎯  Set and track your personal goals",
    "💬  Stay in touch with your case manager",
    "👤  Update your profile and contact info",
  ];

  const features = portalType === "staff" ? staffFeatures : clientFeatures;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div
          className={`p-8 text-white ${
            portalType === "staff"
              ? "bg-gradient-to-br from-slate-800 to-slate-900"
              : "bg-gradient-to-br from-teal-500 to-indigo-600"
          }`}
        >
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Welcome{firstName ? `, ${firstName}` : ""}! 👋
          </h1>
          <p
            className={`text-sm leading-relaxed ${
              portalType === "staff" ? "text-slate-300" : "text-teal-100"
            }`}
          >
            {portalType === "staff"
              ? "You're in CaseFlow Operations — your full case management hub. Let us show you around."
              : "You're in your CaseFlow Participant Portal. Here's what you can do here."}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <ul className="space-y-2.5">
            {features.map((item) => (
              <li key={item} className="text-sm text-slate-600 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onSkip}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition"
            >
              Skip
            </button>
            <button
              onClick={onStartTour}
              className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition shadow-lg ${
                portalType === "staff"
                  ? "bg-slate-800 hover:bg-slate-700 shadow-slate-500/20"
                  : "bg-teal-600 hover:bg-teal-700 shadow-teal-500/20"
              }`}
            >
              Take the Tour →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
