"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSession } from "next-auth/react";
import { MessageSquare, X, Send, ChevronDown } from "lucide-react";

type ChatMsg = { _id: string; author: string; role: string; body: string; ts: string };

export default function FloatingChat({ role }: { role: "staff" | "client" }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { data: session } = useSession();
  const messages = (useQuery(api.functions.listChatMessages) ?? []) as ChatMsg[];
  const send = useMutation(api.functions.sendChatMessage);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const authorName = session?.user?.name ?? (role === "staff" ? "Staff" : "Participant");

  // Auto-scroll when new messages arrive or panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [messages.length, open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    await send({ author: authorName, role, body: trimmed });
  };

  const unread = messages.length;

  const labelOpenPanel = role === "staff" ? "Team Chat" : "Message Support";

  return (
    <>
      {/* Expanded chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 z-[200] w-[340px] md:w-[400px] bg-white rounded-[1.75rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-charcoal-900 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border border-charcoal-900" />
              </div>
              <span className="font-bold text-white text-sm">{labelOpenPanel}</span>
              {role === "staff" && (
                <span className="text-[9px] font-bold text-teal-400/70 bg-teal-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Live</span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              title="Close chat"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px] bg-slate-50/50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-3">
                  <MessageSquare className="w-6 h-6 text-teal-400" />
                </div>
                <p className="text-slate-400 text-xs font-medium">No messages yet.<br />Say hello! 👋</p>
              </div>
            )}
            {messages.map((m, i) => {
              const isMine = m.author === authorName;
              const isStaff = m.role === "staff";
              return (
                <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                    {!isMine && (
                      <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                        {m.author} {isStaff ? "· Staff" : ""}
                      </span>
                    )}
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-snug ${
                      isMine
                        ? "bg-teal-600 text-white rounded-br-sm"
                        : isStaff
                        ? "bg-indigo-100 text-indigo-900 rounded-bl-sm"
                        : "bg-white border border-slate-200 text-charcoal-900 rounded-bl-sm shadow-sm"
                    }`}>
                      {m.body}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">
                      {new Date(m.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
            <input
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={role === "staff" ? "Message the team…" : "Message your support team…"}
              title="Type a message"
              className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 placeholder:text-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              title="Send message"
              className="w-10 h-10 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        title={open ? "Close chat" : labelOpenPanel}
        aria-label={open ? "Close chat" : labelOpenPanel}
        className="fixed bottom-4 right-4 z-[200] w-14 h-14 bg-teal-600 hover:bg-teal-500 text-white rounded-full shadow-2xl shadow-teal-500/30 flex items-center justify-center transition-all active:scale-95"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            {unread > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[9px] font-black border border-teal-600">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </div>
        )}
      </button>
    </>
  );
}
