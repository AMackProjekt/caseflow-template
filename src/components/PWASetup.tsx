"use client";

import { useEffect, useState } from "react";

// Typed definition for the browser's install prompt event
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWASetup() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("[PWA] Service worker registration failed:", err));
    }

    // Detect if already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    // Capture the browser's install prompt
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show the banner after a 45-second delay so it's not immediately intrusive
      setTimeout(() => setShowBanner(true), 45_000);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setShowBanner(false);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  };

  const dismiss = () => {
    setShowBanner(false);
    // Don't show again this session
    sessionStorage.setItem("pwa_banner_dismissed", "1");
  };

  if (installed || !showBanner || !installPrompt) return null;
  if (sessionStorage.getItem("pwa_banner_dismissed")) return null;

  return (
    <div
      role="alertdialog"
      aria-label="Install Portal"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-600/60 backdrop-blur-sm max-w-sm w-[calc(100%-2.5rem)]"
    >
      {/* Org icon placeholder */}
      <div className="shrink-0 w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight text-white">Install Portal</p>
        <p className="text-xs text-slate-400 mt-0.5 leading-snug">
          Add to your home screen for offline access
        </p>
      </div>

      <button
        onClick={handleInstall}
        className="shrink-0 bg-teal-500 hover:bg-teal-400 active:scale-95 text-teal-950 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all"
      >
        Install
      </button>

      <button
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="shrink-0 text-slate-500 hover:text-slate-200 transition-colors p-1"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
