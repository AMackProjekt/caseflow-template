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
  | "enterprise-control" // /api/enterprise/control-center — enterprise control plane
  | "compliance"        // /api/admin/compliance         — full compliance status (staff only)
  | "compliance-summary" // /api/compliance/status       — safe summary for any auth'd user
  | "audit-log";        // /api/admin/audit              — audit trail review

interface PolicyRule {
  roles: AppRole[];
  actions: PolicyAction[];
}

/**
 * Top-level policy map.
 *
 * Admin always has full access — the admin role check is enforced in middleware,
 * but we include admin in every rule so can() / enforce() work correctly for
 * server-side policy checks inside route handlers.
 */
const POLICIES: Record<string, PolicyRule[]> = {
  "secure-data": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["read", "write"] },
  ],

  "secure-data:feedback": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["write"] },
  ],
  "secure-data:shoutouts": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "write"] },
    { roles: ["client"], actions: ["write"] },
  ],

  "terminal": [
    { roles: ["admin"], actions: ["execute", "admin"] },
    { roles: ["staff"], actions: ["execute"] },
  ],

  "enterprise-control": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
  ],

  "compliance": [
    { roles: ["admin"], actions: ["read", "write", "admin"] },
    { roles: ["staff"], actions: ["read", "admin"] },
  ],

  "compliance-summary": [
    { roles: ["admin"], actions: ["read"] },
    { roles: ["staff"], actions: ["read"] },
    { roles: ["client"], actions: ["read"] },
  ],

  "audit-log": [
    { roles: ["admin"], actions: ["read", "admin"] },
    { roles: ["staff"], actions: ["read"] },
  ],
};

/**
 * Returns true if the given role is permitted to perform `action` on `resource`.
 *
 * Falls back from "secure-data:{key}" → "secure-data" if no specific rule exists.
 */
export function can(role: AppRole, resource: PolicyResource, action: PolicyAction): boolean {
  // Admin bypasses all policy checks
  if (role === "admin") return true;
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
