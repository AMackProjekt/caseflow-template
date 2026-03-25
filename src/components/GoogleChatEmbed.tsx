"use client";

import { ExternalLink, MessageSquare, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface GoogleChatEmbedProps {
  spaceId: string;
  spaceName: string;
  themeColor?: "teal" | "slate" | "violet";
  portalType: "client" | "staff" | "admin";
}

const SPACE_URLS: Record<string, string> = {
  "AAQABMc-VMI": "https://chat.google.com/room/AAQABMc-VMI",
  "AAQA38o_A6I": "https://chat.google.com/room/AAQA38o_A6I",
};

export default function GoogleChatEmbed({
  spaceId,
  spaceName,
  themeColor = "teal",
  portalType,
}: GoogleChatEmbedProps) {
  const { data: session } = useSession();

  const themeMap = {
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      badge: "bg-teal-100 text-teal-700",
      btn: "bg-teal-600 hover:bg-teal-500 shadow-teal-600/30",
      icon: "text-teal-500",
    },
    slate: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      badge: "bg-slate-100 text-slate-700",
      btn: "bg-slate-700 hover:bg-slate-600 shadow-slate-700/30",
      icon: "text-slate-500",
    },
    violet: {
      bg: "bg-violet-50",
      border: "border-violet-200",
      badge: "bg-violet-100 text-violet-700",
      btn: "bg-violet-600 hover:bg-violet-500 shadow-violet-600/30",
      icon: "text-violet-500",
    },
  };

  const t = themeMap[themeColor];
  const chatUrl = SPACE_URLS[spaceId] ?? `https://chat.google.com/room/${spaceId}`;

  if (!session) {
    return (
      <div className={`rounded-2xl border ${t.border} ${t.bg} p-12 text-center`}>
        <AlertCircle className={`w-10 h-10 mx-auto mb-4 ${t.icon}`} />
        <p className="font-bold text-slate-700">Sign in required</p>
        <p className="text-sm text-slate-500 mt-1">Please sign in to access the messaging channel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border ${t.border} ${t.bg} p-8 flex flex-col items-center gap-6 text-center`}>
        <div className={`w-16 h-16 rounded-2xl ${t.badge} flex items-center justify-center`}>
          <MessageSquare className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">{spaceName} Channel</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
            Google Chat opens in its own tab so you can stay signed in as{" "}
            <strong>{session.user?.email}</strong>.
          </p>
        </div>

        <a
          href={chatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 ${t.btn} text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md transition-all active:scale-[0.98]`}
        >
          Open in Google Chat <ExternalLink className="w-4 h-4" />
        </a>

        <p className="text-xs text-slate-400">
          First time? Make sure you&apos;ve been invited to the space by a staff member.
        </p>
      </div>

      {portalType === "client" && (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">Not in the channel yet?</p>
          <a
            href="/join-chat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-teal-600 hover:text-teal-500 transition flex items-center gap-1 whitespace-nowrap"
          >
            Request to join <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
