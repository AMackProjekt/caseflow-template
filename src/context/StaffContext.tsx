"use client";

import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Participant {
  _id?: string;
  _creationTime?: number;
  slot: string;
  name: string;
  status: string;
  environment: string;
  email?: string;
}

export interface Document {
  _id: string;
  _creationTime?: number;
  name: string;
  type: string;
  size: string;
  client: string;
  date: string;
  uploader: string;
  url: string;
}

export interface CaseNote {
  _id: string;
  _creationTime?: number;
  clientName: string;
  date: string;
  type: string;
  summary: string;
  staff: string;
}

export interface Notification {
  title: string;
  client: string;
  time: string;
  priority: string;
  type: string;
  read: boolean;
}

export interface JournalEntry {
  _id: string;
  _creationTime?: number;
  client: string;
  date: string;
  mood: string;
  content: string;
}

export interface Feedback {
  _id: string;
  _creationTime?: number;
  client: string;
  type: 'complaint' | 'suggestion';
  content: string;
  date: string;
}

export interface ShoutOut {
  _id: string;
  _creationTime?: number;
  from: string;
  to: string;
  message: string;
  date: string;
}

export interface ParticipantRequest {
  _id: string;
  _creationTime?: number;
  client: string;
  type: string;
  note: string;
  status: 'pending' | 'approved' | 'denied';
  date: string;
}

export interface SharedSmartGoal {
  _id: string;
  _creationTime?: number;
  client: string;
  date: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timebound: string;
  status: 'active' | 'completed' | 'missed';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface StaffContextType {
  participants: Participant[];
  documents: Document[];
  caseNotes: CaseNote[];
  notifications: Notification[];
  journals: JournalEntry[];
  feedback: Feedback[];
  shoutOuts: ShoutOut[];
  smartGoals: SharedSmartGoal[];
  requests: ParticipantRequest[];
  team: TeamMember[];
  mission: string;
  addDocument: (doc: Omit<Document, '_id' | '_creationTime'>) => void;
  addCaseNote: (note: Omit<CaseNote, '_id' | '_creationTime'>) => void;
  addJournal: (entry: Omit<JournalEntry, '_id' | '_creationTime'>) => void;
  addFeedback: (fb: Omit<Feedback, '_id' | '_creationTime'>) => void;
  addShoutOut: (so: Omit<ShoutOut, '_id' | '_creationTime'>) => void;
  addSmartGoal: (goal: Omit<SharedSmartGoal, '_id' | '_creationTime'>) => void;
  addParticipant: (p: Omit<Participant, '_id' | '_creationTime'>) => void;
  addRequest: (req: Omit<ParticipantRequest, '_id' | '_creationTime'>) => void;
  updateRequestStatus: (id: string, status: 'approved' | 'denied') => void;
  updateDocumentClient: (id: string, client: string) => void;
  markNotificationRead: (index: number) => void;
  updateParticipantStatus: (slot: string, newStatus: string) => void;
  updateParticipant: (slot: string, name: string, environment: string, status: string) => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

const DATA_KEYS = {
  notes: "notes",
  docs: "docs",
  journals: "journals",
  feedback: "feedback",
  shoutouts: "shoutouts",
  smartgoals: "smartgoals",
  requests: "requests",
  participants: "participants",
  team: "team",
} as const;

async function readSecureData<T>(key: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`/api/secure-data/${key}`, { method: "GET" });
    if (!response.ok) return fallback;
    const payload = (await response.json()) as { data?: T };
    return payload.data ?? fallback;
  } catch {
    return fallback;
  }
}

async function writeSecureData<T>(key: string, value: T): Promise<void> {
  try {
    await fetch(`/api/secure-data/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: value }),
    });
  } catch {
    // No-op in UI for offline/dev errors.
  }
}

export function StaffProvider({ children }: { children: React.ReactNode }) {
  // Reactive Convex queries
  const _participants = useQuery(api.functions.listParticipants) ?? [];
  const _caseNotes = useQuery(api.functions.listCaseNotes) ?? [];
  const _documents = useQuery(api.functions.listDocuments) ?? [];
  const _journals = useQuery(api.functions.listJournals) ?? [];
  const _feedback = useQuery(api.functions.listFeedback) ?? [];
  const _shoutOuts = useQuery(api.functions.listShoutOuts) ?? [];
  const _smartGoals = useQuery(api.functions.listSmartGoals) ?? [];
  const _requests = useQuery(api.functions.listRequests) ?? [];
  const _teamMembers = useQuery(api.functions.listTeamMembers) ?? [];

  // Cast Convex doc types to interface types (_id / _creationTime added by Convex automatically)
  const participants = _participants as unknown as Participant[];
  const caseNotes = _caseNotes as unknown as CaseNote[];
  const documents = _documents as unknown as Document[];
  const journals = _journals as unknown as JournalEntry[];
  const feedback = _feedback as unknown as Feedback[];
  const shoutOuts = _shoutOuts as unknown as ShoutOut[];
  const smartGoals = _smartGoals as unknown as SharedSmartGoal[];
  const requests = _requests as unknown as ParticipantRequest[];

  // Map teamMembers → TeamMember (expose _id as id for backward-compat with dropdowns)
  const team: TeamMember[] = _teamMembers.map((m) => ({
    id: m._id as string,
    name: m.name,
    role: m.role,
  }));

  // Mutations
  const _addParticipant = useMutation(api.functions.addParticipant);
  const _addCaseNote = useMutation(api.functions.addCaseNote);
  const _addDocument = useMutation(api.functions.addDocument);
  const _addJournal = useMutation(api.functions.addJournal);
  const _addFeedback = useMutation(api.functions.addFeedback);
  const _addShoutOut = useMutation(api.functions.addShoutOut);
  const _addSmartGoal = useMutation(api.functions.addSmartGoal);
  const _addRequest = useMutation(api.functions.addRequest);
  const _updateRequestStatus = useMutation(api.functions.updateRequestStatus);
  const _updateDocumentClient = useMutation(api.functions.updateDocumentClient);
  const _updateParticipantStatus = useMutation(api.functions.updateParticipantStatus);
  const _updateParticipant = useMutation(api.functions.updateParticipant);

  // Notifications not stored in Convex yet
  const [notifications] = useState<Notification[]>([]);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const addParticipant = (p: Omit<Participant, '_id' | '_creationTime'>) => {
    _addParticipant({ slot: p.slot, name: p.name, status: p.status, environment: p.environment });
  };

  const addCaseNote = async (note: Omit<CaseNote, '_id' | '_creationTime'>) => {
    await _addCaseNote({ clientName: note.clientName, date: note.date, type: note.type, summary: note.summary, staff: note.staff });
    // Send notification email
    fetch("/api/notify/case-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    }).catch(() => {});
  };

  const addDocument = async (doc: Omit<Document, '_id' | '_creationTime'>) => {
    await _addDocument({ name: doc.name, type: doc.type, size: doc.size, client: doc.client, date: doc.date, uploader: doc.uploader, url: doc.url });
    // Send notification email
    fetch("/api/notify/document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    }).catch(() => {});
  };

  const addJournal = (entry: Omit<JournalEntry, '_id' | '_creationTime'>) => {
    _addJournal({ client: entry.client, date: entry.date, mood: entry.mood, content: entry.content });
  };

  const addFeedback = (fb: Omit<Feedback, '_id' | '_creationTime'>) => {
    _addFeedback({ client: fb.client, type: fb.type, content: fb.content, date: fb.date });
  };

  const addShoutOut = (so: Omit<ShoutOut, '_id' | '_creationTime'>) => {
    _addShoutOut({ from: so.from, to: so.to, message: so.message, date: so.date });
  };

  const addSmartGoal = (goal: Omit<SharedSmartGoal, '_id' | '_creationTime'>) => {
    _addSmartGoal({
      client: goal.client,
      date: goal.date,
      specific: goal.specific,
      measurable: goal.measurable,
      achievable: goal.achievable,
      relevant: goal.relevant,
      timebound: goal.timebound,
      status: goal.status,
    });
  };

  const addRequest = (req: Omit<ParticipantRequest, '_id' | '_creationTime'>) => {
    _addRequest({ client: req.client, type: req.type, note: req.note, status: req.status, date: req.date });
  };

  const updateRequestStatus = (id: string, status: 'approved' | 'denied') => {
    _updateRequestStatus({ id: id as Id<"requests">, status });
  };

  const updateDocumentClient = (id: string, client: string) => {
    _updateDocumentClient({ id: id as Id<"documents">, client });
  };

  const markNotificationRead = (_index: number) => {
    // Notifications not yet persisted in Convex
  };

  const updateParticipantStatus = (slot: string, newStatus: string) => {
    _updateParticipantStatus({ slot, status: newStatus });
  };

  const updateParticipant = (slot: string, name: string, environment: string, status: string) => {
    _updateParticipant({ slot, name, environment, status });
  };

  const mission = "T.O.O.LS INC provides intelligent tools and platforms for social services and case management organizations, empowering frontline workers to deliver better outcomes.";

  return (
    <StaffContext.Provider value={{
      participants,
      documents,
      caseNotes,
      notifications,
      journals,
      feedback,
      shoutOuts,
      smartGoals,
      requests,
      team,
      mission,
      addParticipant,
      addDocument,
      addCaseNote,
      addJournal,
      addFeedback,
      addShoutOut,
      addSmartGoal,
      addRequest,
      updateRequestStatus,
      updateDocumentClient,
      markNotificationRead,
      updateParticipantStatus,
      updateParticipant,
    }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
}
