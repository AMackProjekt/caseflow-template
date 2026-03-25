import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Resend } from "resend";
import { upsertClientCredential } from "@/auth";
import { randomBytes } from "crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://caseflow-template.vercel.app";

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
  const resend = new Resend(process.env.RESEND_API_KEY);
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse(
      html("Invalid Link", "#dc2626", "⚠️", "This approval link is missing a token."),
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

  await convex.mutation(api.functions.updateSignupRequestStatus, { token, status: "approved" });

  const temporaryPassword = randomBytes(6).toString("base64url");
  const username = request.email.split("@")[0].toLowerCase();
  await upsertClientCredential({
    email: request.email,
    username,
    password: temporaryPassword,
    name: request.name,
  });

  const loginUrl = `${BASE_URL}/login/client`;

  await resend.emails.send({
    from: "Portal <noreply@yourorg.org>",
    to: request.email,
    cc: ["donyale@yourorg.org"],
    subject: "You're Approved — Access the Your Organization Client Portal",
    html: `
      <div style="font-family:sans-serif;max-width:620px;margin:0 auto;padding:32px 24px;background:#f8fafc;">
        <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,.07);">
          <div style="text-align:center;margin-bottom:28px;">
            <div style="font-size:52px;margin-bottom:12px;">🎉</div>
            <h2 style="color:#16a34a;margin:0 0 8px;font-size:24px;">You're Approved!</h2>
            <p style="color:#64748b;margin:0;font-size:15px;">Your portal access request has been reviewed and approved.</p>
          </div>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;" />
          <p style="color:#0f172a;font-size:15px;line-height:1.6;">Hi <strong>${request.name}</strong>,</p>
          <p style="color:#0f172a;font-size:15px;line-height:1.6;">
            Welcome to the <strong>Your Organization</strong> client portal! Your access request has been approved and your account is now active.
          </p>
          <p style="color:#0f172a;font-size:15px;line-height:1.6;">
            Use the credentials below to sign in to the client portal. For safety, change this password after your first secure session.
          </p>
          <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:16px 18px;margin:20px 0;">
            <p style="margin:0 0 8px;color:#0f172a;font-size:14px;"><strong>Username</strong>: ${username}</p>
            <p style="margin:0 0 8px;color:#0f172a;font-size:14px;"><strong>Email</strong>: ${request.email}</p>
            <p style="margin:0;color:#0f172a;font-size:14px;"><strong>Temporary Password</strong>: ${temporaryPassword}</p>
          </div>
          <div style="text-align:center;margin:32px 0;">
            <a href="${loginUrl}" style="display:inline-block;padding:16px 40px;background:#0d9488;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">Access My Portal →</a>
          </div>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;">
            <p style="color:#166534;font-size:14px;margin:0 0 8px;"><strong>Getting Started</strong></p>
            <ul style="color:#166534;font-size:14px;margin:0;padding-left:20px;line-height:1.8;">
              <li>Sign in with your username/email and temporary password</li>
              <li>Review your goals and progress with your case manager</li>
              <li>Use the secure messaging feature to communicate with staff</li>
              <li>Access your documents and resources at any time</li>
            </ul>
          </div>
          <p style="color:#64748b;font-size:14px;line-height:1.6;">
            If you have any questions or need assistance getting started, please reach out to your case manager directly through the portal messaging feature.
          </p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
          <p style="color:#94a3b8;font-size:12px;margin:0;">Your Organization — Client Support Portal &bull; <a href="${BASE_URL}" style="color:#94a3b8;">${BASE_URL}</a></p>
        </div>
      </div>
    `,
  });

  return new NextResponse(
    html(
      "Request Approved",
      "#16a34a",
      "✅",
      `You approved <strong>${request.name}</strong>'s request. A sign-in link has been sent to <strong>${request.email}</strong>.`
    ),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
