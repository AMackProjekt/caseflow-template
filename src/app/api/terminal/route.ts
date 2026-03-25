import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ConvexHttpClient } from 'convex/browser';
import { getAuthContext } from '@/lib/authz';
import { logAudit } from '@/lib/audit';
import { enforce } from '@/lib/policy';
import { api } from '../../../../convex/_generated/api';

const TerminalBodySchema = z.object({
  command: z.string().min(1).max(500),
});

type ParsedCommand = {
  name: string;
  flags: Record<string, string>;
  positional: string[];
};

function tokenize(raw: string): string[] {
  const matches = raw.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
  return matches.map((token) => token.replace(/^['"]|['"]$/g, ''));
}

function parseCommand(raw: string): ParsedCommand {
  const tokens = tokenize(raw);
  const name = (tokens[0] ?? '').toLowerCase();
  const flags: Record<string, string> = {};
  const positional: string[] = [];

  for (let i = 1; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (!token) continue;

    if (token.startsWith('-')) {
      const key = token.replace(/^-+/, '').toLowerCase();
      const next = tokens[i + 1];
      if (next && !next.startsWith('-')) {
        flags[key] = next;
        i += 1;
      } else {
        flags[key] = 'true';
      }
      continue;
    }

    positional.push(token);
  }

  return { name, flags, positional };
}

function toInt(value: string | undefined, fallback: number, min = 1, max = 100): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function clip(value: string, max = 72): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
}

function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL is not configured.');
  }
  return new ConvexHttpClient(url);
}

function helpOutput() {
  return [
    'CaseFlow PowerShell Query Help',
    '=============================',
    'Available commands:',
    '  Get-Help',
    '  Get-Clients [-Name <text>] [-Slot <slot>] [-Status <text>] [-Environment <text>] [-Top <n>]',
    '  Find-Client <text>',
    '  Get-Client -Slot <slot>',
    '  Get-CaseNotes [-Client <text>] [-Top <n>]',
    '  Get-Documents [-Client <text>] [-Top <n>]',
    '  Get-Stats',
    '  Clear  (client-side clear screen)',
    '',
    'Examples:',
    '  Get-Clients -Environment "Tier 4" -Top 15',
    '  Find-Client T4/A1',
    '  Get-Client -Slot T4/A1',
    '  Get-CaseNotes -Client "john" -Top 5',
    '  Get-Documents -Client "T4/A1"',
  ].join('\n');
}

async function executeQueryCommand(raw: string): Promise<string> {
  const parsed = parseCommand(raw);
  const convex = getConvexClient();

  if (!parsed.name || parsed.name === 'get-help' || parsed.name === 'help' || parsed.name === 'man') {
    return helpOutput();
  }

  if (parsed.name === 'get-clients') {
    const all = await convex.query(api.functions.listParticipants, {});
    const nameFilter = (parsed.flags.name ?? '').toLowerCase();
    const slotFilter = (parsed.flags.slot ?? '').toLowerCase();
    const statusFilter = (parsed.flags.status ?? '').toLowerCase();
    const envFilter = (parsed.flags.environment ?? '').toLowerCase();
    const top = toInt(parsed.flags.top, 20);

    const filtered = all
      .filter((item) => !nameFilter || item.name.toLowerCase().includes(nameFilter))
      .filter((item) => !slotFilter || item.slot.toLowerCase().includes(slotFilter))
      .filter((item) => !statusFilter || item.status.toLowerCase().includes(statusFilter))
      .filter((item) => !envFilter || item.environment.toLowerCase().includes(envFilter))
      .slice(0, top);

    if (filtered.length === 0) {
      return 'No participants matched this query.';
    }

    const lines = [
      'Slot      Name                          Status             Environment',
      '--------  ----------------------------  -----------------  -------------------',
      ...filtered.map((item) => {
        const slot = item.slot.padEnd(8).slice(0, 8);
        const name = item.name.padEnd(28).slice(0, 28);
        const status = item.status.padEnd(17).slice(0, 17);
        const environment = item.environment.padEnd(19).slice(0, 19);
        return `${slot}  ${name}  ${status}  ${environment}`;
      }),
      '',
      `Rows: ${filtered.length}`,
    ];
    return lines.join('\n');
  }

  if (parsed.name === 'find-client') {
    const term = (parsed.positional[0] ?? parsed.flags.query ?? parsed.flags.q ?? '').toLowerCase();
    if (!term) {
      return 'Usage: Find-Client <text>';
    }
    const all = await convex.query(api.functions.listParticipants, {});
    const matches = all
      .filter((item) =>
        item.name.toLowerCase().includes(term) ||
        item.slot.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term) ||
        item.environment.toLowerCase().includes(term)
      )
      .slice(0, 20);

    if (matches.length === 0) {
      return `No client found for query: ${term}`;
    }

    return [
      `Matches for: ${term}`,
      ...matches.map((item) => `${item.slot}  |  ${item.name}  |  ${item.status}  |  ${item.environment}`),
    ].join('\n');
  }

  if (parsed.name === 'get-client') {
    const slotQuery = parsed.flags.slot ?? parsed.positional[0] ?? '';
    if (!slotQuery) {
      return 'Usage: Get-Client -Slot <slot>';
    }

    const all = await convex.query(api.functions.listParticipants, {});
    const item = all.find((entry) => entry.slot.toLowerCase() === slotQuery.toLowerCase());
    if (!item) {
      return `Participant not found for slot: ${slotQuery}`;
    }

    return [
      `Slot: ${item.slot}`,
      `Name: ${item.name}`,
      `Status: ${item.status}`,
      `Environment: ${item.environment}`,
    ].join('\n');
  }

  if (parsed.name === 'get-casenotes') {
    const clientFilter = (parsed.flags.client ?? '').toLowerCase();
    const top = toInt(parsed.flags.top, 10);
    const notes = await convex.query(api.functions.listCaseNotes, {});

    const filtered = notes
      .filter((note) => !clientFilter || note.clientName.toLowerCase().includes(clientFilter))
      .slice(0, top);

    if (filtered.length === 0) {
      return 'No case notes matched this query.';
    }

    return [
      'Date         Client                       Type                         Summary',
      '-----------  ---------------------------  ---------------------------  -------------------------',
      ...filtered.map((note) => {
        const date = (note.date || 'Unknown').padEnd(11).slice(0, 11);
        const client = note.clientName.padEnd(27).slice(0, 27);
        const type = note.type.padEnd(27).slice(0, 27);
        const summary = clip(note.summary, 25).padEnd(25).slice(0, 25);
        return `${date}  ${client}  ${type}  ${summary}`;
      }),
      '',
      `Rows: ${filtered.length}`,
    ].join('\n');
  }

  if (parsed.name === 'get-documents') {
    const clientFilter = (parsed.flags.client ?? '').toLowerCase();
    const top = toInt(parsed.flags.top, 10);
    const docs = await convex.query(api.functions.listDocuments, {});

    const filtered = docs
      .filter((doc) => !clientFilter || doc.client.toLowerCase().includes(clientFilter))
      .slice(0, top);

    if (filtered.length === 0) {
      return 'No documents matched this query.';
    }

    return [
      'Date         Client                       File                         Type',
      '-----------  ---------------------------  ---------------------------  ----------',
      ...filtered.map((doc) => {
        const date = (doc.date || 'Unknown').padEnd(11).slice(0, 11);
        const client = doc.client.padEnd(27).slice(0, 27);
        const name = clip(doc.name, 27).padEnd(27).slice(0, 27);
        const type = doc.type.padEnd(10).slice(0, 10);
        return `${date}  ${client}  ${name}  ${type}`;
      }),
      '',
      `Rows: ${filtered.length}`,
    ].join('\n');
  }

  if (parsed.name === 'get-stats') {
    const [participants, notes, docs] = await Promise.all([
      convex.query(api.functions.listParticipants, {}),
      convex.query(api.functions.listCaseNotes, {}),
      convex.query(api.functions.listDocuments, {}),
    ]);

    const active = participants.filter((entry) => entry.status.toLowerCase().includes('active')).length;
    const broken = participants.filter((entry) => entry.status.toLowerCase() === 'broken platform').length;
    const empty = participants.filter((entry) => entry.status.toLowerCase() === 'empty').length;

    return [
      'CaseFlow Data Snapshot',
      '----------------------',
      `Participants : ${participants.length}`,
      `Active       : ${active}`,
      `Broken       : ${broken}`,
      `Empty        : ${empty}`,
      `Case Notes   : ${notes.length}`,
      `Documents    : ${docs.length}`,
    ].join('\n');
  }

  return `ERROR: Unknown command '${parsed.name}'. Run Get-Help to see supported commands.`;
}

export async function POST(req: Request) {
  const auth = await getAuthContext();
  if (!auth.isAuthenticated || !auth.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const policy = enforce(auth.role, 'terminal', 'execute');
  if (!policy.allowed) {
    return NextResponse.json({ error: policy.error }, { status: policy.status });
  }

  const rawBody = await req.json();
  const parsed = TerminalBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const cmd = parsed.data.command.trim();

  let output = '';
  try {
    output = await executeQueryCommand(cmd);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unhandled terminal execution error.';
    output = `ERROR: ${message}`;
  }


  await logAudit({
    actor: auth.email,
    role: auth.role,
    action: 'terminal.command',
    resource: '/api/terminal',
    status: 'success',
    details: { command: cmd.slice(0, 64), outputPreview: output.slice(0, 120) },
  });

  return NextResponse.json({ output });
}
