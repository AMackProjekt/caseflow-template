"use client";

import GoogleChatEmbed from "@/components/GoogleChatEmbed";

// Staff use a dedicated space for case management coordination
const STAFF_SPACE_ID = "AAQABMc-VMI";

export default function StaffMessages() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-charcoal-900 tracking-tight">
          Case <span className="text-slate-600">Coordination</span>.
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Collaborate with your team and manage participant communications via Google Chat.
        </p>
      </div>

      {/* Embedded Chat */}
      <GoogleChatEmbed
        spaceId={STAFF_SPACE_ID}
        spaceName="Staff Workspace"
        themeColor="slate"
        portalType="staff"
      />
    </div>
  );
}
