import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  participants: defineTable({
    slot: v.string(),
    name: v.string(),
    status: v.string(),
    environment: v.string(),
    email: v.optional(v.string()),
  }).index("by_slot", ["slot"]),

  caseNotes: defineTable({
    clientName: v.string(),
    date: v.string(),
    type: v.string(),
    summary: v.string(),
    staff: v.string(),
  }).index("by_client", ["clientName"]),

  documents: defineTable({
    name: v.string(),
    type: v.string(),
    size: v.string(),
    client: v.string(),
    date: v.string(),
    uploader: v.string(),
    url: v.string(),
  }).index("by_client", ["client"]),

  journals: defineTable({
    client: v.string(),
    date: v.string(),
    mood: v.string(),
    content: v.string(),
  }).index("by_client", ["client"]),

  feedback: defineTable({
    client: v.string(),
    type: v.union(v.literal("complaint"), v.literal("suggestion")),
    content: v.string(),
    date: v.string(),
  }),

  shoutOuts: defineTable({
    from: v.string(),
    to: v.string(),
    message: v.string(),
    date: v.string(),
  }),

  smartGoals: defineTable({
    client: v.string(),
    date: v.string(),
    specific: v.string(),
    measurable: v.string(),
    achievable: v.string(),
    relevant: v.string(),
    timebound: v.string(),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("missed")),
  }).index("by_client", ["client"]),

  requests: defineTable({
    client: v.string(),
    type: v.string(),
    note: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("denied")),
    date: v.string(),
  }),

  teamMembers: defineTable({
    memberId: v.string(),
    name: v.string(),
    role: v.string(),
  }).index("by_memberId", ["memberId"]),

  demographics: defineTable({
    slot: v.string(),
    // Identity
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dob: v.string(),
    gender: v.string(),
    race: v.optional(v.string()),
    ethnicity: v.optional(v.string()),
    preferredLanguage: v.optional(v.string()),
    // Contact
    phone: v.string(),
    email: v.optional(v.string()),
    // Address
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    // Status
    maritalStatus: v.optional(v.string()),
    housingStatus: v.optional(v.string()),
    employmentStatus: v.optional(v.string()),
    educationLevel: v.optional(v.string()),
    veteranStatus: v.optional(v.string()),
    // Insurance / Benefits
    insuranceType: v.optional(v.string()),
    insuranceMemberId: v.optional(v.string()),
    // Referral
    referralSource: v.optional(v.string()),
    referralDate: v.optional(v.string()),
    // Emergency Contact
    emergencyContactName: v.string(),
    emergencyContactPhone: v.string(),
    emergencyContactRelation: v.optional(v.string()),
    // Program
    caseManager: v.string(),
    intakeDate: v.string(),
    intakeNotes: v.string(),
    dischargeDate: v.optional(v.string()),
    dischargeReason: v.optional(v.string()),
    // Pets
    hasPets: v.optional(v.string()),
    petType: v.optional(v.string()),
    petName: v.optional(v.string()),
    petBreed: v.optional(v.string()),
    petColor: v.optional(v.string()),
    petAge: v.optional(v.string()),
    petCount: v.optional(v.string()),
    petSpayedNeutered: v.optional(v.string()),
  }).index("by_slot", ["slot"]),

  signupRequests: defineTable({
    name: v.string(),
    email: v.string(),
    note: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("denied")),
    token: v.string(),
    date: v.string(),
  }).index("by_token", ["token"]).index("by_email", ["email"]),

  otpCodes: defineTable({
    email: v.string(),
    codeHash: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
  }).index("by_email", ["email"]),

  profilePhotos: defineTable({
    userEmail: v.string(),
    photoUrl: v.string(),
    uploadedAt: v.number(),
  }).index("by_email", ["userEmail"]),

  userProfiles: defineTable({
    userEmail: v.string(),
    phone: v.optional(v.string()),
    workPhone: v.optional(v.string()),
    personalEmail: v.optional(v.string()),
    workSchedule: v.optional(v.string()),
  }).index("by_email", ["userEmail"]),

  // ── Admin tables ───────────────────────────────────────────────────────────

  auditLogs: defineTable({
    actor: v.string(),
    actorRole: v.string(),
    action: v.string(),
    target: v.optional(v.string()),
    targetType: v.optional(v.string()),
    detail: v.optional(v.string()),
    timestamp: v.number(),
    ip: v.optional(v.string()),
  }).index("by_actor", ["actor"]).index("by_timestamp", ["timestamp"]),

  housingMatches: defineTable({
    clientSlot: v.string(),
    clientName: v.string(),
    unitAddress: v.string(),
    landlord: v.optional(v.string()),
    matchedDate: v.string(),
    status: v.union(v.literal("pending"), v.literal("active"), v.literal("exited")),
    notes: v.optional(v.string()),
  }).index("by_slot", ["clientSlot"]).index("by_status", ["status"]),

  staffSchedules: defineTable({
    staffEmail: v.string(),
    staffName: v.string(),
    dayOfWeek: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
  }).index("by_staff", ["staffEmail"]),

  // ── HMIS Upload Queue ────────────────────────────────────────────────────────
  hmisQueue: defineTable({
    clientName: v.string(),   // UID / tent identifier
    date: v.string(),         // YYYY-MM-DD
    type: v.string(),
    summary: v.string(),
    staff: v.string(),
    checked: v.boolean(),
    checkedAt: v.optional(v.string()),
  }).index("by_date", ["date"]).index("by_date_checked", ["date", "checked"]),

  // ── Generic KV store (used by server-side auth/credential storage) ─────────
  keyValueStore: defineTable({
    namespace: v.string(),
    key: v.string(),
    value: v.string(),
  }).index("by_namespace_key", ["namespace", "key"]),

  // ── Portal Chat (broadcast) ────────────────────────────────────────────────
  chatMessages: defineTable({
    author: v.string(),
    role: v.string(),   // "staff" | "client"
    body: v.string(),
    ts: v.string(),
  }),

  // ── Direct Messages ────────────────────────────────────────────────────────
  directMessages: defineTable({
    senderId: v.string(),      // sender name (e.g. "Mack" or participant name)
    receiverId: v.string(),    // recipient name
    convKey: v.string(),       // sorted "A|B" for fast lookup
    senderRole: v.string(),    // "staff" | "client"
    body: v.optional(v.string()),
    image: v.optional(v.string()),  // base64 data URL
    ts: v.string(),
  }).index("by_convKey", ["convKey"]),
});
