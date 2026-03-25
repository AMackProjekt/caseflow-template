"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, MessageSquare, Globe, Zap, BookOpen, Code2, Users } from "lucide-react";
import Link from "next/link";

export default function StaffHelpPage() {
  const router = useRouter();

  const helpTopics = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Getting Started",
      description: "Learn the basics of navigating the staff portal and managing your caseload.",
      link: "#"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Case Documentation",
      description: "Best practices for writing case notes, demographics, and compliance records.",
      link: "#"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Features & Tools",
      description: "Explore all available features including SMART goals, messaging, and calendars.",
      link: "#"
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Integrations",
      description: "Connect with Google Drive, Calendar, OneDrive, and Outlook for productivity.",
      link: "#"
    }
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Help & Support</h1>
          <p className="text-slate-500 mt-1">Find answers and get support using the platform.</p>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search help articles..."
          className="w-full px-6 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
        />
        <Zap className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      {/* Help Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpTopics.map((topic, idx) => (
          <button
            key={idx}
            onClick={() => {}}
            className="p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-teal-300 transition text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition mb-4">
              {topic.icon}
            </div>
            <h3 className="font-bold text-charcoal-900 mb-1">{topic.title}</h3>
            <p className="text-sm text-slate-500">{topic.description}</p>
          </button>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-r from-teal-50 to-indigo-50 rounded-3xl border border-teal-200 p-8">
        <h2 className="text-xl font-bold text-charcoal-900 mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="#"
            className="flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-teal-50 transition border border-slate-100"
          >
            <Globe className="w-5 h-5 text-teal-600" />
            <span className="font-bold text-sm text-charcoal-900">Documentation</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-teal-50 transition border border-slate-100"
          >
            <Mail className="w-5 h-5 text-teal-600" />
            <span className="font-bold text-sm text-charcoal-900">Email Support</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-teal-50 transition border border-slate-100"
          >
            <MessageSquare className="w-5 h-5 text-teal-600" />
            <span className="font-bold text-sm text-charcoal-900">Chat Support</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-teal-50 transition border border-slate-100"
          >
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span className="font-bold text-sm text-charcoal-900">Knowledge Base</span>
          </Link>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-charcoal-900 mb-4">Still need help?</h2>
        <p className="text-slate-600 mb-6">
          Our support team is here to assist you. Reach out with any questions or issues you're experiencing.
        </p>
        <button className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-600/20 active:scale-95">
          Contact Support
        </button>
      </div>
    </div>
  );
}
