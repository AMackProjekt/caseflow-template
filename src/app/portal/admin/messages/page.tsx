"use client";

import GoogleChatEmbed from "@/components/GoogleChatEmbed";

// Admin space for oversight and incident coordination
const ADMIN_SPACE_ID = "AAQABMc-VMI";

export default function AdminMessages() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-charcoal-900 tracking-tight">
          Administrative <span className="text-violet-600">Oversight</span>.
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Monitor critical incidents, coordinate with leadership, and manage system communications.
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 text-lg">🔐</div>
        <div>
          <p className="font-black text-violet-900 text-sm mb-1">All Sessions Audited</p>
          <p className="text-violet-800 text-sm leading-relaxed font-medium">
            All messages and activity in this channel are logged and audited for compliance. Actions are attributable
            to individual staff members and cannot be anonymized.
          </p>
        </div>
      </div>

      {/* Embedded Chat */}
      <GoogleChatEmbed
        spaceId={ADMIN_SPACE_ID}
        spaceName="Admin Workspace"
        themeColor="violet"
        portalType="admin"
      />
    </div>
  );
}
