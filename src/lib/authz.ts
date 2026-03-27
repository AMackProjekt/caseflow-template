import { auth } from "@/auth";

export type AppRole = "staff" | "client" | "admin";

export async function getAuthContext() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? null;
  const role = (session?.user?.role as AppRole | undefined) ?? "client";
  return {
    session,
    email,
    role,
    isAuthenticated: Boolean(email),
  };
}

/**
 * Returns true if the caller's role satisfies the required minimum role.
 * Hierarchy: admin > staff > client
 */
export function hasRole(required: AppRole, role: AppRole): boolean {
  if (required === "client") return true; // everyone qualifies
  if (required === "staff") return role === "staff" || role === "admin";
  if (required === "admin") return role === "admin";
  return false;
}
