# CaseFlow Command — Template

> **HIPAA-aware case management platform.** Built for nonprofits, shelters, housing programs, reentry orgs, and any team that manages participant caseloads.

---

## What This Is

A production-grade, full-stack web app template. Every deployment is a white-label instance for a single organization. No code edits needed — configure everything through environment variables.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Convex (real-time DB) · NextAuth v5 · Vercel · Resend · Vercel KV + Blob

---

## Features

| Area | Capability |
|---|---|
| **Staff Portal** | Dashboard, caseload management, case notes, documents, calendar, compliance, AI terminal |
| **Client Portal** | Goals (SMART), journal, feedback, messages, documents, offline-capable PWA |
| **Admin Portal** | Personnel directory, compliance audit, integrations, analytics, seed/setup APIs |
| **Auth** | Google OAuth (staff/admin via Workspace domain) + credential login (clients) |
| **Security** | End-to-end encryption for PHI, role-gated API routes, HIPAA-adjacent workflow |
| **Real-time** | Convex-powered live sync — caseload, notes, HMIS queue, requests |
| **HMIS Queue** | Collapsible sidebar tracking which case notes are ready to upload to your HMIS |
| **Wellness Hub** | Pomodoro, box breathing, affirmations, brain dump, stretch prompts for staff |

---

## Quickstart

### 1. Clone and install

```bash
git clone https://github.com/AMackProjekt/caseflow-template.git my-org-portal
cd my-org-portal
npm install
```

### 2. Configure your org

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in every variable. At minimum:

- `NEXT_PUBLIC_ORG_NAME` — your organization's full name
- `NEXT_PUBLIC_ORG_SHORT` — abbreviation (e.g. `"ABC"`)
- `WORKSPACE_DOMAIN` — your Google Workspace domain (e.g. `"yourorg.org"`)
- `AUTH_SECRET` — run `openssl rand -base64 32`
- `NEXT_PUBLIC_CONVEX_URL` — from step 3
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console

See `src/config/org.ts` for the full list of configurable values and their defaults.

### 3. Set up Convex

```bash
npx convex dev
```

This creates a Convex deployment, generates `convex/_generated/`, and gives you your `NEXT_PUBLIC_CONVEX_URL`.

### 4. Run locally

```bash
npm run dev
```

### 5. Seed initial data

```bash
# Seed staff roster
curl -X POST http://localhost:3000/api/admin/seed-staff \
	-H "Authorization: Bearer your-setup-token-here"

# Create test accounts (dev only)
curl -X POST http://localhost:3000/api/admin/setup-test-client \
	-H "Authorization: Bearer your-setup-token-here"
```

### 6. Deploy

```bash
npx vercel --prod
```

Mirror all `.env.local` values in Vercel → Settings → Environment Variables.

---

## Org Configuration

All org-specific values are centralized in **`src/config/org.ts`**. Import it anywhere:

```ts
import { ORG } from "@/config/org";

// ORG.name        → "Your Organization"
// ORG.domain      → "yourorg.org"
// ORG.hmisUrl     → link to your HMIS system
// ORG.programType → "case-management" | "shelter" | "housing" | "reentry" | "youth"
```

---

## Program Types

Set `PROGRAM_TYPE` in `.env.local`:

| Value | Description |
|---|---|
| `case-management` | Traditional case manager + client model (default) |
| `shelter` | Emergency/transitional shelter operations |
| `housing` | Permanent supportive or rapid rehousing |
| `reentry` | Justice-involved participant services |
| `youth` | Youth-serving programs |

---

## Auth Model

| Role | Login Method | Access |
|---|---|---|
| **Admin** | Google OAuth (must be in `ADMIN_ALLOWLIST`) | Full system |
| **Staff** | Google OAuth (`STAFF_ALLOWLIST` or `WORKSPACE_DOMAIN` match) | Staff portal |
| **Client** | Username/password (provisioned by staff) | Client portal |

---

## Repo Structure

```
src/
	app/                     # Next.js App Router pages + API routes
		api/admin/             # Seed, compliance, setup endpoints
		portal/staff/          # Staff portal (layout, dashboard, caseload, etc.)
		portal/client/         # Client portal (goals, journal, messages)
		portal/admin/          # Admin portal (personnel, analytics, compliance)
	components/              # Shared UI components
	config/
		org.ts                 # ← START HERE for new client setup
	context/
		StaffContext.tsx        # Real-time Convex data for staff portal
	lib/
		crypto.ts              # PHI encryption/decryption
		authz.ts               # Role-based access helpers
		audit.ts               # Audit log utilities
convex/
	schema.ts                # Database schema
	functions.ts             # Queries and mutations
```

---

## Adding a New Client (Agency) — Under 30 Minutes

1. Fork or clone this repo into a new repo named for the client
2. `npx convex dev` → new Convex project
3. Fill in `.env.local` with client values
4. `npx vercel --prod` → live deployment
5. Call seed APIs with the client's `SETUP_TOKEN`

---

## License

All software, design, architecture, and source code was conceived, designed, and built by **[Creator] / [Your Studio]**. Shared as a reusable template. All rights reserved. No license, assignment, or transfer of ownership is granted beyond any explicit client agreement.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
