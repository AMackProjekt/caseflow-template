"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { CheckSquare, Square, Upload, ChevronRight, ChevronLeft, Loader2, MailCheck, AlertCircle, ExternalLink } from "lucide-react";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function HmisUploadSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const today = todayISO();
  const queue = useQuery(api.functions.listHmisQueueByDate, { date: today }) ?? [];
  const markChecked = useMutation(api.functions.markHmisChecked);

  const total = queue.length;
  const checkedCount = queue.filter((n) => n.checked).length;
  const allDone = total > 0 && checkedCount === total;

  const handleToggle = async (id: Id<"hmisQueue">, currentChecked: boolean) => {
    await markChecked({ id, checked: !currentChecked });
  };

  const handleSendReport = async () => {
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/admin/hmis-eod-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          notes: queue.map((n) => ({
            clientName: n.clientName,
            type: n.type,
            summary: n.summary,
            staff: n.staff,
            checkedAt: n.checkedAt,
          })),
        }),
      });
      if (!res.ok) throw new Error("Server error");
      setSent(true);
    } catch {
      setSendError("Failed to send. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (collapsed) {
    return (
      <div className="w-10 bg-charcoal-900 border-r border-charcoal-800 flex flex-col items-center py-4 gap-3 shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-800 transition"
          title="Open HMIS Upload Queue"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <div
          className="writing-vertical text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-2"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          HMIS Queue
        </div>
        {total > 0 && (
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              allDone ? "bg-teal-500 text-white" : "bg-amber-500 text-white"
            }`}
          >
            {total - checkedCount || "✓"}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="w-72 bg-charcoal-900 border-r border-charcoal-800 flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-charcoal-800 shrink-0">
        <a
          href="https://your-org.hmis-system.com/login"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Clarity HMIS"
          className="flex items-center gap-2 group"
        >
          <Upload className="w-4 h-4 text-teal-400 group-hover:text-teal-300 transition" />
          <span className="font-bold text-white text-sm group-hover:text-teal-300 transition">Upload to Clarity HMIS</span>
          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-teal-400 transition" />
        </a>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-800 transition"
          title="Collapse"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-3 border-b border-charcoal-800 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-400 font-medium">Today&apos;s Notes</span>
          <span className={`text-xs font-bold ${allDone ? "text-teal-400" : "text-amber-400"}`}>
            {checkedCount}/{total}
          </span>
        </div>
        <div className="w-full bg-charcoal-800 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${allDone ? "bg-teal-500" : "bg-amber-500"}`}
            style={{ width: total > 0 ? `${(checkedCount / total) * 100}%` : "0%" }}
          />
        </div>
      </div>

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto py-2">
        {queue === undefined ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
          </div>
        ) : total === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-slate-500 text-xs leading-relaxed">No case notes saved today yet.<br />Notes appear here automatically after saving.</p>
          </div>
        ) : (
          queue.map((item) => (
            <button
              key={item._id}
              onClick={() => handleToggle(item._id as Id<"hmisQueue">, item.checked)}
              className={`w-full text-left px-4 py-3 border-b border-charcoal-800/60 hover:bg-charcoal-800/60 transition group ${
                item.checked ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-teal-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold leading-none mb-1 ${item.checked ? "line-through text-slate-500" : "text-white"}`}>
                    {item.clientName}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{item.type}</p>
                  <p className="text-[10px] text-slate-600 truncate mt-0.5">{item.staff}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* EOD Report button */}
      <div className="p-4 border-t border-charcoal-800 shrink-0">
        {sent ? (
          <div className="flex items-center gap-2 bg-teal-900/50 border border-teal-700 rounded-xl px-4 py-3">
            <MailCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <p className="text-xs text-teal-300 font-semibold">EOD report sent!</p>
          </div>
        ) : (
          <>
            {sendError && (
              <div className="flex items-center gap-2 bg-rose-900/40 border border-rose-800 rounded-xl px-3 py-2 mb-2">
                <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                <p className="text-[11px] text-rose-300">{sendError}</p>
              </div>
            )}
            <button
              onClick={handleSendReport}
              disabled={!allDone || sending}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                allDone && !sending
                  ? "bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-900/50"
                  : "bg-charcoal-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {sending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <MailCheck className="w-3.5 h-3.5" />
                  {allDone ? "Send EOD Report" : `${total - checkedCount} note${total - checkedCount === 1 ? "" : "s"} remaining`}
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-600 text-center mt-2 leading-relaxed">
                  Recipient configured via HMIS_REPORT_EMAIL env var
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
