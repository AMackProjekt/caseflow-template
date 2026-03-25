"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useStaff } from "@/context/StaffContext";
import {
  ArrowLeft,
  Briefcase,
  Globe,
  Heart,
  Home,
  Loader2,
  MapPin,
  PawPrint,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GENDERS = [
  "Male",
  "Female",
  "Non-Binary",
  "Transgender Male",
  "Transgender Female",
  "Genderqueer / Gender Non-Conforming",
  "Prefer Not to Say",
];

const RACES = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Two or More Races",
  "Other",
  "Prefer Not to Say",
];

const ETHNICITIES = [
  "Hispanic or Latino",
  "Not Hispanic or Latino",
  "Prefer Not to Say",
];

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "Haitian Creole",
  "Vietnamese",
  "Chinese (Mandarin)",
  "Chinese (Cantonese)",
  "Korean",
  "Arabic",
  "Portuguese",
  "Russian",
  "Somali",
  "Tagalog / Filipino",
  "ASL",
  "Other",
];

const MARITAL_STATUSES = [
  "Single",
  "Married",
  "Domestic Partnership",
  "Separated",
  "Divorced",
  "Widowed",
  "Prefer Not to Say",
];

const HOUSING_STATUSES = [
  "Stable Housing",
  "Transitional Housing",
  "Temporary Housing / Doubled Up",
  "Shelter",
  "Unsheltered / Street",
  "Hotel / Motel",
  "Unknown",
];

const EMPLOYMENT_STATUSES = [
  "Employed Full-Time",
  "Employed Part-Time",
  "Self-Employed",
  "Unemployed — Seeking Work",
  "Unemployed — Not Seeking",
  "Student",
  "Retired",
  "Disabled / Unable to Work",
  "Prefer Not to Say",
];

const EDUCATION_LEVELS = [
  "No Formal Education",
  "Some Elementary School",
  "Middle School",
  "Some High School",
  "High School Diploma / GED",
  "Some College",
  "Associate Degree",
  "Bachelor's Degree",
  "Graduate Degree",
  "Vocational / Trade Certification",
  "Unknown",
];

const VETERAN_STATUSES = [
  "Non-Veteran",
  "Veteran — Active Benefits",
  "Veteran — Not Enrolled",
  "Active Military",
  "Prefer Not to Say",
];

const INSURANCE_TYPES = [
  "Medicaid",
  "Medicare",
  "Medicare + Medicaid (Dual)",
  "Private / Employer Insurance",
  "Marketplace / ACA Plan",
  "CHIP",
  "VA / TRICARE",
  "Uninsured",
  "Unknown",
];

const REFERRAL_SOURCES = [
  "Self",
  "Family / Friend",
  "Hospital / Clinic",
  "Outreach Worker",
  "Law Enforcement",
  "Court / Probation",
  "School",
  "Other Agency",
  "Other",
];

const CASE_MANAGERS = [
  "Abby", "Amalia", "Coco", "Jonathan", "Lawanda", "Mack", "Spencer", "Tey", "Tonya", "William",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

type DemographicsRecord = {
  _id: string;
  slot: string;
  firstName?: string;
  lastName?: string;
  dob: string;
  gender: string;
  race?: string;
  ethnicity?: string;
  preferredLanguage?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  maritalStatus?: string;
  housingStatus?: string;
  employmentStatus?: string;
  educationLevel?: string;
  veteranStatus?: string;
  insuranceType?: string;
  insuranceMemberId?: string;
  referralSource?: string;
  referralDate?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation?: string;
  caseManager: string;
  intakeDate: string;
  intakeNotes: string;
  dischargeDate?: string;
  dischargeReason?: string;
  hasPets?: string;
  petType?: string;
  petName?: string;
  petBreed?: string;
  petColor?: string;
  petAge?: string;
  petCount?: string;
  petSpayedNeutered?: string;
};

type DemoForm = {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  race: string;
  ethnicity: string;
  preferredLanguage: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  maritalStatus: string;
  housingStatus: string;
  employmentStatus: string;
  educationLevel: string;
  veteranStatus: string;
  insuranceType: string;
  insuranceMemberId: string;
  referralSource: string;
  referralDate: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  caseManager: string;
  intakeDate: string;
  intakeNotes: string;
  dischargeDate: string;
  dischargeReason: string;
  hasPets: string;
  petType: string;
  petName: string;
  petBreed: string;
  petColor: string;
  petAge: string;
  petCount: string;
  petSpayedNeutered: string;
};

const EMPTY_FORM: DemoForm = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  race: "",
  ethnicity: "",
  preferredLanguage: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  maritalStatus: "",
  housingStatus: "",
  employmentStatus: "",
  educationLevel: "",
  veteranStatus: "",
  insuranceType: "",
  insuranceMemberId: "",
  referralSource: "",
  referralDate: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  caseManager: "",
  intakeDate: "",
  intakeNotes: "",
  dischargeDate: "",
  dischargeReason: "",
  hasPets: "",
  petType: "",
  petName: "",
  petBreed: "",
  petColor: "",
  petAge: "",
  petCount: "",
  petSpayedNeutered: "",
};

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <span className="text-teal-600">{icon}</span>
        <h2 className="text-base font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children, span }: { label: string; required?: boolean; children: React.ReactNode; span?: boolean }) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition";
const selectCls = `${inputCls} appearance-none`;
const textareaCls = `${inputCls} resize-none`;

export default function DemographicsPage() {
  const { slot } = useParams();
  const slotStr = Array.isArray(slot) ? slot[0] ?? "" : slot ?? "";
  const router = useRouter();
  const { participants } = useStaff();

  const allDemographics = (useQuery(api.functions.listDemographics) ?? []) as DemographicsRecord[];
  const upsert = useMutation(api.functions.upsertDemographics);

  const client = participants.find((p) => p.slot === slotStr);
  const existing = allDemographics.find((d) => d.slot === slotStr);

  const [form, setForm] = useState<DemoForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Pre-populate form when existing record loads
  useEffect(() => {
    if (!existing) return;
    setForm({
      firstName: existing.firstName ?? "",
      lastName: existing.lastName ?? "",
      dob: existing.dob ?? "",
      gender: existing.gender ?? "",
      race: existing.race ?? "",
      ethnicity: existing.ethnicity ?? "",
      preferredLanguage: existing.preferredLanguage ?? "",
      phone: existing.phone ?? "",
      email: existing.email ?? "",
      address: existing.address ?? "",
      city: existing.city ?? "",
      state: existing.state ?? "",
      zipCode: existing.zipCode ?? "",
      maritalStatus: existing.maritalStatus ?? "",
      housingStatus: existing.housingStatus ?? "",
      employmentStatus: existing.employmentStatus ?? "",
      educationLevel: existing.educationLevel ?? "",
      veteranStatus: existing.veteranStatus ?? "",
      insuranceType: existing.insuranceType ?? "",
      insuranceMemberId: existing.insuranceMemberId ?? "",
      referralSource: existing.referralSource ?? "",
      referralDate: existing.referralDate ?? "",
      emergencyContactName: existing.emergencyContactName ?? "",
      emergencyContactPhone: existing.emergencyContactPhone ?? "",
      emergencyContactRelation: existing.emergencyContactRelation ?? "",
      caseManager: existing.caseManager ?? "",
      intakeDate: existing.intakeDate ?? "",
      intakeNotes: existing.intakeNotes ?? "",
      dischargeDate: existing.dischargeDate ?? "",
      dischargeReason: existing.dischargeReason ?? "",
      hasPets: existing.hasPets ?? "",
      petType: existing.petType ?? "",
      petName: existing.petName ?? "",
      petBreed: existing.petBreed ?? "",
      petColor: existing.petColor ?? "",
      petAge: existing.petAge ?? "",
      petCount: existing.petCount ?? "",
      petSpayedNeutered: existing.petSpayedNeutered ?? "",
    });
  }, [existing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.dob || !form.gender || !form.phone || !form.caseManager || !form.intakeDate) {
      alert("Please complete all required fields.");
      return;
    }
    setIsSaving(true);
    try {
      await upsert({
        slot: slotStr,
        dob: form.dob,
        gender: form.gender,
        phone: form.phone,
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
        caseManager: form.caseManager,
        intakeNotes: form.intakeNotes,
        intakeDate: form.intakeDate,
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        race: form.race || undefined,
        ethnicity: form.ethnicity || undefined,
        preferredLanguage: form.preferredLanguage || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        zipCode: form.zipCode || undefined,
        maritalStatus: form.maritalStatus || undefined,
        housingStatus: form.housingStatus || undefined,
        employmentStatus: form.employmentStatus || undefined,
        educationLevel: form.educationLevel || undefined,
        veteranStatus: form.veteranStatus || undefined,
        insuranceType: form.insuranceType || undefined,
        insuranceMemberId: form.insuranceMemberId || undefined,
        referralSource: form.referralSource || undefined,
        referralDate: form.referralDate || undefined,
        emergencyContactRelation: form.emergencyContactRelation || undefined,
        dischargeDate: form.dischargeDate || undefined,
        dischargeReason: form.dischargeReason || undefined,
        hasPets: form.hasPets || undefined,
        petType: form.petType || undefined,
        petName: form.petName || undefined,
        petBreed: form.petBreed || undefined,
        petColor: form.petColor || undefined,
        petAge: form.petAge || undefined,
        petCount: form.petCount || undefined,
        petSpayedNeutered: form.petSpayedNeutered || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setTimeout(() => router.push(`/portal/staff/caseload/${slotStr}`), 1500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Demographics — {client?.name ?? slotStr}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Slot <span className="font-semibold text-teal-600">{slotStr}</span>
              {client ? ` · ${client.environment} · ${client.status}` : ""}
            </p>
          </div>
        </div>

        {/* HIPAA Banner */}
        <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-2xl p-4">
          <ShieldCheck className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
          <div className="text-sm text-teal-800">
            <p className="font-semibold mb-0.5">Protected Health Information — HIPAA Privacy Rule (45 CFR §164)</p>
            <p className="text-teal-700 leading-relaxed">
              All fields are stored securely and access is limited to authorized staff. Collect only information
              necessary for service delivery and program compliance. Do not record diagnoses, substance use history,
              or mental health records in this form.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Identity */}
          <Section title="Identity" icon={<User className="w-4 h-4" />}>
            <Field label="First Name">
              <input name="firstName" value={form.firstName} onChange={handleChange} className={inputCls} placeholder="First name" />
            </Field>
            <Field label="Last Name">
              <input name="lastName" value={form.lastName} onChange={handleChange} className={inputCls} placeholder="Last name" />
            </Field>
            <Field label="Date of Birth" required>
              <input name="dob" type="date" value={form.dob} onChange={handleChange} className={inputCls} title="Date of Birth" required />
            </Field>
            <Field label="Gender" required>
              <select name="gender" title="Gender" value={form.gender} onChange={handleChange} className={selectCls} required>
                <option value="">Select gender…</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Race">
              <select name="race" title="Race" value={form.race} onChange={handleChange} className={selectCls}>
                <option value="">Select race…</option>
                {RACES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Ethnicity">
              <select name="ethnicity" title="Ethnicity" value={form.ethnicity} onChange={handleChange} className={selectCls}>
                <option value="">Select ethnicity…</option>
                {ETHNICITIES.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </Field>
            <Field label="Preferred Language">
              <select name="preferredLanguage" title="Preferred Language" value={form.preferredLanguage} onChange={handleChange} className={selectCls}>
                <option value="">Select language…</option>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Marital Status">
              <select name="maritalStatus" title="Marital Status" value={form.maritalStatus} onChange={handleChange} className={selectCls}>
                <option value="">Select status…</option>
                {MARITAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </Section>

          {/* Contact */}
          <Section title="Contact Information" icon={<Phone className="w-4 h-4" />}>
            <Field label="Phone" required>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputCls} placeholder="(555) 000-0000" required />
            </Field>
            <Field label="Email">
              <input name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} placeholder="email@example.com" />
            </Field>
          </Section>

          {/* Address */}
          <Section title="Address" icon={<MapPin className="w-4 h-4" />}>
            <Field label="Street Address" span>
              <input name="address" value={form.address} onChange={handleChange} className={inputCls} placeholder="123 Main St" />
            </Field>
            <Field label="City">
              <input name="city" value={form.city} onChange={handleChange} className={inputCls} placeholder="City" />
            </Field>
            <Field label="State">
              <select name="state" title="State" value={form.state} onChange={handleChange} className={selectCls}>
                <option value="">Select state…</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="ZIP Code">
              <input name="zipCode" value={form.zipCode} onChange={handleChange} className={inputCls} placeholder="00000" maxLength={10} />
            </Field>
          </Section>

          {/* Status */}
          <Section title="Status & Background" icon={<Briefcase className="w-4 h-4" />}>
            <Field label="Housing Status">
              <select name="housingStatus" title="Housing Status" value={form.housingStatus} onChange={handleChange} className={selectCls}>
                <option value="">Select status…</option>
                {HOUSING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Employment Status">
              <select name="employmentStatus" title="Employment Status" value={form.employmentStatus} onChange={handleChange} className={selectCls}>
                <option value="">Select status…</option>
                {EMPLOYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Education Level">
              <select name="educationLevel" title="Education Level" value={form.educationLevel} onChange={handleChange} className={selectCls}>
                <option value="">Select level…</option>
                {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Veteran Status">
              <select name="veteranStatus" title="Veteran Status" value={form.veteranStatus} onChange={handleChange} className={selectCls}>
                <option value="">Select status…</option>
                {VETERAN_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </Section>

          {/* Insurance */}
          <Section title="Insurance & Benefits" icon={<ShieldCheck className="w-4 h-4" />}>
            <Field label="Insurance Type">
              <select name="insuranceType" title="Insurance Type" value={form.insuranceType} onChange={handleChange} className={selectCls}>
                <option value="">Select type…</option>
                {INSURANCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Member / Policy ID">
              <input name="insuranceMemberId" value={form.insuranceMemberId} onChange={handleChange} className={inputCls} placeholder="Member ID (if applicable)" />
            </Field>
          </Section>

          {/* Referral */}
          <Section title="Referral" icon={<Globe className="w-4 h-4" />}>
            <Field label="Referral Source">
              <select name="referralSource" title="Referral Source" value={form.referralSource} onChange={handleChange} className={selectCls}>
                <option value="">Select source…</option>
                {REFERRAL_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Referral Date">
              <input name="referralDate" type="date" value={form.referralDate} onChange={handleChange} className={inputCls} title="Referral Date" />
            </Field>
          </Section>

          {/* Emergency Contact */}
          <Section title="Emergency Contact" icon={<Heart className="w-4 h-4" />}>
            <Field label="Name">
              <input name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} className={inputCls} placeholder="Full name" />
            </Field>
            <Field label="Phone">
              <input name="emergencyContactPhone" type="tel" value={form.emergencyContactPhone} onChange={handleChange} className={inputCls} placeholder="(555) 000-0000" />
            </Field>
            <Field label="Relationship">
              <input name="emergencyContactRelation" value={form.emergencyContactRelation} onChange={handleChange} className={inputCls} placeholder="e.g. Parent, Sibling, Friend" />
            </Field>
          </Section>

          {/* Program */}
          <Section title="Program Enrollment" icon={<Home className="w-4 h-4" />}>
            <Field label="Case Manager" required>
              <select name="caseManager" title="Case Manager" value={form.caseManager} onChange={handleChange} className={selectCls} required>
                <option value="">Select case manager…</option>
                {CASE_MANAGERS.map((cm) => <option key={cm} value={cm}>{cm}</option>)}
              </select>
            </Field>
            <Field label="Intake Date" required>
              <input name="intakeDate" type="date" value={form.intakeDate} onChange={handleChange} className={inputCls} title="Intake Date" required />
            </Field>
            <Field label="Discharge Date">
              <input name="dischargeDate" type="date" value={form.dischargeDate} onChange={handleChange} className={inputCls} title="Discharge Date" />
            </Field>
            <Field label="Discharge Reason">
              <input name="dischargeReason" value={form.dischargeReason} onChange={handleChange} className={inputCls} placeholder="If applicable" />
            </Field>
            <Field label="Intake Notes" span>
              <textarea name="intakeNotes" value={form.intakeNotes} onChange={handleChange} rows={4} className={textareaCls} placeholder="Summary of presenting needs, initial observations, and service plan context…" />
            </Field>
          </Section>

          {/* Pets */}
          <Section title="Pets" icon={<PawPrint className="w-4 h-4" />}>
            <Field label="Has Pets?">
              <select name="hasPets" title="Has Pets" value={form.hasPets} onChange={handleChange} className={selectCls}>
                <option value="">Select…</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>
            {form.hasPets === "Yes" && (
              <>
                <Field label="Pet Type">
                  <select name="petType" title="Pet Type" value={form.petType} onChange={handleChange} className={selectCls}>
                    <option value="">Select…</option>
                    <option value="Cat">Cat</option>
                    <option value="Dog">Dog</option>
                  </select>
                </Field>
                <Field label="Number of Pets">
                  <input name="petCount" type="number" min="1" max="20" value={form.petCount} onChange={handleChange} className={inputCls} placeholder="e.g. 1" />
                </Field>
                <Field label="Pet Name">
                  <input name="petName" value={form.petName} onChange={handleChange} className={inputCls} placeholder="e.g. Biscuit" />
                </Field>
                <Field label="Breed">
                  <input name="petBreed" value={form.petBreed} onChange={handleChange} className={inputCls} placeholder="e.g. Labrador Mix" />
                </Field>
                <Field label="Color">
                  <input name="petColor" value={form.petColor} onChange={handleChange} className={inputCls} placeholder="e.g. Black and White" />
                </Field>
                <Field label="Age">
                  <input name="petAge" value={form.petAge} onChange={handleChange} className={inputCls} placeholder="e.g. 3 years" />
                </Field>
                <Field label="Spayed / Neutered?">
                  <select name="petSpayedNeutered" title="Spayed or Neutered" value={form.petSpayedNeutered} onChange={handleChange} className={selectCls}>
                    <option value="">Select…</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </Field>
              </>
            )}
          </Section>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 pb-8">
            <Link href={`/portal/staff/caseload/${slotStr}`} className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition">
              ← Back to Profile
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-teal-500/20 transition text-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving…" : saved ? "Saved!" : "Save Demographics"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
