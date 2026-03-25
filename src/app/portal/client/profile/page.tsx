"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Badge, Shield, ExternalLink, Upload, X, Loader2, Smartphone, AtSign, Pencil, Check } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function ClientProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ phone: "", personalEmail: "" });

  const profilePhoto = useQuery(api.functions.getProfilePhoto, {
    userEmail: session?.user?.email ?? "",
  });
  const userProfile = useQuery(api.functions.getUserProfile, {
    userEmail: session?.user?.email ?? "",
  });
  const upsertUserProfile = useMutation(api.functions.upsertUserProfile);

  useEffect(() => {
    if (profilePhoto?.photoUrl) setPhotoPreview(profilePhoto.photoUrl);
  }, [profilePhoto]);

  useEffect(() => {
    if (userProfile) {
      setForm({
        phone: userProfile.phone ?? "",
        personalEmail: userProfile.personalEmail ?? "",
      });
    }
  }, [userProfile]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  const initials = (session.user.name ?? "P")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => { setPhotoPreview(event.target?.result as string); };
    reader.readAsDataURL(file);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const response = await fetch("/api/profile-photo", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to upload photo");
    } catch (error) {
      console.error("Upload error:", error);
      setPhotoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!confirm("Are you sure you want to delete your profile photo?")) return;
    setIsUploading(true);
    try {
      const response = await fetch("/api/profile-photo", { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete photo");
      setPhotoPreview(null);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await upsertUserProfile({
        userEmail: session.user.email!,
        phone: form.phone || undefined,
        personalEmail: form.personalEmail || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          title="Go back"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Your Profile</h1>
          <p className="text-slate-500 mt-1">View and manage your account information.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-teal-400 to-indigo-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -mr-20 -mt-20"></div>
          </div>
        </div>

        <div className="px-6 md:px-8 pb-8">
          {/* Avatar & Name */}
          <div className="flex flex-col md:flex-row md:items-end md:gap-6 -mt-16 mb-8 relative z-10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt={session.user.name ?? "User"} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 p-2 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Upload photo"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                className="hidden"
                aria-label="Upload profile photo"
              />
            </div>
            <div className="mt-4 md:mt-0">
              <h2 className="text-2xl font-bold text-charcoal-900">{session.user.name ?? "Participant"}</h2>
              <p className="text-teal-600 font-bold uppercase tracking-tight text-sm mt-1">My Account</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Email</p>
              </div>
              <p className="text-sm font-bold text-charcoal-900">{session.user.email}</p>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Status</p>
              </div>
              <p className="text-sm font-bold text-teal-900">Active & Verified</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="w-4 h-4 text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Program Role</p>
              </div>
              <p className="text-sm font-bold text-charcoal-900">Participant</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-charcoal-900">Contact Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-teal-600 border border-teal-200 bg-teal-50 rounded-xl hover:bg-teal-100 transition"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setIsEditing(false); if (userProfile) setForm({ phone: userProfile.phone ?? "", personalEmail: userProfile.personalEmail ?? "" }); }}
                    className="px-3 py-1.5 text-sm font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone Number</p>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full text-sm font-bold text-charcoal-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                ) : (
                  <p className="text-sm font-bold text-charcoal-900">{form.phone || <span className="text-slate-400 font-normal italic">Not set</span>}</p>
                )}
              </div>

              {/* Personal Email */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <AtSign className="w-4 h-4 text-slate-400" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recovery Email</p>
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={form.personalEmail}
                    onChange={(e) => setForm({ ...form, personalEmail: e.target.value })}
                    placeholder="backup@email.com"
                    className="w-full text-sm font-bold text-charcoal-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                ) : (
                  <p className="text-sm font-bold text-charcoal-900">{form.personalEmail || <span className="text-slate-400 font-normal italic">Not set</span>}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
            <Link
              href="/portal/client/goals"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100"
            >
              <span className="font-bold text-charcoal-900">View Your Milestones</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </Link>
            {photoPreview && (
              <button
                onClick={handleDeletePhoto}
                disabled={isUploading}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-50 hover:bg-rose-100 transition border border-rose-100 text-left font-bold text-rose-600 disabled:opacity-50"
              >
                {isUploading ? (
                  <><span>Deleting photo...</span><Loader2 className="w-4 h-4 animate-spin" /></>
                ) : (
                  <><span>Delete Profile Photo</span><X className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Shield className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
          <div>
            <h3 className="font-bold text-indigo-900 mb-1">Your Account Security</h3>
            <p className="text-sm text-indigo-800">
              Your account is protected by two-factor authentication. Add a recovery email so you can verify your identity if you ever lose access to your account email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

