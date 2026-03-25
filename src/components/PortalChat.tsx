"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  MessageSquare,
  X,
  Send,
  Image as ImageIcon,
  Users,
  ChevronLeft,
  Minimize2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Participant = {
  _id: string;
  slot: string;
  name: string;
  status: string;
  environment: string;
  email?: string;
};

type Contact = {
  id: string;
  name: string;
  role: "staff" | "client";
  online?: boolean;
};

type DM = {
  _id: string;
  senderId: string;
  receiverId: string;
  senderRole: string;
  body?: string;
  image?: string;
  ts: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(ts: string) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function avatarColor(name: string) {
  const colors = [
    "bg-teal-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-sky-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-pink-500",
  ];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return colors[hash % colors.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sz} ${avatarColor(name)} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {getInitials(name)}
    </div>
  );
}

// ─── Sidebar contacts list ────────────────────────────────────────────────────

function ContactsList({
  contacts,
  selected,
  onSelect,
  myName,
}: {
  contacts: Contact[];
  selected: Contact | null;
  onSelect: (c: Contact) => void;
  myName: string;
}) {
  return (
    <aside className="w-full flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-500" />
          <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
            Conversations
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {contacts.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 sm:py-2.5 text-left transition-colors ${
              selected?.id === c.id
                ? "bg-teal-50 dark:bg-teal-900/30 border-r-2 border-teal-500"
                : "hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <div className="relative">
              <Avatar name={c.name} size="sm" />
              {c.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                {c.name}
              </div>
              <div className="text-xs text-slate-400">
                {c.online ? "Online" : c.role === "staff" ? "Case Manager" : "Participant"}
              </div>
            </div>
          </button>
        ))}
        {contacts.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-8">No contacts yet</div>
        )}
      </div>
    </aside>
  );
}

// ─── Chat area ────────────────────────────────────────────────────────────────

function ChatArea({
  contact,
  myId,
  myRole,
  onBack,
}: {
  contact: Contact;
  myId: string;
  myRole: "staff" | "client";
  onBack: () => void;
}) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const rawMessages = useQuery(api.functions.getDirectMessages, {
    userA: myId,
    userB: contact.id,
  });
  const messages = (rawMessages ?? []) as DM[];

  const sendDM = useMutation(api.functions.sendDirectMessage);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSend() {
    if (!text.trim() && !imagePreview) return;
    await sendDM({
      senderId: myId,
      receiverId: contact.id,
      senderRole: myRole,
      body: text.trim() || undefined,
      image: imagePreview ?? undefined,
    });
    setText("");
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
        <button
          onClick={onBack}
          aria-label="Back to contacts"
          className="sm:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 active:bg-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="relative">
          <Avatar name={contact.name} size="sm" />
          {contact.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">
            {contact.name}
          </div>
          <div className="text-xs text-green-500 font-medium">
            {contact.online ? "Online" : "Active"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50 dark:bg-slate-950">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-12">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Start a conversation with {contact.name}
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === myId;
          return (
            <div key={msg._id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              {!isMe && <Avatar name={msg.senderId} size="sm" />}
              <div className={`flex flex-col max-w-[72%] ${isMe ? "items-end" : "items-start"}`}>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className="max-w-[200px] rounded-xl mb-1 border border-slate-200 dark:border-slate-700"
                  />
                )}
                {msg.body && (
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-teal-500 text-white rounded-tr-sm"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-sm"
                    }`}
                  >
                    {msg.body}
                  </div>
                )}
                <span className="text-[10px] text-slate-400 mt-0.5 px-1">{formatTime(msg.ts)}</span>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="pb-safe-input px-4 pt-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">        {imagePreview && (
          <div className="mb-2 flex items-center gap-2">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="preview"
                className="h-16 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
              />
              <button
                aria-label="Remove image"
                onClick={() => {
                  setImagePreview(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-red-100 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`p-2 rounded-full transition-colors ${
              imagePreview
                ? "text-teal-500 bg-teal-50 dark:bg-teal-900/30"
                : "text-slate-400 hover:text-teal-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            title="Attach image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            title="Attach image"
            aria-label="Attach image"
            className="hidden"
            onChange={handleImageChange}
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={`Message ${contact.name}…`}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-slate-400"
          />
          <button
            aria-label="Send message"
            onClick={handleSend}
            disabled={!text.trim() && !imagePreview}
            className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── No-chat placeholder ──────────────────────────────────────────────────────

function NoChatSelected() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-950">
      <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-teal-400" />
      </div>
      <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">Your Messages</h3>
      <p className="text-sm text-slate-400 max-w-[200px]">
        Select a conversation from the left to get started
      </p>
    </div>
  );
}

// ─── Main PortalChat ──────────────────────────────────────────────────────────

export default function PortalChat({ role }: { role: "staff" | "client" }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);

  // My identity
  const myName = session?.user?.name ?? (role === "staff" ? "Mack" : "Participant");
  const myId = myName;

  // Load contacts from Convex
  const participantsRaw = useQuery(api.functions.listParticipants);
  const participants = (participantsRaw ?? []) as Participant[];

  // Build contact list
  let contacts: Contact[] = [];
  if (role === "staff") {
    // Staff sees all non-offline participants
    contacts = participants
      .filter((p: Participant) => p.status !== "Offline")
      .map((p: Participant) => ({
        id: p.name,
        name: p.name,
        role: "client" as const,
        online: p.status === "Active",
      }));
  } else {
    // Clients only see their case manager
    contacts = [
      {
        id: "Mack",
        name: "Mack (Case Manager)",
        role: "staff" as const,
        online: true,
      },
    ];
  }

  const hasContacts = contacts.length > 0;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-[5.5rem] right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-lg flex items-center justify-center transition-all active:scale-95"
          aria-label="Open messages"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Panel — full-screen on mobile, floating on sm+ */}
      {open && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[680px] sm:max-w-[calc(100vw-3rem)] sm:h-[540px] sm:max-h-[calc(100vh-5rem)] bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl sm:border sm:border-slate-200 dark:sm:border-slate-700 flex flex-col overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 bg-teal-500 text-white shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span className="font-semibold text-sm">
                {role === "staff" ? "Team Messages" : "Message Support"}
              </span>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                setSelected(null);
              }}
              className="p-1 rounded hover:bg-teal-600 transition-colors"
              aria-label="Close chat"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Body: sidebar + chat */}
          <div className="flex flex-1 overflow-hidden">
            {/* Contacts sidebar:
                mobile → full-width when no contact, hidden when chatting
                sm+    → fixed 224px, always visible alongside chat */}
            <div
              className={`shrink-0 border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden ${
                selected
                  ? "hidden sm:flex sm:w-56"
                  : "flex w-full sm:w-56"
              }`}
            >
              <ContactsList
                contacts={contacts}
                selected={selected}
                onSelect={(c) => setSelected(c)}
                myName={myId}
              />
            </div>

            {/* Chat area:
                mobile → full-width when contact selected, hidden otherwise
                sm+    → always fills remaining space */}
            <div className={`overflow-hidden ${
              selected ? "flex-1" : "hidden sm:flex sm:flex-1"
            }`}>
              {selected ? (
                <ChatArea
                  contact={selected}
                  myId={myId}
                  myRole={role}
                  onBack={() => setSelected(null)}
                />
              ) : (
                <NoChatSelected />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
