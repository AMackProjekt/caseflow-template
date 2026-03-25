import { appendFile, mkdir } from "fs/promises";
import path from "path";

interface AuditEvent {
  actor: string;
  role: string;
  action: string;
  resource: string;
  status: "success" | "failure";
  details?: Record<string, unknown>;
}

const auditPath = path.join(process.cwd(), ".data", "audit.log");

export async function logAudit(event: AuditEvent) {
  const line = JSON.stringify({
    at: new Date().toISOString(),
    ...event,
  });

  try {
    await mkdir(path.dirname(auditPath), { recursive: true });
    await appendFile(auditPath, `${line}\n`, "utf8");
  } catch {
    console.info("audit", line);
  }
}
