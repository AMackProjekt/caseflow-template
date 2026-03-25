import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const FORWARDING_EMAIL = "donyale@yourorg.org";
const RESEND = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { clientName, date, type, summary, staff } = await req.json();

  if (!clientName || !summary) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  await RESEND.emails.send({
    from: "CaseFlow Notifications <donyale@yourorg.org>",
    to: FORWARDING_EMAIL,
    subject: `New Case Note: ${clientName} (${type || "General"})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:8px;padding:24px;">
        <div style="background:#0f172a;color:#fff;border-radius:6px;padding:16px;margin-bottom:20px;">
          <h1 style="margin:0;font-size:18px;font-weight:700;">Case Note Created</h1>
          <p style="margin:4px 0 0;color:#cbd5e1;font-size:13px;">CaseFlow Portal</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:10px 0;color:#64748b;font-weight:500;width:120px;">Client:</td>
            <td style="padding:10px 0;color:#0f172a;font-weight:700;">${clientName}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:10px 0;color:#64748b;font-weight:500;">Type:</td>
            <td style="padding:10px 0;color:#0f172a;">${type || "General"}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:10px 0;color:#64748b;font-weight:500;">Staff:</td>
            <td style="padding:10px 0;color:#0f172a;">${staff || "Unknown"}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#64748b;font-weight:500;">Date:</td>
            <td style="padding:10px 0;color:#0f172a;">${formattedDate}</td>
          </tr>
        </table>
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:16px;margin-bottom:20px;">
          <h3 style="margin:0 0 8px;color:#0f172a;font-weight:700;">Summary</h3>
          <p style="margin:0;color:#475569;line-height:1.6;white-space:pre-wrap;">${summary}</p>
        </div>
        <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
          This is an automated notification from CaseFlow. Do not reply to this email.
        </p>
      </div>`,
  });

  return NextResponse.json({ ok: true });
}
