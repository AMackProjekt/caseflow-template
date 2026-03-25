import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { decryptJson, encryptJson } from "@/lib/crypto";
import { getEncryptedRecord, setEncryptedRecord } from "@/lib/server-data-store";
import { getAuthContext } from "@/lib/authz";
import { logAudit } from "@/lib/audit";
import { enforce } from "@/lib/policy";
import type { PolicyResource } from "@/lib/policy";

const PutBodySchema = z.object({
  data: z.array(z.unknown()).max(1000),
});

const ALLOWED_KEYS = new Set([
  "notes",
  "docs",
  "journals",
  "feedback",
  "shoutouts",
  "smartgoals",
  "requests",
]);

function sanitizeKey(value: string) {
  return value.toLowerCase().trim();
}

function isPhiWorkflowApproved() {
  return process.env.PHI_WORKFLOW_APPROVED === "true";
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const normalizedKey = sanitizeKey(key);

  if (!ALLOWED_KEYS.has(normalizedKey)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const auth = await getAuthContext();
  if (!auth.isAuthenticated || !auth.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resourceKey = `secure-data:${normalizedKey}` as PolicyResource;
  const policy = enforce(auth.role, resourceKey, "read");
  if (!policy.allowed) {
    return NextResponse.json({ error: policy.error }, { status: policy.status });
  }

  if (!isPhiWorkflowApproved()) {
    return NextResponse.json({ error: "PHI workflow is not approved in this environment" }, { status: 503 });
  }

  const encrypted = await getEncryptedRecord(auth.email, normalizedKey);
  const data = encrypted ? decryptJson<unknown>(encrypted) : [];

  await logAudit({
    actor: auth.email,
    role: auth.role,
    action: "read",
    resource: `secure-data:${normalizedKey}`,
    status: "success",
  });

  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const normalizedKey = sanitizeKey(key);

  if (!ALLOWED_KEYS.has(normalizedKey)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const auth = await getAuthContext();
  if (!auth.isAuthenticated || !auth.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resourceKey = `secure-data:${normalizedKey}` as PolicyResource;
  const policy = enforce(auth.role, resourceKey, "write");
  if (!policy.allowed) {
    return NextResponse.json({ error: policy.error }, { status: policy.status });
  }

  if (!isPhiWorkflowApproved()) {
    return NextResponse.json({ error: "PHI workflow is not approved in this environment" }, { status: 503 });
  }

  const rawBody = await req.json();
  const parsed = PutBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const encrypted = encryptJson(parsed.data.data);
  await setEncryptedRecord(auth.email, normalizedKey, encrypted);

  await logAudit({
    actor: auth.email,
    role: auth.role,
    action: "write",
    resource: `secure-data:${normalizedKey}`,
    status: "success",
  });

  return NextResponse.json({ ok: true });
}
