import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const SEED_TOKEN = process.env.SETUP_TOKEN ?? "";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!SEED_TOKEN || !token || token !== SEED_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const data = await convex.query(api.functions.exportCaseload, {});

  const { participants, demographics, caseNotes, documents, smartGoals, requests, housingMatches } = data;

  // Index by slot
  const demoBySlot = Object.fromEntries(demographics.map((d) => [d.slot, d]));

  // Index caseNotes by clientName — keep latest per client
  const latestNoteByClient: Record<string, typeof caseNotes[0]> = {};
  const noteCountByClient: Record<string, number> = {};
  for (const n of caseNotes) {
    noteCountByClient[n.clientName] = (noteCountByClient[n.clientName] ?? 0) + 1;
    if (!latestNoteByClient[n.clientName]) latestNoteByClient[n.clientName] = n;
  }

  const docCountByClient: Record<string, number> = {};
  for (const d of documents) {
    docCountByClient[d.client] = (docCountByClient[d.client] ?? 0) + 1;
  }

  const goalCountByClient: Record<string, number> = {};
  const activeGoalsByClient: Record<string, number> = {};
  for (const g of smartGoals) {
    goalCountByClient[g.client] = (goalCountByClient[g.client] ?? 0) + 1;
    if (g.status === "active") activeGoalsByClient[g.client] = (activeGoalsByClient[g.client] ?? 0) + 1;
  }

  const openRequestsByClient: Record<string, number> = {};
  for (const r of requests) {
    if (r.status === "pending") {
      openRequestsByClient[r.client] = (openRequestsByClient[r.client] ?? 0) + 1;
    }
  }

  const housingBySlot = Object.fromEntries(housingMatches.map((h) => [h.clientSlot, h]));

  const rows = participants.map((p) => {
    const d = demoBySlot[p.slot];
    const latestNote = latestNoteByClient[p.name];
    const housing = housingBySlot[p.slot];
    return {
      slot: p.slot,
      name: p.name,
      status: p.status,
      environment: p.environment,
      // Demographics
      firstName: d?.firstName ?? "",
      lastName: d?.lastName ?? "",
      dob: d?.dob ?? "",
      gender: d?.gender ?? "",
      race: d?.race ?? "",
      ethnicity: d?.ethnicity ?? "",
      preferredLanguage: d?.preferredLanguage ?? "",
      phone: d?.phone ?? "",
      email: d?.email ?? "",
      maritalStatus: d?.maritalStatus ?? "",
      housingStatus: d?.housingStatus ?? "",
      employmentStatus: d?.employmentStatus ?? "",
      educationLevel: d?.educationLevel ?? "",
      veteranStatus: d?.veteranStatus ?? "",
      insuranceType: d?.insuranceType ?? "",
      referralSource: d?.referralSource ?? "",
      referralDate: d?.referralDate ?? "",
      emergencyContactName: d?.emergencyContactName ?? "",
      emergencyContactPhone: d?.emergencyContactPhone ?? "",
      emergencyContactRelation: d?.emergencyContactRelation ?? "",
      // Program
      caseManager: d?.caseManager ?? "",
      intakeDate: d?.intakeDate ?? "",
      intakeNotes: d?.intakeNotes ?? "",
      dischargeDate: d?.dischargeDate ?? "",
      dischargeReason: d?.dischargeReason ?? "",
      // Pets
      hasPets: d?.hasPets ?? "",
      petType: d?.petType ?? "",
      petName: d?.petName ?? "",
      // Activity
      totalCaseNotes: noteCountByClient[p.name] ?? 0,
      lastNoteDate: latestNote?.date ?? "",
      lastNoteType: latestNote?.type ?? "",
      lastNoteStaff: latestNote?.staff ?? "",
      documentCount: docCountByClient[p.name] ?? 0,
      totalGoals: goalCountByClient[p.name] ?? 0,
      activeGoals: activeGoalsByClient[p.name] ?? 0,
      openRequests: openRequestsByClient[p.name] ?? 0,
      // Housing
      housingMatchAddress: housing?.unitAddress ?? "",
      housingMatchStatus: housing?.status ?? "",
      housingMatchDate: housing?.matchedDate ?? "",
    };
  });

  return NextResponse.json({ rows, exportedAt: new Date().toISOString() });
}
