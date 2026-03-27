import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { timingSafeEqual } from "crypto";
import { api } from "../../../../../convex/_generated/api";
import { auth } from "@/auth";

const SEED_TOKEN = process.env.SETUP_TOKEN ?? "";

function tokenMatches(provided: string): boolean {
  if (!SEED_TOKEN || !provided) return false;
  try {
    const a = Buffer.from(provided, "utf8");
    const b = Buffer.from(SEED_TOKEN, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// Tier 4 Roster — Mack's assignments (sourced from "Copy of Test Copy of Current Tent Layout.xlsx")
const ORIGINAL_CASELOAD = [
  // ── A Row ───────────────────────────────────────────────────────────────
  { slot: "A1",  name: 'Christopher "Memphis" Greer',              status: "Active",          environment: "A Row" },
  { slot: "A2",  name: "Calvin Hobby",                              status: "Active",          environment: "A Row" },
  { slot: "A3",  name: "Brett Purettman / Sheila Martinez",         status: "Scheduled Exit",  environment: "A Row" },
  { slot: "A4",  name: 'Tianna "Diamond" Hoover',                  status: "Active",          environment: "A Row" },
  { slot: "A5",  name: "Victor / Rosanna Vasquez",                  status: "Active (Shared)", environment: "A Row" },
  { slot: "A6",  name: "(Offline)",                                 status: "Offline",         environment: "A Row" },
  { slot: "A7",  name: "Martin Navarette",                          status: "Active",          environment: "A Row" },
  { slot: "A8",  name: "Heather Navarette",                         status: "Active",          environment: "A Row" },
  { slot: "A9",  name: "Ian Buonamici",                             status: "Active",          environment: "A Row" },
  { slot: "A10", name: 'Orrin "Keith" Page',                        status: "Housing Match",   environment: "A Row" },
  { slot: "A11", name: "Donald Larking",                            status: "Active",          environment: "A Row" },
  { slot: "A12", name: "Rachael Kolacz",                            status: "Active",          environment: "A Row" },
  { slot: "A13", name: "Christopher Angus",                         status: "Active",          environment: "A Row" },
  { slot: "A14", name: "Juan Vargas",                               status: "Active",          environment: "A Row" },
  { slot: "A15", name: "Daniel Wafula",                             status: "Active",          environment: "A Row" },
  { slot: "A16", name: "(Offline)",                                 status: "Offline",         environment: "A Row" },
  { slot: "A17", name: "(Offline)",                                 status: "Offline",         environment: "A Row" },
  { slot: "A18", name: "Nichole \"Nikki\" O'Dell / Jordan Robins",  status: "Active (Shared)", environment: "A Row" },
  // ── D Row ───────────────────────────────────────────────────────────────
  { slot: "D9",  name: "John Bankhead",                             status: "Active",          environment: "D Row" },
  { slot: "D10", name: "Anthony Jones",                             status: "Active",          environment: "D Row" },
  { slot: "D12", name: "Erick Perez",                               status: "Active",          environment: "D Row" },
  // ── J Row ───────────────────────────────────────────────────────────────
  { slot: "J8",  name: "Alisa Foster",                              status: "Active",          environment: "J Row" },
  { slot: "J9",  name: "Anthony Garner",                            status: "Active",          environment: "J Row" },
  { slot: "J10", name: "Ernestina Alvarado",                        status: "Active",          environment: "J Row" },
];

export async function POST(req: NextRequest) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const isSetupToken = tokenMatches(token);

  if (!isAdmin && !isSetupToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  // Clear all existing participants first
  await convex.mutation(api.functions.clearAllParticipants, {});

  const results: { slot: string; ok: boolean }[] = [];
  for (const p of ORIGINAL_CASELOAD) {
    try {
      await convex.mutation(api.functions.upsertParticipant, p);
      results.push({ slot: p.slot, ok: true });
    } catch (err) {
      results.push({ slot: p.slot, ok: false });
      console.error(`seed-caseload: failed to upsert ${p.slot}`, err);
    }
  }

  const failed = results.filter((r) => !r.ok);
  return NextResponse.json(
    {
      seeded: results.filter((r) => r.ok).length,
      failed: failed.length,
      slots: results,
    },
    { status: failed.length === 0 ? 200 : 207 }
  );
}
