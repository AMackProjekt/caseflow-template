"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Phone, Mail, BookOpen, Sparkles, Users, Target } from "lucide-react";
import Link from "next/link";

export default function ClientHelpPage() {
  const router = useRouter();

  const faqItems = [
    {
      q: "How do I set my weekly S.M.A.R.T. goals?",
      a: "Click on 'Milestones' in the navigation, then select 'Weekly S.M.A.R.T. Goal Sheet'. Fill in each S.M.A.R.T. element (Specific, Measurable, Achievable, Relevant, Time-bound) and save. Your case manager will review your goals during your next session."
    },
    {
      q: "How can I communicate with my case manager?",
      a: "Use the Messages section to send messages to your case manager. You can also reach out via email if you prefer. All communications are secure and confidential."
    },
    {
      q: "Can I edit my profile information?",
      a: "Some profile information (name, email) is managed by your case manager. If you need to update your information, please contact your assigned case manager."
    },
    {
      q: "What is two-factor authentication (2FA)?",
      a: "2FA is a security feature that requires you to verify your identity with a code sent to your email when you sign in. This helps keep your account safe and protects your sensitive information."
    }
  ];

  const helpResources = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "User Guide",
      description: "Complete guide to using the participant portal.",
      link: "#"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Milestones Help",
      description: "Learn about tracking your progress toward goals.",
      link: "#"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Case Manager Contact",
      description: "Reach out to your assigned case manager.",
      link: "#"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Getting Started",
      description: "First time using the portal? Start here.",
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
          <p className="text-slate-500 mt-1">Get help using the CaseFlow participant portal.</p>
        </div>
      </div>

      {/* Help Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpResources.map((resource, idx) => (
          <button
            key={idx}
            onClick={() => {}}
            className="p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-teal-300 transition text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition mb-4">
              {resource.icon}
            </div>
            <h3 className="font-bold text-charcoal-900 mb-1">{resource.title}</h3>
            <p className="text-sm text-slate-500">{resource.description}</p>
          </button>
        ))}
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-charcoal-900">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <details key={idx} className="p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition group cursor-pointer open:bg-teal-50 open:border-teal-200">
              <summary className="flex items-center justify-between font-bold text-charcoal-900 list-none">
                {item.q}
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-teal-50 to-indigo-50 rounded-3xl border border-teal-200 p-8">
        <h2 className="text-xl font-bold text-charcoal-900 mb-4">Need More Help?</h2>
        <p className="text-slate-600 mb-6">
          Our support team is available to help. Reach out with any questions or concerns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-teal-50 transition border border-slate-100">
            <MessageSquare className="w-5 h-5 text-teal-600 shrink-0" />
            <span className="font-bold text-sm text-charcoal-900">Send Message</span>
          </button>
          <Link href="#" className="flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-teal-50 transition border border-slate-100">
            <Phone className="w-5 h-5 text-teal-600 shrink-0" />
            <span className="font-bold text-sm text-charcoal-900">Call Support</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-teal-50 transition border border-slate-100">
            <Mail className="w-5 h-5 text-teal-600 shrink-0" />
            <span className="font-bold text-sm text-charcoal-900">Email Us</span>
          </Link>
        </div>
      </div>

      {/* Quick Tip */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex gap-4">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-indigo-900 mb-1">Pro Tip</h3>
          <p className="text-sm text-indigo-800">
            Set reminders for your weekly S.M.A.R.T. goals every Monday morning. Consistency is key to achieving your milestones!
          </p>
        </div>
      </div>
    </div>
  );
}
