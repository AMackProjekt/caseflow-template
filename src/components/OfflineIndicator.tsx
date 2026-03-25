"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);
    setVisible(!navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Show "back online" briefly then hide
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setVisible(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold shadow-xl border transition-all duration-300 ${
        isOnline
          ? "bg-teal-900 border-teal-700 text-teal-300"
          : "bg-slate-900 border-slate-700 text-slate-300"
      }`}
    >
      {isOnline ? (
        <>
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
          Back online
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
          You&apos;re offline — showing cached data
        </>
      )}
    </div>
  );
}
