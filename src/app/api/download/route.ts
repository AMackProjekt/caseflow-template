import { NextRequest, NextResponse } from "next/server";
import { head } from "@vercel/blob";
import { getAuthContext, hasRole } from "@/lib/authz";

/**
 * Serves private Vercel Blob files through an authenticated proxy.
 * Usage: GET /api/download?url=<blob-url>
 *
 * Only authenticated staff can download. The blob URL is never exposed
 * directly to the browser — it is fetched server-side and streamed back.
 */
export async function GET(req: NextRequest) {
  const { isAuthenticated, role } = await getAuthContext();

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasRole("staff", role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const blobUrl = req.nextUrl.searchParams.get("url");
  if (!blobUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Validate it's a real Vercel Blob URL to prevent open-redirect / SSRF.
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(blobUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!parsedUrl.hostname.endsWith(".public.blob.vercel-storage.com") &&
      !parsedUrl.hostname.endsWith(".blob.vercel-storage.com")) {
    return NextResponse.json({ error: "URL not from allowed origin" }, { status: 400 });
  }

  // Confirm the blob exists and get its metadata.
  let meta: Awaited<ReturnType<typeof head>>;
  try {
    meta = await head(blobUrl);
  } catch {
    return NextResponse.json({ error: "Blob not found" }, { status: 404 });
  }

  // Fetch the blob server-side using the BLOB_READ_WRITE_TOKEN.
  const upstream = await fetch(meta.downloadUrl, {
    headers: {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
    },
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: "Failed to fetch blob" }, { status: 502 });
  }

  const contentType = meta.contentType ?? "application/octet-stream";
  const filename = blobUrl.split("/").pop() ?? "download";

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
