import type { AppRole } from "./authz";

/**
 * Actions a caller can attempt on a resource.
 */
export type PolicyAction = "read" | "write" | "execute" | "admin";

/**
 * Named resources that have explicit policy rules.
 */
export type PolicyResource =
  | "secure-data"       // /api/secure-data/[key]        — encrypted user records
  | "secure-data:notes" // specific per-key overrides (inherits "secure-data" if absent)
  | "secure-data:docs"
  | "secure-data:journals"
  | "secure-data:feedback"
  | "secure-data:shoutouts"
  | "secure-data:smartgoals"
  | "secure-data:requests"
  | "terminal"          // /api/terminal                 — command execution
  | "compliance"        // /api/admin/compliance         — full compliance status (staff only)
  | "compliance-summary" // /api/compliance/status       — safe summary for any auth'd user
  | "audit-log";        // future /api/admin/audit       — audit trail review

interface PolicyRule {
  roles: AppRole[];
  actions: PolicyAction[];
}

/**
 * Top-level policy map.
 *
 * Rules are evaluated in order; the first matching (role + action) wins.
 * If no rule matches, access is denied.
 *
 * Per-key secure-data overrides fall back to "secure-data" if not explicitly listed.
 */
const POLICIES: Record<string, PolicyRule[]> = {
  "secure-data": [
    // Staff can read/write any data key for any user (case worker access)
    { roles: ["staff"], actions: ["read", "write"] },
    // Clients can only read/write their own data (enforced in route, not here)
    { roles: ["client"], actions: ["read", "write"] },
  ],

  // Override: feedback and shoutouts are write-only for clients (they submit, not read history)
  "secure-data:feedback": [
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["write"] },
  ],
  "secure-data:shoutouts": [
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["write"] },
  ],

  "terminal": [
    // Only staff can execute commands
    { roles: ["staff"], actions: ["execute"] },
  ],

  "compliance": [
    // Only staff can view the full admin compliance status
    { roles: ["staff"], actions: ["read", "admin"] },
  ],

  "compliance-summary": [
    // Any authenticated user can view the client-safe security summary
    { roles: ["staff"], actions: ["read"] },
    { roles: ["client"], actions: ["read"] },
  ],

  "audit-log": [
    // Only staff can read the audit trail
    { roles: ["staff"], actions: ["read"] },
  ],
};

/**
 * Returns true if the given role is permitted to perform `action` on `resource`.
 *
 * Falls back from "secure-data:{key}" → "secure-data" if no specific rule exists.
 */
export function can(role: AppRole, resource: PolicyResource, action: PolicyAction): boolean {
  const rules = POLICIES[resource] ?? POLICIES[resource.split(":")[0]] ?? [];
  return rules.some(
    (rule) => rule.roles.includes(role) && rule.actions.includes(action)
  );
}

/**
 * Convenience: throws a structured error object if access is denied.
 * Use in API routes after retrieving `auth.role`.
 */
export function enforce(
  role: AppRole,
  resource: PolicyResource,
  action: PolicyAction
): { allowed: true } | { allowed: false; status: 403; error: string } {
  if (can(role, resource, action)) {
    return { allowed: true };
  }
  return {
    allowed: false,
    status: 403,
    error: `Role '${role}' is not permitted to perform '${action}' on '${resource}'`,
  };
}
