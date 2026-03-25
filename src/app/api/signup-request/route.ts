import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const APPROVE_ADMIN_EMAIL = "donyale@yourorg.org";
const DENY_ADMIN_EMAIL = "noreply@yourorg.org";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://caseflow-template.vercel.app";

function requestDetailsTable(name: string, email: string, note: string | undefined, date: string) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return `
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 0;color:#64748b;width:130px;font-weight:500;">Full Name</td>
        <td style="padding:10px 0;font-weight:700;color:#0f172a;">${name}</td>
      </tr>
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 0;color:#64748b;font-weight:500;">Email Address</td>
        <td style="padding:10px 0;font-weight:600;color:#0f172a;">${email}</td>
      </tr>
      ${note ? `
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 0;color:#64748b;font-weight:500;vertical-align:top;">Message / Note</td>
        <td style="padding:10px 0;color:#0f172a;line-height:1.6;">${note}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:10px 0;color:#64748b;font-weight:500;">Submitted At</td>
        <td style="padding:10px 0;color:#0f172a;">${formattedDate}</td>
      </tr>
    </table>`;
}

export async function POST(req: NextRequest) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const resendApprove = new Resend(process.env.RESEND_API_KEY);
  const resendDeny = new Resend(process.env.RESEND_API_KEY_2);

  const body = await req.json();
  const { name, email, note } = body as { name: string; email: string; note?: string };

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const token = randomBytes(32).toString("hex");
  const date = new Date().toISOString();

  await convex.mutation(api.functions.createSignupRequest, {
    name,
    email,
    note,
    token,
    date,
  });

  const approveUrl = `${BASE_URL}/api/signup-request/approve?token=${token}`;
  const denyUrl = `${BASE_URL}/api/signup-request/deny?token=${token}`;
  const detailsTable = requestDetailsTable(name, email, note, date);

  const adminEmailHtml = `
    <div style="font-family:sans-serif;max-width:620px;margin:0 auto;padding:32px 24px;background:#f8fafc;">
      <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.07);">
        <div style="border-left:4px solid #1e3a5f;padding-left:16px;margin-bottom:24px;">
          <h2 style="color:#1e3a5f;margin:0 0 4px;">New Client Portal Access Request</h2>
          <p style="color:#64748b;margin:0;font-size:14px;">A new request is pending review and requires action.</p>
        </div>
        ${detailsTable}
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
        <p style="color:#0f172a;margin-bottom:20px;font-size:15px;">
          Please review the information above and take one of the following actions.
          Approving will send the applicant a sign-in link; denying will notify them that their request was not approved.
        </p>
        <div>
          <a href="${approveUrl}" style="display:inline-block;padding:13px 32px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;margin-right:12px;">✓ Approve Access</a>
          <a href="${denyUrl}" style="display:inline-block;padding:13px 32px;background:#dc2626;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">✗ Deny Access</a>
        </div>
        <p style="margin-top:20px;font-size:13px;color:#94a3b8;">
          Each link is single-use and will expire once acted upon. Only one action can be taken per request.
        </p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
        <p style="color:#94a3b8;font-size:12px;margin:0;">Your Organization — Staff Portal System &bull; <a href="${BASE_URL}" style="color:#94a3b8;">${BASE_URL}</a></p>
      </div>
    </div>
  `;

  // Send to donyale@yourorg.org (RESEND_API_KEY)
  await resendApprove.emails.send({
    from: "Portal <onboarding@resend.dev>",
    to: APPROVE_ADMIN_EMAIL,
    subject: `[Action Required] New Portal Access Request — ${name}`,
    html: adminEmailHtml,
  });

  // Send to noreply@yourorg.org (RESEND_API_KEY_2)
  await resendDeny.emails.send({
    from: "Portal <onboarding@resend.dev>",
    to: DENY_ADMIN_EMAIL,
    subject: `[Action Required] New Portal Access Request — ${name}`,
    html: adminEmailHtml,
  });

  return NextResponse.json({ ok: true });
}
