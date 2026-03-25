import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// ─── HMIS Upload Queue ────────────────────────────────────────────────────────────

export const listHmisQueueByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    return await ctx.db
      .query("hmisQueue")
      .withIndex("by_date", (q) => q.eq("date", date))
      .order("desc")
      .collect();
  },
});

export const addToHmisQueue = mutation({
  args: {
    clientName: v.string(),
    date: v.string(),
    type: v.string(),
    summary: v.string(),
    staff: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("hmisQueue", { ...args, checked: false });
  },
});

export const markHmisChecked = mutation({
  args: { id: v.id("hmisQueue"), checked: v.boolean() },
  handler: async (ctx, { id, checked }) => {
    await ctx.db.patch(id, {
      checked,
      checkedAt: checked ? new Date().toISOString() : undefined,
    });
  },
});
// ─── Generic KV Store ────────────────────────────────────────────────────────

export const kvGet = query({
  args: { namespace: v.string(), key: v.string() },
  handler: async (ctx, { namespace, key }) => {
    const record = await ctx.db
      .query("keyValueStore")
      .withIndex("by_namespace_key", (q) => q.eq("namespace", namespace).eq("key", key))
      .first();
    return record?.value ?? null;
  },
});

export const kvSet = mutation({
  args: { namespace: v.string(), key: v.string(), value: v.string() },
  handler: async (ctx, { namespace, key, value }) => {
    const existing = await ctx.db
      .query("keyValueStore")
      .withIndex("by_namespace_key", (q) => q.eq("namespace", namespace).eq("key", key))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { value });
    } else {
      await ctx.db.insert("keyValueStore", { namespace, key, value });
    }
  },
});

// ─── Participants ────────────────────────────────────────────────────────────

export const listParticipants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("participants").collect();
  },
});

export const addParticipant = mutation({
  args: {
    slot: v.string(),
    name: v.string(),
    status: v.string(),
    environment: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("participants", args);
  },
});

export const updateParticipantStatus = mutation({
  args: { slot: v.string(), status: v.string() },
  handler: async (ctx, { slot, status }) => {
    const existing = await ctx.db
      .query("participants")
      .withIndex("by_slot", (q) => q.eq("slot", slot))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { status });
    }
  },
});

export const updateParticipant = mutation({
  args: {
    slot: v.string(),
    name: v.string(),
    environment: v.string(),
    status: v.string(),
  },
  handler: async (ctx, { slot, name, environment, status }) => {
    const existing = await ctx.db
      .query("participants")
      .withIndex("by_slot", (q) => q.eq("slot", slot))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { name, environment, status });
    }
  },
});

export const clearAllParticipants = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("participants").collect();
    await Promise.all(all.map((p) => ctx.db.delete(p._id)));
    return { deleted: all.length };
  },
});

export const upsertParticipant = mutation({
  args: {
    slot: v.string(),
    name: v.string(),
    status: v.string(),
    environment: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("participants")
      .withIndex("by_slot", (q) => q.eq("slot", args.slot))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        status: args.status,
        environment: args.environment,
      });
      return existing._id;
    }
    return await ctx.db.insert("participants", args);
  },
});

// ─── Case Notes ─────────────────────────────────────────────────────────────

export const listCaseNotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("caseNotes").order("desc").collect();
  },
});

export const addCaseNote = mutation({
  args: {
    clientName: v.string(),
    date: v.string(),
    type: v.string(),
    summary: v.string(),
    staff: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("caseNotes", args);
  },
});

// ─── Documents ───────────────────────────────────────────────────────────────

export const listDocuments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").order("desc").collect();
  },
});

export const addDocument = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    size: v.string(),
    client: v.string(),
    date: v.string(),
    uploader: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", args);
  },
});

export const updateDocumentClient = mutation({
  args: { id: v.id("documents"), client: v.string() },
  handler: async (ctx, { id, client }) => {
    await ctx.db.patch(id, { client });
  },
});

// ─── Journals ────────────────────────────────────────────────────────────────

export const listJournals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("journals").order("desc").collect();
  },
});

export const addJournal = mutation({
  args: {
    client: v.string(),
    date: v.string(),
    mood: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("journals", args);
  },
});

// ─── Feedback ────────────────────────────────────────────────────────────────

export const listFeedback = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("feedback").order("desc").collect();
  },
});

export const addFeedback = mutation({
  args: {
    client: v.string(),
    type: v.union(v.literal("complaint"), v.literal("suggestion")),
    content: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feedback", args);
  },
});

// ─── Shout Outs ──────────────────────────────────────────────────────────────

export const listShoutOuts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("shoutOuts").order("desc").collect();
  },
});

export const addShoutOut = mutation({
  args: {
    from: v.string(),
    to: v.string(),
    message: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("shoutOuts", args);
  },
});

// ─── Smart Goals ─────────────────────────────────────────────────────────────

export const listSmartGoals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("smartGoals").order("desc").collect();
  },
});

export const addSmartGoal = mutation({
  args: {
    client: v.string(),
    date: v.string(),
    specific: v.string(),
    measurable: v.string(),
    achievable: v.string(),
    relevant: v.string(),
    timebound: v.string(),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("missed")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("smartGoals", args);
  },
});

// ─── Requests ─────────────────────────────────────────────────────────────────

export const listRequests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("requests").order("desc").collect();
  },
});

export const addRequest = mutation({
  args: {
    client: v.string(),
    type: v.string(),
    note: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("denied")),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("requests", args);
  },
});

export const updateRequestStatus = mutation({
  args: {
    id: v.id("requests"),
    status: v.union(v.literal("approved"), v.literal("denied")),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

// ─── Team Members ─────────────────────────────────────────────────────────────

export const listTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teamMembers").collect();
  },
});

export const addTeamMember = mutation({
  args: {
    memberId: v.string(),
    name: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teamMembers", args);
  },
});

// ─── Demographics ─────────────────────────────────────────────────────────────

export const listDemographics = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("demographics").collect();
  },
});

export const upsertDemographics = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("demographics")
      .withIndex("by_slot", (q) => q.eq("slot", args.slot))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("demographics", args);
    }
  },
});

// ─── Signup Requests ─────────────────────────────────────────────────────────

export const createSignupRequest = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    note: v.optional(v.string()),
    token: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("signupRequests", { ...args, status: "pending" });
  },
});

export const getSignupRequestByToken = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    return await ctx.db
      .query("signupRequests")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
  },
});

export const updateSignupRequestStatus = mutation({
  args: {
    token: v.string(),
    status: v.union(v.literal("approved"), v.literal("denied")),
  },
  handler: async (ctx, { token, status }) => {
    const existing = await ctx.db
      .query("signupRequests")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { status });
    }
    return existing;
  },
});

// ─── OTP Codes (2FA) ─────────────────────────────────────────────────────────

export const upsertOtpCode = mutation({
  args: {
    email: v.string(),
    codeHash: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, { email, codeHash, expiresAt }) => {
    const existing = await ctx.db
      .query("otpCodes")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    for (const otp of existing) {
      await ctx.db.delete(otp._id);
    }
    await ctx.db.insert("otpCodes", { email, codeHash, expiresAt, used: false });
  },
});

export const verifyAndConsumeOtp = mutation({
  args: { email: v.string(), codeHash: v.string() },
  handler: async (ctx, { email, codeHash }) => {
    const record = await ctx.db
      .query("otpCodes")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (!record) return false;
    if (record.used) return false;
    if (Date.now() > record.expiresAt) return false;
    if (record.codeHash !== codeHash) return false;
    await ctx.db.patch(record._id, { used: true });
    return true;
  },
});

// ─── Profile Photos ──────────────────────────────────────────────────────────

export const getProfilePhoto = query({
  args: { userEmail: v.string() },
  handler: async (ctx, { userEmail }) => {
    return await ctx.db
      .query("profilePhotos")
      .withIndex("by_email", (q) => q.eq("userEmail", userEmail))
      .first();
  },
});

export const upsertProfilePhoto = mutation({
  args: {
    userEmail: v.string(),
    photoUrl: v.string(),
  },
  handler: async (ctx, { userEmail, photoUrl }) => {
    const existing = await ctx.db
      .query("profilePhotos")
      .withIndex("by_email", (q) => q.eq("userEmail", userEmail))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { photoUrl, uploadedAt: Date.now() });
      return existing._id;
    } else {
      return await ctx.db.insert("profilePhotos", {
        userEmail,
        photoUrl,
        uploadedAt: Date.now(),
      });
    }
  },
});

export const deleteProfilePhoto = mutation({
  args: { userEmail: v.string() },
  handler: async (ctx, { userEmail }) => {
    const existing = await ctx.db
      .query("profilePhotos")
      .withIndex("by_email", (q) => q.eq("userEmail", userEmail))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

// ─── User Profiles (contact info, schedule) ──────────────────────────────────

export const getUserProfile = query({
  args: { userEmail: v.string() },
  handler: async (ctx, { userEmail }) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_email", (q) => q.eq("userEmail", userEmail))
      .first();
  },
});

export const upsertUserProfile = mutation({
  args: {
    userEmail: v.string(),
    phone: v.optional(v.string()),
    workPhone: v.optional(v.string()),
    personalEmail: v.optional(v.string()),
    workSchedule: v.optional(v.string()),
  },
  handler: async (ctx, { userEmail, phone, workPhone, personalEmail, workSchedule }) => {
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_email", (q) => q.eq("userEmail", userEmail))
      .first();
    const fields = { phone, workPhone, personalEmail, workSchedule };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return existing._id;
    } else {
      return await ctx.db.insert("userProfiles", { userEmail, ...fields });
    }
  },
});

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export const listAuditLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("auditLogs").withIndex("by_timestamp").order("desc").collect();
  },
});

export const addAuditLog = mutation({
  args: {
    actor: v.string(),
    actorRole: v.string(),
    action: v.string(),
    target: v.optional(v.string()),
    targetType: v.optional(v.string()),
    detail: v.optional(v.string()),
    timestamp: v.number(),
    ip: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("auditLogs", args);
  },
});

// ─── Housing Matches ─────────────────────────────────────────────────────────

export const listHousingMatches = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("housingMatches").order("desc").collect();
  },
});

export const upsertHousingMatch = mutation({
  args: {
    clientSlot: v.string(),
    clientName: v.string(),
    unitAddress: v.string(),
    landlord: v.optional(v.string()),
    matchedDate: v.string(),
    status: v.union(v.literal("pending"), v.literal("active"), v.literal("exited")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("housingMatches")
      .withIndex("by_slot", (q) => q.eq("clientSlot", args.clientSlot))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      return await ctx.db.insert("housingMatches", args);
    }
  },
});

export const updateHousingMatchStatus = mutation({
  args: {
    id: v.id("housingMatches"),
    status: v.union(v.literal("pending"), v.literal("active"), v.literal("exited")),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

// ─── Staff Schedules ─────────────────────────────────────────────────────────

export const listStaffSchedules = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("staffSchedules").collect();
  },
});

export const upsertStaffSchedule = mutation({
  args: {
    staffEmail: v.string(),
    staffName: v.string(),
    dayOfWeek: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("staffSchedules", args);
  },
});

export const deleteStaffSchedule = mutation({
  args: { id: v.id("staffSchedules") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// ─── Admin: Reassign Case Manager ────────────────────────────────────────────

export const reassignCaseManager = mutation({
  args: { slot: v.string(), caseManager: v.string() },
  handler: async (ctx, { slot, caseManager }) => {
    const demo = await ctx.db
      .query("demographics")
      .withIndex("by_slot", (q) => q.eq("slot", slot))
      .first();
    if (demo) {
      await ctx.db.patch(demo._id, { caseManager });
    }
  },
});

// ─── Portal Chat ─────────────────────────────────────────────────────────────

export const listChatMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("chatMessages").order("asc").take(200);
  },
});

export const sendChatMessage = mutation({
  args: { author: v.string(), role: v.string(), body: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatMessages", {
      ...args,
      ts: new Date().toISOString(),
    });
  },
});

// ─── Direct Messages ──────────────────────────────────────────────────────────

export const getDirectMessages = query({
  args: { userA: v.string(), userB: v.string() },
  handler: async (ctx, { userA, userB }) => {
    const key = [userA, userB].sort().join("|");
    return await ctx.db
      .query("directMessages")
      .withIndex("by_convKey", (q) => q.eq("convKey", key))
      .order("asc")
      .take(300);
  },
});

export const sendDirectMessage = mutation({
  args: {
    senderId: v.string(),
    receiverId: v.string(),
    senderRole: v.string(),
    body: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, { senderId, receiverId, senderRole, body, image }) => {
    const convKey = [senderId, receiverId].sort().join("|");
    return await ctx.db.insert("directMessages", {
      senderId,
      receiverId,
      convKey,
      senderRole,
      body,
      image,
      ts: new Date().toISOString(),
    });
  },
});

// ─── Team Member Seeding ──────────────────────────────────────────────────────

export const clearTeamMembers = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("teamMembers").collect();
    await Promise.all(all.map((m) => ctx.db.delete(m._id)));
    return { deleted: all.length };
  },
});

export const upsertTeamMember = mutation({
  args: {
    memberId: v.string(),
    name: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("teamMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", args.memberId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { name: args.name, role: args.role });
    } else {
      await ctx.db.insert("teamMembers", args);
    }
  },
});

// ─── Bulk Export (for Google Sheets sync) ────────────────────────────────────

export const exportCaseload = query({
  args: {},
  handler: async (ctx) => {
    const [participants, demographics, caseNotes, documents, smartGoals, requests, housingMatches] =
      await Promise.all([
        ctx.db.query("participants").collect(),
        ctx.db.query("demographics").collect(),
        ctx.db.query("caseNotes").order("desc").collect(),
        ctx.db.query("documents").collect(),
        ctx.db.query("smartGoals").collect(),
        ctx.db.query("requests").collect(),
        ctx.db.query("housingMatches").collect(),
      ]);
    return { participants, demographics, caseNotes, documents, smartGoals, requests, housingMatches };
  },
});
