import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Resend } from "resend";
import { ORG } from "@/config/org";
import { getBaseUrl } from "@/lib/runtime-config";

const BASE_URL = getBaseUrl();

const html = (title: string, color: string, icon: string, body: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<style>
  body{font-family:sans-serif;background:#f1f5f9;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
  .card{background:#fff;border-radius:12px;padding:40px;max-width:420px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08);text-align:center;}
  .icon{font-size:48px;margin-bottom:16px;}
  h1{color:${color};margin:0 0 8px;}
  p{color:#64748b;line-height:1.6;margin:0;}
</style>
</head>
<body><div class="card"><div class="icon">${icon}</div><h1>${title}</h1><p>${body}</p></div></body>
</html>`;

export async function GET(req: NextRequest) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const resend = new Resend(process.env.RESEND_API_KEY_2);
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse(
      html("Invalid Link", "#dc2626", "⚠️", "This denial link is missing a token."),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  const request = await convex.query(api.functions.getSignupRequestByToken, { token });

  if (!request) {
    return new NextResponse(
      html("Not Found", "#dc2626", "⚠️", "This request could not be found. It may have already been processed or the link is invalid."),
      { status: 404, headers: { "Content-Type": "text/html" } }
    );
  }

  if (request.status !== "pending") {
    return new NextResponse(
      html(
        "Already Processed",
        "#64748b",
        "ℹ️",
        `This request was already <strong>${request.status}</strong>. No further action needed.`
      ),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }

  await convex.mutation(api.functions.updateSignupRequestStatus, { token, status: "denied" });

  await resend.emails.send({
    from: `${ORG.productName} <${ORG.fromEmail}>`,
    to: request.email,
    subject: `Update on Your ${ORG.name} Portal Access Request`,
    html: `
      <div style="font-family:sans-serif;max-width:620px;margin:0 auto;padding:32px 24px;background:#f8fafc;">
        <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.07);">
          <div style="text-align:center;margin-bottom:28px;">
            <div style="font-size:52px;margin-bottom:12px;">📋</div>
            <h2 style="color:#1e3a5f;margin:0 0 8px;font-size:24px;">Request Update</h2>
            <p style="color:#64748b;margin:0;font-size:15px;">An update on your ${ORG.name} portal access request.</p>
          </div>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;" />
          <p style="color:#0f172a;font-size:15px;line-height:1.6;">Hi <strong>${request.name}</strong>,</p>
          <p style="color:#0f172a;font-size:15px;line-height:1.6;">
            Thank you for your interest in the <strong>${ORG.name}</strong> client portal. After reviewing your request, we are unable to grant portal access at this time.
          </p>
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="color:#991b1b;font-size:14px;margin:0;">
              If you believe this decision was made in error, or if your circumstances have changed, please contact our team directly for further assistance.
            </p>
          </div>
          <p style="color:#64748b;font-size:14px;line-height:1.6;">
            You may reach us at <a href="mailto:${ORG.supportEmail}" style="color:#0d9488;">${ORG.supportEmail}</a> if you have questions or would like to discuss your eligibility.
          </p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
          <p style="color:#94a3b8;font-size:12px;margin:0;">${ORG.name} — Client Support Portal &bull; <a href="${BASE_URL}" style="color:#94a3b8;">${BASE_URL}</a></p>
        </div>
      </div>
    `,
  });

  return new NextResponse(
    html(
      "Request Denied",
      "#dc2626",
      "❌",
      `You have denied <strong>${request.name}</strong>'s request for portal access. A notification has been sent to <strong>${request.email}</strong>.`
    ),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
