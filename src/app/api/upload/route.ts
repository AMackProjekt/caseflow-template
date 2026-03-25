import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAuthContext, hasRole } from "@/lib/authz";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]);

export async function POST(req: NextRequest) {
  const { email, role, isAuthenticated } = await getAuthContext();

  if (!isAuthenticated || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasRole("staff", role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const client = (formData.get("client") as string | null) ?? "Unassigned/General";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed. Use PDF, DOCX, JPG, or PNG." },
      { status: 415 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File exceeds 25 MB limit." },
      { status: 413 }
    );
  }

  // Namespace by uploader email so paths are tenant-scoped
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `uploads/${encodeURIComponent(email)}/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "private",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return NextResponse.json({
    url: blob.url,
    name: file.name,
    size: file.size,
    type: file.type,
    client,
  });
}
