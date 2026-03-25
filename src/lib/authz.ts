import { auth } from "@/auth";

export type AppRole = "staff" | "client";

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

export function hasRole(required: AppRole, role: AppRole) {
  if (required === "client") return role === "client" || role === "staff";
  return role === "staff";
}
