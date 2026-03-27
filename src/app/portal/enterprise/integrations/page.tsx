"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Mail, MessageSquare, Cloud, Database, RefreshCw, SendHorizonal, XCircle } from "lucide-react";
import { fetchEnterpriseControlCenter, type EnterpriseControlCenterResponse } from "@/lib/enterprise-control-client";

export default function EnterpriseIntegrationsPage() {
  const [data, setData] = useState<EnterpriseControlCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      const payload = await fetchEnterpriseControlCenter();
      setData(payload);
      setEmail(payload.settings.admin_email);
    } catch {
      setMessage("Failed to load integrations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function sendTestEmail() {
    setSending(true);
    setMessage("");
    try {
      const res = await fetch("/api/enterprise/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject: "Enterprise Workspace Test Email" }),
      });
      if (!res.ok) throw new Error();
      setMessage("Test email sent.");
    } catch {
      setMessage("Failed to send test email.");
    } finally {
      setSending(false);
    }
  }

  if (loading || !data) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading integrations...</div>;
  }

  const items = [
    { label: "Resend Email", ok: data.integrations.resend, icon: Mail, detail: "Transactional email delivery" },
    { label: "Google OAuth", ok: data.integrations.googleOAuth, icon: Cloud, detail: "Workspace authentication and SSO" },
    { label: "Google Chat", ok: data.integrations.googleChatWebhook, icon: MessageSquare, detail: "Operational chat notifications" },
    { label: "Convex", ok: data.integrations.convex, icon: Database, detail: "Realtime backend and state" },
    { label: "Blob Storage", ok: data.integrations.blob, icon: Database, detail: "Private file storage" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Integrations and Connectors</h1>
          <p className="mt-1 text-sm text-slate-500">Connector health, outbound delivery, and workspace service dependencies.</p>
        </div>
        <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800"><Icon className="h-4 w-4 text-cyan-600" /> {item.label}</div>
                {item.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
              </div>
              <p className="mt-3 text-xs text-slate-500">{item.detail}</p>
              <p className={`mt-3 text-xs font-semibold ${item.ok ? "text-emerald-700" : "text-rose-700"}`}>{item.ok ? "Connected" : "Attention needed"}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Email Delivery Validation</h2>
          <p className="text-xs text-slate-500">Send a live test through the configured Resend integration using enterprise admin privileges.</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@sdtoolsinc.org" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <button type="button" onClick={() => void sendTestEmail()} disabled={sending || !data.platformOperations.canTestEmail} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700 disabled:opacity-60">
            <SendHorizonal className="h-4 w-4" /> {sending ? "Sending..." : "Send Test Email"}
          </button>
          {!data.platformOperations.canTestEmail && <p className="text-xs text-amber-700">Resend is not configured in the current environment.</p>}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Connector Notes</h2>
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="rounded-lg bg-slate-50 p-3">Google OAuth remains the enterprise identity backbone for staff and admin accounts.</li>
            <li className="rounded-lg bg-slate-50 p-3">Google Chat webhook health determines whether operational alerts can be routed to workspace channels.</li>
            <li className="rounded-lg bg-slate-50 p-3">Convex and Blob status directly impact document delivery, audit persistence, and realtime operations.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">{message || "Enterprise connectors are online."}</div>
    </div>
  );
}
