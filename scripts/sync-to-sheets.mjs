#!/usr/bin/env node
/**
 * sync-to-sheets.mjs
 *
 * Pulls caseload from the CaseFlow Operations portal and writes it to a Google Sheet,
 * color-coding rows by participant status.
 *
 * SETUP (one-time):
 *   1. Go to console.cloud.google.com → Create project → Enable "Google Sheets API"
 *   2. IAM & Admin → Service Accounts → Create → Download JSON key
 *   3. Share your Google Sheet with the service account email (Editor)
 *   4. Set env vars:
 *        GOOGLE_SERVICE_ACCOUNT_KEY  = contents of the JSON key file (one line)
 *        GOOGLE_SHEET_ID             = the long ID from your Sheet URL
 *        SETUP_TOKEN                 = your-setup-token-here
 *        PORTAL_API_BASE             = https://sdtoolsinc.vercel.app  (or http://localhost:3000)
 *
 *   5. npm install googleapis   (already done)
 *   6. node scripts/sync-to-sheets.mjs
 */

import { google } from "googleapis";

// ── Config ──────────────────────────────────────────────────────────────────
const SHEET_ID   = process.env.GOOGLE_SHEET_ID;
const API_BASE   = process.env.PORTAL_API_BASE ?? "https://sdtoolsinc.vercel.app";
const TOKEN      = process.env.SETUP_TOKEN  ?? "your-setup-token-here";
const KEY_JSON   = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
const SHEET_NAME = "Caseload";

if (!SHEET_ID)  { console.error("Missing GOOGLE_SHEET_ID"); process.exit(1); }
if (!KEY_JSON)  { console.error("Missing GOOGLE_SERVICE_ACCOUNT_KEY"); process.exit(1); }

// ── Status → background color (RGB 0-1) ─────────────────────────────────────
const STATUS_COLORS = {
  "Active":           { red: 0.851, green: 0.918, blue: 0.827 }, // soft green
  "Active (Shared)":  { red: 0.816, green: 0.878, blue: 0.890 }, // soft teal
  "Housing Match":    { red: 0.808, green: 0.878, blue: 0.969 }, // soft blue
  "Scheduled Exit":   { red: 1.000, green: 0.949, blue: 0.800 }, // soft yellow
  "Offline":          { red: 0.937, green: 0.937, blue: 0.937 }, // light gray
};
const DEFAULT_COLOR = { red: 1, green: 1, blue: 1 };

// ── Column definitions ───────────────────────────────────────────────────────
const COLUMNS = [
  // Program
  { key: "slot",                  label: "Slot" },
  { key: "name",                  label: "Full Name" },
  { key: "status",                label: "Status" },
  { key: "environment",           label: "Environment" },
  { key: "caseManager",           label: "Case Manager" },
  { key: "intakeDate",            label: "Intake Date" },
  { key: "dischargeDate",         label: "Discharge Date" },
  { key: "dischargeReason",       label: "Discharge Reason" },
  // Identity
  { key: "firstName",             label: "First Name" },
  { key: "lastName",              label: "Last Name" },
  { key: "dob",                   label: "DOB" },
  { key: "gender",                label: "Gender" },
  { key: "race",                  label: "Race" },
  { key: "ethnicity",             label: "Ethnicity" },
  { key: "preferredLanguage",     label: "Preferred Language" },
  { key: "maritalStatus",         label: "Marital Status" },
  // Contact
  { key: "phone",                 label: "Phone" },
  { key: "email",                 label: "Email" },
  // Status
  { key: "housingStatus",         label: "Housing Status" },
  { key: "employmentStatus",      label: "Employment Status" },
  { key: "educationLevel",        label: "Education Level" },
  { key: "veteranStatus",         label: "Veteran Status" },
  // Insurance
  { key: "insuranceType",         label: "Insurance Type" },
  // Referral
  { key: "referralSource",        label: "Referral Source" },
  { key: "referralDate",          label: "Referral Date" },
  // Emergency Contact
  { key: "emergencyContactName",      label: "Emergency Contact" },
  { key: "emergencyContactPhone",     label: "EC Phone" },
  { key: "emergencyContactRelation",  label: "EC Relation" },
  // Pets
  { key: "hasPets",               label: "Has Pets?" },
  { key: "petType",               label: "Pet Type" },
  { key: "petName",               label: "Pet Name" },
  // Housing Match
  { key: "housingMatchAddress",   label: "Housing Match Address" },
  { key: "housingMatchStatus",    label: "Housing Match Status" },
  { key: "housingMatchDate",      label: "Housing Match Date" },
  // Activity
  { key: "totalCaseNotes",        label: "Total Case Notes" },
  { key: "lastNoteDate",          label: "Last Note Date" },
  { key: "lastNoteType",          label: "Last Note Type" },
  { key: "lastNoteStaff",         label: "Last Note Staff" },
  { key: "documentCount",         label: "Documents" },
  { key: "totalGoals",            label: "Total Goals" },
  { key: "activeGoals",           label: "Active Goals" },
  { key: "openRequests",          label: "Open Requests" },
  // Notes
  { key: "intakeNotes",           label: "Intake Notes" },
];

async function main() {
  // ── 1. Fetch data from portal ──────────────────────────────────────────────
  console.log(`Fetching caseload from ${API_BASE}…`);
  const res = await fetch(`${API_BASE}/api/admin/export-caseload`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Export API error:", res.status, text);
    process.exit(1);
  }
  const { rows, exportedAt } = await res.json();
  console.log(`Got ${rows.length} rows (exported ${exportedAt})`);

  // ── 2. Auth with Google ────────────────────────────────────────────────────
  const keyData = JSON.parse(KEY_JSON);
  const auth = new google.auth.GoogleAuth({
    credentials: keyData,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  // ── 3. Ensure sheet tab exists ─────────────────────────────────────────────
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const existingSheet = meta.data.sheets?.find(
    (s) => s.properties?.title === SHEET_NAME
  );
  let sheetId;
  if (!existingSheet) {
    const addRes = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
      },
    });
    sheetId = addRes.data.replies?.[0]?.addSheet?.properties?.sheetId;
    console.log(`Created sheet tab "${SHEET_NAME}" (id=${sheetId})`);
  } else {
    sheetId = existingSheet.properties?.sheetId;
    console.log(`Using existing sheet tab "${SHEET_NAME}" (id=${sheetId})`);
  }

  // ── 4. Clear existing content ──────────────────────────────────────────────
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:BZ`,
  });

  // ── 5. Write header + data rows ────────────────────────────────────────────
  const header = COLUMNS.map((c) => c.label);
  const dataRows = rows.map((row) =>
    COLUMNS.map((c) => {
      const v = row[c.key];
      return v === null || v === undefined ? "" : String(v);
    })
  );

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [header, ...dataRows] },
  });
  console.log(`Wrote ${dataRows.length} data rows + header`);

  // ── 6. Format: freeze header, bold, color rows ─────────────────────────────
  const numCols = COLUMNS.length;
  const numRows = rows.length + 1; // +1 for header

  // Build row color requests
  const colorRequests = rows.map((row, i) => {
    const rowIndex = i + 1; // 0-based, +1 skips header
    const color = STATUS_COLORS[row.status] ?? DEFAULT_COLOR;
    return {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: rowIndex,
          endRowIndex: rowIndex + 1,
          startColumnIndex: 0,
          endColumnIndex: numCols,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: color,
          },
        },
        fields: "userEnteredFormat.backgroundColor",
      },
    };
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        // Freeze first row
        {
          updateSheetProperties: {
            properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
            fields: "gridProperties.frozenRowCount",
          },
        },
        // Bold + teal header row
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: numCols,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.102, green: 0.604, blue: 0.604 }, // teal-600
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
              },
            },
            fields: "userEnteredFormat(backgroundColor,textFormat)",
          },
        },
        // Auto-resize all columns
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: numCols,
            },
          },
        },
        // Row colors by status
        ...colorRequests,
      ],
    },
  });

  // ── 7. Add legend in a separate tab ───────────────────────────────────────
  const metaAfter = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const legendExists = metaAfter.data.sheets?.find((s) => s.properties?.title === "Legend");
  let legendSheetId;
  if (!legendExists) {
    const lr = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: "Legend" } } }] },
    });
    legendSheetId = lr.data.replies?.[0]?.addSheet?.properties?.sheetId;
  } else {
    legendSheetId = legendExists.properties?.sheetId;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: "Legend!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        ["Status", "Color"],
        ...Object.entries(STATUS_COLORS).map(([s]) => [s, ""]),
        ["", ""],
        ["Last synced:", exportedAt],
      ],
    },
  });

  const legendColorRequests = Object.entries(STATUS_COLORS).map(([, color], i) => ({
    repeatCell: {
      range: { sheetId: legendSheetId, startRowIndex: i + 1, endRowIndex: i + 2, startColumnIndex: 1, endColumnIndex: 2 },
      cell: { userEnteredFormat: { backgroundColor: color } },
      fields: "userEnteredFormat.backgroundColor",
    },
  }));

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: { requests: legendColorRequests },
  });

  console.log("✓ Google Sheet updated successfully!");
  console.log(`  https://docs.google.com/spreadsheets/d/${SHEET_ID}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
