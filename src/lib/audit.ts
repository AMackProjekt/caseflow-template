import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export interface AuditEvent {
  actor: string;
  role: string;
  action: string;
  resource: string;
  status: "success" | "failure";
  details?: Record<string, unknown>;
  ip?: string;
}

/**
 * Writes an audit event to the Convex auditLogs table.
 * All PHI-adjacent operations (reads, writes, auth failures) must call this.
 * Never throws — logs to stderr as a fallback so the caller is never blocked.
 */
export async function logAudit(event: AuditEvent): Promise<void> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.warn("[audit] NEXT_PUBLIC_CONVEX_URL not set — falling back to stderr");
    console.info("[audit]", JSON.stringify({ at: new Date().toISOString(), ...event }));
    return;
  }

  try {
    const client = new ConvexHttpClient(convexUrl);
    await client.mutation(api.functions.addAuditLog, {
      actor: event.actor,
      actorRole: event.role,
      action: event.action,
      target: event.resource,
      targetType: "api",
      detail: event.details ? JSON.stringify(event.details) : undefined,
      timestamp: Date.now(),
      ip: event.ip,
    });
  } catch (err) {
    // Never let audit logging crash the caller
    console.error("[audit] Failed to persist audit log:", err);
    console.info("[audit]", JSON.stringify({ at: new Date().toISOString(), ...event }));
  }
}
