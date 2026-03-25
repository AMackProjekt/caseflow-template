import { auth } from "@/auth";
import { NextResponse } from "next/server";


const DFC_DOMAIN = "yourorg.org";

async function verifyTwoFACookie(cookieValue: string, email: string): Promise<boolean> {
  try {
    const parts = cookieValue.split("|");
    if (parts.length !== 3) return false;
    const [emailB64, expiryStr, sig] = parts;
    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry) || Date.now() > expiry) return false;

    const secret = process.env.TWO_FA_SECRET ?? "fallback-dev-secret";
    const payload = `${emailB64}|${expiryStr}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const expectedSig = btoa(String.fromCharCode(...new Uint8Array(sigBytes)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    if (sig !== expectedSig) return false;

    // Decode email from base64url
    const decodedEmail = atob(emailB64.replace(/-/g, "+").replace(/_/g, "/"));
    return decodedEmail === email;
  } catch {
    return false;
  }
}

// auth() from next-auth v5 wraps the handler; the callback can be async
export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  const role = req.auth?.user?.role ?? "client";
  const isAuthenticated = Boolean(req.auth?.user?.email);
  const userEmail = req.auth?.user?.email ?? "";

  const isPortal = pathname.startsWith("/portal/");
  const isProtectedApi = pathname.startsWith("/api/") && !pathname.startsWith("/api/auth") && pathname !== "/api/health";

  if (!isPortal && !isProtectedApi && !pathname.startsWith("/auth/2fa")) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL(
      pathname.startsWith("/portal/client") ? "/login/client" : "/login/staff",
      req.url
    ));
  }

  // ── Enforce admin role for admin portal ──────────────────────────────────
  const needsAdminRole = pathname.startsWith("/portal/admin");
  if (needsAdminRole && role !== "admin") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Redirect based on their actual role
    const fallback = role === "staff" ? "/portal/staff" : "/portal/client";
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  // ── Enforce @yourorg.org domain for staff portal ──────────────────
  const needsStaffRole =
    pathname.startsWith("/portal/staff") ||
    pathname === "/api/terminal" ||
    pathname.startsWith("/api/admin");

  if (needsStaffRole && (role !== "staff" || !userEmail.endsWith(`@${DFC_DOMAIN}`))) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/portal/client", req.url));
  }

  // ── 2FA gate: skip for the 2FA page itself, API routes, and client-credentials users ────────────
  // Clients who use password auth don't need 2FA (they already have password protection)
  // Staff/Admin use Google OAuth and require 2FA
  if (!pathname.startsWith("/auth/2fa") && !pathname.startsWith("/api/") && role !== "client") {
    const twofaCookie = req.cookies.get("twofa_verified")?.value ?? "";
    const twoFAValid = twofaCookie ? await verifyTwoFACookie(twofaCookie, userEmail) : false;
    if (!twoFAValid) {
      return NextResponse.redirect(new URL("/auth/2fa", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/portal/:path*", "/api/((?!auth/).*)", "/auth/2fa"],
};
