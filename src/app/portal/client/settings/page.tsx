"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Shield, Sun, Moon, Monitor, Save, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ClientSettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          title="Go back"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Settings</h1>
          <p className="text-slate-500 mt-1">Customize your preferences and notification settings.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* THEME SELECTION */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 flex items-center justify-center rounded-lg text-indigo-600">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-charcoal-900">Visual Appearance</h2>
              <p className="text-sm text-slate-500 font-medium">Choose your preferred theme.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Glass Mode */}
            <button
              onClick={() => setTheme('glass')}
              className={`p-6 rounded-2xl border-2 transition flex flex-col items-center gap-4 group ${theme === 'glass' ? 'bg-indigo-50 border-indigo-600 ring-4 ring-indigo-600/5' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${theme === 'glass' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                <Monitor className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className={`font-bold text-sm ${theme === 'glass' ? 'text-indigo-950' : 'text-slate-600'}`}>Glass</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Default</p>
              </div>
            </button>

            {/* Dark Mode */}
            <button
              onClick={() => setTheme('dark')}
              className={`p-6 rounded-2xl border-2 transition flex flex-col items-center gap-4 group ${theme === 'dark' ? 'bg-charcoal-900 border-teal-500 ring-4 ring-teal-500/5' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${theme === 'dark' ? 'bg-teal-500 text-white' : 'bg-white text-slate-400'}`}>
                <Moon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-teal-400' : 'text-slate-600'}`}>Dark</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Night</p>
              </div>
            </button>

            {/* Light Mode */}
            <button
              onClick={() => setTheme('light')}
              className={`p-6 rounded-2xl border-2 transition flex flex-col items-center gap-4 group ${theme === 'light' ? 'bg-amber-50 border-amber-600 ring-4 ring-amber-600/5' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${theme === 'light' ? 'bg-amber-600 text-white' : 'bg-white text-slate-400'}`}>
                <Sun className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className={`font-bold text-sm ${theme === 'light' ? 'text-amber-950' : 'text-slate-600'}`}>Light</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Daylight</p>
              </div>
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-rose-50 border border-rose-100 flex items-center justify-center rounded-lg text-rose-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-charcoal-900">Notifications</h2>
              <p className="text-sm text-slate-500 font-medium">Manage how you receive updates.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded accent-teal-600"
              />
              <div>
                <p className="font-bold text-charcoal-900 text-sm">Email Notifications</p>
                <p className="text-xs text-slate-500">Get updates via email about your milestones and messages.</p>
              </div>
            </label>
          </div>
        </div>

        {/* SECURITY */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
            <div>
              <h3 className="font-bold text-indigo-900 mb-1">Account Security</h3>
              <p className="text-sm text-indigo-800">
                Your account is protected with two-factor authentication. This provides an extra layer of security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all border border-slate-200 text-charcoal-900 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${savedStatus ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20 active:scale-95'}`}
        >
          {savedStatus ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
