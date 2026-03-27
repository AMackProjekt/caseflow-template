import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Org domain read from environment (no hardcoded values) ───────────────────
const ORG_DOMAIN = (process.env.WORKSPACE_DOMAIN ?? "sdtoolsinc.org").toLowerCase();

// ── Security headers applied to every response ───────────────────────────────
// Content-Security-Policy is deliberately restrictive; loosen only as needed.
const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-DNS-Prefetch-Control": "off",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval in dev; tighten for prod via nonce
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' blob: data: https:",
    "connect-src 'self' https://*.convex.cloud https://*.convex.site wss://*.convex.cloud https://vercel-insights.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; "),
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

// ── In-process rate limiter (per IP, per route prefix) ───────────────────────
// This is a best-effort edge guard. For production at scale, back this with
// Vercel's built-in rate limiting or an upstash/redis token bucket.
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_RULES: Array<{ prefix: string; maxRequests: number; windowMs: number }> = [
  { prefix: "/api/auth/forgot-password", maxRequests: 5,  windowMs: 15 * 60 * 1000 },
  { prefix: "/api/auth/reset-password",  maxRequests: 5,  windowMs: 15 * 60 * 1000 },
  { prefix: "/api/auth/2fa",             maxRequests: 10, windowMs: 5  * 60 * 1000 },
  { prefix: "/api/signup-request",       maxRequests: 10, windowMs: 60 * 60 * 1000 },
  { prefix: "/login",                    maxRequests: 20, windowMs: 5  * 60 * 1000 },
];

function isRateLimited(req: NextRequest): boolean {
  const pathname = req.nextUrl.pathname;
  const rule = RATE_LIMIT_RULES.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return false;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const bucketKey = `${ip}:${rule.prefix}`;
  const now = Date.now();
  const bucket = rateLimitMap.get(bucketKey);

  if (!bucket || now - bucket.windowStart > rule.windowMs) {
    rateLimitMap.set(bucketKey, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > rule.maxRequests) return true;
  return false;
}

// ── 2FA cookie verification ───────────────────────────────────────────────────
async function verifyTwoFACookie(cookieValue: string, email: string): Promise<boolean> {
  try {
    const secret = process.env.TWO_FA_SECRET;
    if (!secret) {
      // In dev we skip 2FA if the secret is not set; in production this is a hard error
      if (process.env.NODE_ENV === "production") return false;
      return true; // dev convenience only
    }

    const parts = cookieValue.split("|");
    if (parts.length !== 3) return false;
    const [emailB64, expiryStr, sig] = parts;
    const expiry = parseInt(expiryStr, 10);
    if (isNaN(expiry) || Date.now() > expiry) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const payload = `${emailB64}|${expiryStr}`;
    const sigBytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const expectedSig = btoa(String.fromCharCode(...new Uint8Array(sigBytes)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    if (sig !== expectedSig) return false;

    const decodedEmail = atob(emailB64.replace(/-/g, "+").replace(/_/g, "/"));
    return decodedEmail === email;
  } catch {
    return false;
  }
}

// ── Main middleware ───────────────────────────────────────────────────────────
export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  const role = req.auth?.user?.role ?? "client";
  const isAuthenticated = Boolean(req.auth?.user?.email);
  const userEmail = req.auth?.user?.email ?? "";

  // ── Rate limiting (applied before auth checks) ──────────────────────────
  if (isRateLimited(req)) {
    const res = NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
    return applySecurityHeaders(res);
  }

  const isPortal = pathname.startsWith("/portal/");
  const isProtectedApi =
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth") &&
    pathname !== "/api/health" &&
    pathname !== "/api/signup-request";

  const needs2FACheck = pathname.startsWith("/auth/2fa");

  if (!isPortal && !isProtectedApi && !needs2FACheck) {
    return applySecurityHeaders(NextResponse.next());
  }

  // ── Authentication gate ─────────────────────────────────────────────────
  if (!isAuthenticated) {
    if (pathname.startsWith("/api/")) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    return applySecurityHeaders(
      NextResponse.redirect(new URL(
        pathname.startsWith("/portal/client") ? "/login/client" : "/login/staff",
        req.url
      ))
    );
  }

  // ── Admin portal role gate ──────────────────────────────────────────────
  const needsAdminRole =
    pathname.startsWith("/portal/admin") ||
    pathname.startsWith("/portal/enterprise") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/enterprise");
  if (needsAdminRole && role !== "admin") {
    if (pathname.startsWith("/api/")) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Forbidden" }, { status: 403 })
      );
    }
    const fallback = role === "staff" ? "/portal/staff" : "/portal/client";
    return applySecurityHeaders(NextResponse.redirect(new URL(fallback, req.url)));
  }

  // ── Staff portal + staff-only API role gate ─────────────────────────────
  const isStaffOrAdmin = role === "staff" || role === "admin";
  const needsStaffRole =
    pathname.startsWith("/portal/staff") || pathname === "/api/terminal";

  if (needsStaffRole && !isStaffOrAdmin) {
    if (pathname.startsWith("/api/")) {
      return applySecurityHeaders(
        NextResponse.json({ error: "Forbidden" }, { status: 403 })
      );
    }
    return applySecurityHeaders(NextResponse.redirect(new URL("/portal/client", req.url)));
  }

  // ── Domain check for Google-authenticated staff / admin ─────────────────
  // Credential-based users are already domain-checked at sign-in time.
  const isGoogleSession = !userEmail || userEmail.includes("@"); // always true; guard is the domain
  if (isStaffOrAdmin && isGoogleSession && userEmail) {
    const emailNorm = userEmail.toLowerCase();
    const orgAdminAllowlist = (process.env.ADMIN_ALLOWLIST ?? "")
      .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    const orgStaffAllowlist = (process.env.STAFF_ALLOWLIST ?? "")
      .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    const onDomain = emailNorm.endsWith(`@${ORG_DOMAIN}`);
    const onAllowlist = orgAdminAllowlist.includes(emailNorm) || orgStaffAllowlist.includes(emailNorm);
    if (!onDomain && !onAllowlist) {
      if (pathname.startsWith("/api/")) {
        return applySecurityHeaders(
          NextResponse.json({ error: "Forbidden" }, { status: 403 })
        );
      }
      return applySecurityHeaders(NextResponse.redirect(new URL("/portal/client", req.url)));
    }
  }

  // ── 2FA gate: staff + admin on portals AND sensitive API routes ──────────
  // Clients using password auth don't require a separate 2FA step.
  const twoFAProtectedApi =
    pathname.startsWith("/api/terminal") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/enterprise");
  const needsTwoFA = role !== "client" && !pathname.startsWith("/auth/2fa");

  if (needsTwoFA && (isPortal || twoFAProtectedApi)) {
    const twofaCookie = req.cookies.get("twofa_verified")?.value ?? "";
    const twoFAValid = twofaCookie ? await verifyTwoFACookie(twofaCookie, userEmail) : false;
    if (!twoFAValid) {
      if (pathname.startsWith("/api/")) {
        return applySecurityHeaders(
          NextResponse.json({ error: "2FA verification required" }, { status: 403 })
        );
      }
      return applySecurityHeaders(NextResponse.redirect(new URL("/auth/2fa", req.url)));
    }
  }

  return applySecurityHeaders(NextResponse.next());
});

export const config = {
  matcher: ["/portal/:path*", "/api/((?!auth/).*)", "/auth/2fa", "/login/:path*"],
};

