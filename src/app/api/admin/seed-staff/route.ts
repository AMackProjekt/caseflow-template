import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const SEED_TOKEN = process.env.SETUP_TOKEN ?? "";

// Case Managers — alphabetical order
const CASE_MANAGERS = [
  { memberId: "abby",     name: "Alex",     role: "Case Manager" },
  { memberId: "amalia",   name: "Morgan",   role: "Case Manager" },
  { memberId: "coco",     name: "Jordan",     role: "Case Manager" },
  { memberId: "jonathan", name: "Riley", role: "Case Manager" },
  { memberId: "lawanda",  name: "Casey",  role: "Case Manager" },
  { memberId: "mack",     name: "Taylor",     role: "Case Manager" },
  { memberId: "spencer",  name: "Sam",  role: "Case Manager" },
  { memberId: "tey",      name: "Quinn",      role: "Case Manager" },
  { memberId: "tonya",    name: "Drew",    role: "Case Manager" },
  { memberId: "william",  name: "Blake",  role: "Case Manager" },
];

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!SEED_TOKEN || !token || token !== SEED_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  // Wipe and re-seed for idempotency
  await convex.mutation(api.functions.clearTeamMembers, {});

  const results: { name: string; ok: boolean }[] = [];
  for (const m of CASE_MANAGERS) {
    try {
      await convex.mutation(api.functions.upsertTeamMember, m);
      results.push({ name: m.name, ok: true });
    } catch (err) {
      results.push({ name: m.name, ok: false });
      console.error(`seed-staff: failed to upsert ${m.name}`, err);
    }
  }

  const failed = results.filter((r) => !r.ok);
  return NextResponse.json(
    { seeded: results.filter((r) => r.ok).length, failed: failed.length, members: results },
    { status: failed.length === 0 ? 200 : 207 }
  );
}
