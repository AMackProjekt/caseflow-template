"use client";

import { useStaff } from "@/context/StaffContext";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  ExternalLink,
  FileBox,
  FileSpreadsheet,
  FileText,
  Globe,
  Heart,
  History,
  Home,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Table,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type DemographicsRecord = {
  _id: string;
  slot: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  race?: string;
  ethnicity?: string;
  preferredLanguage?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  housingStatus?: string;
  employmentStatus?: string;
  educationLevel?: string;
  veteranStatus?: string;
  insuranceType?: string;
  insuranceMemberId?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  caseManager?: string;
  intakeDate?: string;
  hasPets?: string;
  petType?: string;
  petName?: string;
  petBreed?: string;
  petColor?: string;
  petAge?: string;
  petCount?: string;
  petSpayedNeutered?: string;
};

type Metric = {
  label: string;
  value: number;
  tone: string;
};

type ChecklistItem = {
  label: string;
  done: boolean;
  note: string;
};

function toParamValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function toTimestamp(value?: string, fallback?: number): number {
  if (fallback) return fallback;
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDate(value?: string, fallback?: number): string {
  const timestamp = toTimestamp(value, fallback);
  if (!timestamp) return "Not documented";
  return new Date(timestamp).toLocaleDateString();
}

function progressValue(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export default function ClientProfile() {
  const { slot } = useParams();
  const profileSlot = toParamValue(slot);
  const { participants, documents, caseNotes, journals, feedback, smartGoals, requests, updateParticipant } = useStaff();
  const allDemographics = (useQuery(api.functions.listDemographics) ?? []) as DemographicsRecord[];
  const demo = allDemographics.find((d) => d.slot === profileSlot);
  const demoAge = demo?.dob ? Math.floor((Date.now() - new Date(demo.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : null;

  const client = participants.find((participant) => participant.slot === profileSlot);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", environment: "", status: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const ENVIRONMENTS = ["O Lot", "Tier 3", "Tier 4", "Staff Office", "Community", "Outreach", "Offsite"];
  const STATUSES = ["Active", "Inactive", "On Hold", "Exited"];

  const openEditProfile = () => {
    if (!client) return;
    setEditForm({ name: client.name, environment: client.environment, status: client.status });
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) return;
    setIsSavingProfile(true);
    try {
      await updateParticipant(profileSlot, editForm.name.trim(), editForm.environment, editForm.status);
      setProfileSaved(true);
      setTimeout(() => { setProfileSaved(false); setShowEditProfile(false); }, 1500);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!client) {
    return <div className="p-8">Participant not found.</div>;
  }

  const matchesClientRef = (value?: string) => {
    if (!value) return false;
    const normalized = value.toLowerCase();
    return normalized.includes(profileSlot.toLowerCase()) || normalized.includes(client.name.toLowerCase());
  };

  const clientDocs = documents
    .filter((doc) => matchesClientRef(doc.client))
    .sort((left, right) => toTimestamp(right.date, right._creationTime) - toTimestamp(left.date, left._creationTime));

  const clientNotes = caseNotes
    .filter((note) => matchesClientRef(note.clientName))
    .sort((left, right) => toTimestamp(right.date, right._creationTime) - toTimestamp(left.date, left._creationTime));

  const clientJournals = journals
    .filter((entry) => matchesClientRef(entry.client))
    .sort((left, right) => toTimestamp(right.date, right._creationTime) - toTimestamp(left.date, left._creationTime));

  const clientFeedback = feedback
    .filter((entry) => matchesClientRef(entry.client))
    .sort((left, right) => toTimestamp(right.date, right._creationTime) - toTimestamp(left.date, left._creationTime));

  const clientGoals = smartGoals
    .filter((goal) => matchesClientRef(goal.client))
    .sort((left, right) => toTimestamp(right.date, right._creationTime) - toTimestamp(left.date, left._creationTime));

  const clientRequests = requests
    .filter((request) => matchesClientRef(request.client))
    .sort((left, right) => toTimestamp(right.date, right._creationTime) - toTimestamp(left.date, left._creationTime));

  const latestContactTimestamp = Math.max(
    ...clientNotes.map((note) => toTimestamp(note.date, note._creationTime)),
    ...clientJournals.map((entry) => toTimestamp(entry.date, entry._creationTime)),
    0,
  );

  const lastMetLabel = latestContactTimestamp
    ? new Date(latestContactTimestamp).toLocaleDateString()
    : "No meeting logged yet";

  const activeGoals = clientGoals.filter((goal) => goal.status === "active");
  const completedGoals = clientGoals.filter((goal) => goal.status === "completed");
  const pendingRequests = clientRequests.filter((request) => request.status === "pending");

  const followUps = clientNotes.slice(0, 4).map((note, index) => ({
    id: note._id,
    title: note.type || `Follow-Up ${index + 1}`,
    detail: note.summary,
    date: formatDate(note.date, note._creationTime),
  }));

  const scheduledMeetings = [
    ...activeGoals.slice(0, 2).map((goal) => ({
      id: goal._id,
      title: goal.specific,
      date: goal.timebound || formatDate(goal.date, goal._creationTime),
      type: "Goal review",
    })),
    ...pendingRequests.slice(0, 2).map((request) => ({
      id: request._id,
      title: request.type,
      date: formatDate(request.date, request._creationTime),
      type: "Participant request",
    })),
  ].slice(0, 4);

  const barriersAndNeeds = [
    ...pendingRequests.map((request) => ({
      id: request._id,
      title: request.type,
      detail: request.note,
      tone: "rose",
    })),
    ...clientFeedback.slice(0, 2).map((entry) => ({
      id: entry._id,
      title: entry.type === "complaint" ? "Reported barrier" : "Participant feedback",
      detail: entry.content,
      tone: entry.type === "complaint" ? "rose" : "amber",
    })),
  ].slice(0, 5);

  const caseManagerActions = [
    ...clientNotes.slice(0, 3).map((note) => ({
      id: note._id,
      title: note.type || "Case note",
      detail: note.summary,
      date: formatDate(note.date, note._creationTime),
    })),
    ...clientDocs.slice(0, 2).map((doc) => ({
      id: doc._id,
      title: `Document added: ${doc.name}`,
      detail: `${doc.type} uploaded by ${doc.uploader}`,
      date: formatDate(doc.date, doc._creationTime),
    })),
  ].slice(0, 5);

  const metrics: Metric[] = [
    {
      label: "Case plan progress",
      value: progressValue(completedGoals.length, Math.max(clientGoals.length, 3)),
      tone: "bg-teal-500",
    },
    {
      label: "Engagement cadence",
      value: progressValue(clientNotes.length + clientJournals.length, 6),
      tone: "bg-indigo-500",
    },
    {
      label: "Barrier resolution",
      value: progressValue(clientRequests.length - pendingRequests.length, Math.max(clientRequests.length, 2)),
      tone: "bg-amber-500",
    },
  ];

  const checklist: ChecklistItem[] = [
    {
      label: "Client profile created",
      done: true,
      note: `${client.name} is on the active caseload.`,
    },
    {
      label: "Last meeting documented",
      done: latestContactTimestamp > 0,
      note: latestContactTimestamp ? `Last documented on ${lastMetLabel}.` : "No documented contact yet.",
    },
    {
      label: "Case plan on file",
      done: clientGoals.length > 0,
      note: clientGoals.length > 0 ? `${clientGoals.length} plan item(s) available.` : "No case plan items yet.",
    },
    {
      label: "Follow-up queued",
      done: followUps.length > 0,
      note: followUps.length > 0 ? `${followUps.length} follow-up item(s) visible.` : "No follow-up tasks documented.",
    },
    {
      label: "Documents attached",
      done: clientDocs.length > 0,
      note: clientDocs.length > 0 ? `${clientDocs.length} secured document(s) linked.` : "No documents linked.",
    },
    {
      label: "Immediate barriers reviewed",
      done: barriersAndNeeds.length > 0,
      note: barriersAndNeeds.length > 0 ? `${barriersAndNeeds.length} barrier/need item(s) flagged.` : "No immediate barriers or needs flagged.",
    },
    {
      label: "Demographics on file",
      done: !!demo,
      note: demo ? `Last updated — ${demo.firstName ?? ""} ${demo.lastName ?? ""} profile on file.` : "No demographics record found. Fill in the demographics form.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -mr-20 -mt-20 opacity-50" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-teal-500/20">
            {client.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">{client.name}</h1>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider">{client.slot}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {client.environment}</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> {client.status}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-500" /> Last met: {lastMetLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <Link href={`/portal/staff/caseload/${profileSlot}/demographics`} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition flex items-center gap-2 text-sm">
            <User className="w-4 h-4" /> Demographics
          </Link>
          <a
            href="https://www.office.com/launch/excel"
            target="_blank"
            rel="noreferrer noopener"
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition flex items-center gap-2 text-sm"
          >
            <FileSpreadsheet className="w-4 h-4" /> MSFT Excel
          </a>
          <a
            href="https://docs.google.com/spreadsheets/"
            target="_blank"
            rel="noreferrer noopener"
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition flex items-center gap-2 text-sm"
          >
            <Table className="w-4 h-4" /> Google Sheet
          </a>
          <Link href={`/portal/staff/messages?client=${encodeURIComponent(client.name)}`} className="bg-white border border-slate-200 text-indigo-700 px-4 py-2 rounded-xl font-bold hover:bg-indigo-50 transition flex items-center gap-2 text-sm">
            <MessageSquare className="w-4 h-4" /> Message Client
          </Link>
          <Link href="/portal/staff/casenote/new" className="bg-teal-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> New Case Note
          </Link>
          <button
            type="button"
            onClick={openEditProfile}
            className="bg-slate-800 text-white px-5 py-2 rounded-xl font-bold hover:bg-slate-700 shadow-lg shadow-slate-500/20 transition flex items-center gap-2 text-sm"
          >
            <Pencil className="w-4 h-4" /> Update Profile
          </button>
        </div>
      </div>

      {/* Update Client Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Update Client Profile</h2>
                <p className="text-sm text-slate-500 mt-0.5">Slot <span className="font-semibold text-teal-600">{profileSlot}</span></p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setShowEditProfile(false)} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                  placeholder="Client full name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Environment / Site</label>
                <select
                  value={editForm.environment}
                  onChange={e => setEditForm(prev => ({ ...prev, environment: e.target.value }))}
                  title="Environment"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 appearance-none"
                >
                  <option value="">Select environment…</option>
                  {ENVIRONMENTS.map(env => <option key={env} value={env}>{env}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  title="Status"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 appearance-none"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 gap-3">
              <button type="button" onClick={() => setShowEditProfile(false)} className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSavingProfile || !editForm.name.trim()}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-teal-500/20 transition text-sm"
              >
                {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSavingProfile ? "Saving…" : profileSaved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard label="Last date met" value={lastMetLabel} icon={<Clock className="w-5 h-5 text-indigo-500" />} />
        <SummaryCard label="Case notes" value={`${clientNotes.length}`} icon={<History className="w-5 h-5 text-teal-500" />} />
        <SummaryCard label="Case plans" value={`${clientGoals.length}`} icon={<CheckSquare className="w-5 h-5 text-emerald-500" />} />
        <SummaryCard label="Scheduled meetings" value={`${scheduledMeetings.length}`} icon={<Calendar className="w-5 h-5 text-amber-500" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold text-charcoal-900">Case Notes</h2>
              <Link href="/portal/staff/casenote/new" className="text-sm font-bold text-teal-600 hover:text-teal-700">+ Add Note</Link>
            </div>
            <div className="space-y-4">
              {clientNotes.length === 0 ? (
                <EmptyState icon={<History className="w-10 h-10 text-slate-200" />} text="No case notes found for this participant." />
              ) : (
                clientNotes.map((note) => (
                  <div key={note._id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                    <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 bg-white text-slate-500 rounded-lg border border-slate-200">{formatDate(note.date, note._creationTime)}</span>
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{note.type}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-400">{note.staff}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{note.summary}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-xl font-bold text-charcoal-900">Case Plans</h2>
                <div className="flex items-center gap-3">
                  <Link href={`/portal/client/goals/smart`} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">+ Add Plan</Link>
                  <Link href="/portal/client/goals/smart" className="text-xs text-slate-400 hover:text-slate-600">View goals</Link>
                </div>
              </div>
              <div className="space-y-4">
                {clientGoals.length === 0 ? (
                  <EmptyState icon={<CheckSquare className="w-10 h-10 text-slate-200" />} text="No case plan goals have been entered yet." />
                ) : (
                  clientGoals.map((goal) => (
                    <div key={goal._id} className="rounded-2xl border border-slate-100 p-4 bg-white">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{goal.status}</span>
                        <span className="text-xs text-slate-400">Due {goal.timebound}</span>
                      </div>
                      <p className="text-sm font-semibold text-charcoal-900">{goal.specific}</p>
                      <p className="text-xs text-slate-500 mt-2">Measure: {goal.measurable}</p>
                      <p className="text-xs text-slate-500 mt-1">Relevant because: {goal.relevant}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-xl font-bold text-charcoal-900">Follow-Ups</h2>
                <Link href={`/portal/staff/casenote/new?type=Follow-Up&client=${encodeURIComponent(client.name)}`} className="text-sm font-bold text-teal-600 hover:text-teal-700">+ Add Follow-Up</Link>
              </div>
              <div className="space-y-4">
                {followUps.length === 0 ? (
                  <EmptyState icon={<Calendar className="w-10 h-10 text-slate-200" />} text="No follow-ups have been documented yet." />
                ) : (
                  followUps.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-100 p-4 bg-slate-50/70">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="text-sm font-bold text-charcoal-900">{item.title}</p>
                        <span className="text-xs font-medium text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{item.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-xl font-bold text-charcoal-900">Scheduled Meetings</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Upcoming</span>
              </div>
              <div className="space-y-4">
                {scheduledMeetings.length === 0 ? (
                  <EmptyState icon={<Calendar className="w-10 h-10 text-slate-200" />} text="No scheduled meetings are visible for this participant." />
                ) : (
                  scheduledMeetings.map((meeting) => (
                    <div key={meeting.id} className="rounded-2xl border border-slate-100 p-4 bg-slate-50/70 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-charcoal-900">{meeting.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{meeting.type}</p>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 whitespace-nowrap">{meeting.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="text-xl font-bold text-charcoal-900">Immediate Barriers / Needs</h2>
                <AlertCircle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="space-y-4">
                {barriersAndNeeds.length === 0 ? (
                  <EmptyState icon={<AlertCircle className="w-10 h-10 text-slate-200" />} text="No immediate barriers or needs are flagged yet." />
                ) : (
                  barriersAndNeeds.map((item) => (
                    <div key={item.id} className={`rounded-2xl border p-4 ${item.tone === "rose" ? "bg-rose-50 border-rose-100" : "bg-amber-50 border-amber-100"}`}>
                      <p className={`text-sm font-bold ${item.tone === "rose" ? "text-rose-700" : "text-amber-700"}`}>{item.title}</p>
                      <p className={`text-sm mt-2 leading-relaxed ${item.tone === "rose" ? "text-rose-600" : "text-amber-700"}`}>{item.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold text-charcoal-900">Case Manager Actions</h2>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent activity</span>
            </div>
            <div className="space-y-4">
              {caseManagerActions.length === 0 ? (
                <EmptyState icon={<FileText className="w-10 h-10 text-slate-200" />} text="No case manager actions are documented yet." />
              ) : (
                caseManagerActions.map((action) => (
                  <div key={action.id} className="rounded-2xl border border-slate-100 p-5 bg-slate-50/70">
                    <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                      <p className="text-sm font-bold text-charcoal-900">{action.title}</p>
                      <span className="text-xs text-slate-400">{action.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{action.detail}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold text-charcoal-900">Demographics Snapshot</h2>
              <Link href={`/portal/staff/caseload/${profileSlot}/demographics`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">{demo ? "Edit" : "Add"} →</Link>
            </div>
            {!demo ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400 mb-3">No demographics on file yet.</p>
                <Link href={`/portal/staff/caseload/${profileSlot}/demographics`} className="inline-block text-xs font-bold text-indigo-600 hover:text-indigo-700">Fill in demographics →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {demo.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700 font-medium">{demo.phone}</span>
                  </div>
                )}
                {demo.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700 font-medium truncate">{demo.email}</span>
                  </div>
                )}
                {demoAge !== null && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700 font-medium">Age {demoAge} · {demo.gender ?? "Not specified"}</span>
                  </div>
                )}
                {demo.housingStatus && (
                  <div className="flex items-center gap-3 text-sm">
                    <Home className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700 font-medium">{demo.housingStatus}</span>
                  </div>
                )}
                {demo.insuranceType && (
                  <div className="flex items-center gap-3 text-sm">
                    <Heart className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700 font-medium">{demo.insuranceType}</span>
                  </div>
                )}
                {demo.preferredLanguage && demo.preferredLanguage !== "English" && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-700 font-medium">Speaks {demo.preferredLanguage}</span>
                  </div>
                )}
                {demo.emergencyContactName && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Emergency Contact</p>
                    <p className="text-sm font-semibold text-slate-700">{demo.emergencyContactName}</p>
                    {demo.emergencyContactPhone && <p className="text-xs text-slate-500">{demo.emergencyContactPhone} · {demo.emergencyContactRelation}</p>}
                  </div>
                )}
                {demo.hasPets === "Yes" && (demo.petName || demo.petBreed) && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Pet</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {demo.petName ?? "Unnamed"}{demo.petBreed ? ` · ${demo.petBreed}` : ""}
                    </p>
                    {demo.petType && <p className="text-xs text-slate-500">{demo.petType}{demo.petCount && demo.petCount !== "1" ? ` · ${demo.petCount} pets` : ""}</p>}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold text-charcoal-900">Progress Bars</h2>
              <TrendingUp className="w-5 h-5 text-teal-500" />
            </div>
            <div className="space-y-5">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm font-semibold text-slate-600">{metric.label}</span>
                    <span className="text-sm font-bold text-charcoal-900">{metric.value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${metric.tone}`} style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold text-charcoal-900">Itemized Checklist</h2>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="space-y-4">
              {checklist.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-100 p-4 bg-slate-50/60">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center ${item.done ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-charcoal-900">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold text-charcoal-900">Secured Documents</h2>
              <FileBox className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="space-y-3">
              {clientDocs.length === 0 ? (
                <EmptyState icon={<FileBox className="w-10 h-10 text-slate-200" />} text="No secured documents linked yet." />
              ) : (
                clientDocs.map((doc) => (
                  <a key={doc._id} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 transition">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-charcoal-900 truncate">{doc.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{doc.type} · {doc.size}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                  </a>
                ))
              )}
              <Link href="/portal/staff/documents" className="block text-center mt-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition">
                Open Document Hub
              </Link>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold text-charcoal-900">Participant Voice</h2>
              <Phone className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Latest journal</p>
                <p className="text-sm text-indigo-900 leading-relaxed">
                  {clientJournals[0]?.content ?? "No journal entry logged by the participant yet."}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50/70">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Latest feedback</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {clientFeedback[0]?.content ?? "No direct feedback from this participant yet."}
                </p>
              </div>
              <Link href={`/portal/staff/messages?client=${encodeURIComponent(client.name)}`} className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-4 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20">
                <MessageSquare className="w-4 h-4" /> Message the Client
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
        {icon}
      </div>
      <p className="text-lg font-bold text-charcoal-900">{value}</p>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="p-8 text-center flex flex-col items-center rounded-2xl bg-slate-50 border border-slate-100">
      {icon}
      <p className="text-slate-400 font-medium mt-3 text-sm">{text}</p>
    </div>
  );
}
