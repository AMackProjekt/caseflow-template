import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.Champions_Web_Hook;
  if (!webhookUrl) {
    return NextResponse.json({ error: "GOOGLE_CHAT_WEBHOOK_URL not configured" }, { status: 503 });
  }

  const { name, email, slot } = await req.json() as { name: string; email: string; slot: string };

  if (!name || !email || !slot) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const message = {
    text: `🆕 *New Gmail client added to caseload*\n\n*Name:* ${name}\n*Email:* ${email}\n*Slot:* ${slot}\n\nPlease invite this client to the Google Chat space so they can participate in the channel.`,
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to post to Google Chat" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
