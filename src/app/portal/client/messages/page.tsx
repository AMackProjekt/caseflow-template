"use client";

import GoogleChatEmbed from "@/components/GoogleChatEmbed";

// Champions is the client-facing chat space for participant support
const CHAMPIONS_SPACE_ID = "AAQABMc-VMI";

export default function ClientMessages() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-charcoal-900 tracking-tight">
          Messaging <span className="text-teal-500">Channel</span>.
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Communicate with your Case Manager through the Champions Google Chat channel.
        </p>
      </div>

      {/* Embedded Chat */}
      <GoogleChatEmbed
        spaceId={CHAMPIONS_SPACE_ID}
        spaceName="Champions"
        themeColor="teal"
        portalType="client"
      />
    </div>
  );
}
