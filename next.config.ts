import type { NextConfig } from "next";
import path from "path";

// Security headers applied at the static-file / CDN layer.
// The middleware applies these dynamically to every SSR response as well —
// the two layers combined ensure no response ever lacks security headers.
const STATIC_SECURITY_HEADERS = [
  { key: "X-Frame-Options",           value: "DENY" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "X-DNS-Prefetch-Control",    value: "off" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  async headers() {
    return [
      // Apply security headers to every route
      {
        source: "/(.*)",
        headers: STATIC_SECURITY_HEADERS,
      },
      // Service-worker must revalidate on every load
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      // Manifest can cache for 24 h
      {
        source: "/manifest.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
