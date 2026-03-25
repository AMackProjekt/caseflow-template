import Link from "next/link";

export const metadata = { title: "Terms of Use — CaseFlow Command" };

export default function TermsPage() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-teal-400 hover:text-teal-300 text-sm font-semibold mb-10 inline-block transition-colors">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-black text-white mb-2">Terms of Use</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: March 24, 2026 · Effective: March 24, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-base mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using CaseFlow Command (the "Platform") operated by Your Organization ("Org," "we," "us," or "our"), you agree to be bound by these Terms of Use. If you do not agree, you must not access or use the Platform. Your continued use constitutes ongoing acceptance of any updates to these Terms.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. Authorized Users Only</h2>
            <p>This Platform is restricted to individuals who have been granted explicit access by Your Organization. Authorized users include:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Participants (Clients)</strong> — individuals enrolled in Org programs who have been approved for portal access.</li>
              <li><strong className="text-slate-300">Staff</strong> — Org case managers and program staff with valid Org Google Workspace credentials.</li>
              <li><strong className="text-slate-300">Administrators</strong> — Org supervisors on the authorized admin allowlist.</li>
            </ul>
            <p className="mt-3">Unauthorized access, sharing of credentials, or attempting to access accounts or data you are not authorized to view is strictly prohibited and may result in immediate account termination, civil liability, and/or criminal prosecution.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. Protected Health Information (PHI)</h2>
            <p>This Platform processes Protected Health Information as defined under the Health Insurance Portability and Accountability Act of 1996 (HIPAA), 45 CFR Parts 160 and 164. All authorized users who access PHI agree to:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-slate-400">
              <li>Access PHI only as necessary for their authorized role and duties.</li>
              <li>Not disclose PHI to any unauthorized person or system.</li>
              <li>Report any suspected breach of PHI immediately to their supervisor and the organization's compliance officer.</li>
            </ul>
            <p className="mt-3">Unauthorized disclosure of PHI may result in civil penalties up to $1.9 million per violation category per year and criminal penalties up to $250,000 and 10 years imprisonment.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. Audit &amp; Monitoring</h2>
            <p>All user activity on the Platform is logged, monitored, and audited. This includes sign-in events, data access, document uploads/downloads, case note creation, and administrative actions. By using this Platform you expressly consent to this monitoring. Logs may be used in internal investigations, regulatory compliance reviews, and legal proceedings.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Account Security</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You must enable two-factor authentication where required by the Platform. You must immediately notify Org of any unauthorized access to your account. Org is not liable for losses arising from unauthorized access resulting from your failure to protect your credentials.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-slate-400">
              <li>Use the Platform for any purpose other than authorized Org program operations.</li>
              <li>Attempt to reverse-engineer, probe, scan, or test the security of the Platform.</li>
              <li>Introduce malware, bots, or automated scripts without written authorization.</li>
              <li>Share, sell, or transfer your access credentials to any third party.</li>
              <li>Use the Platform to harass, discriminate against, or harm any participant or staff member.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. Intellectual Property</h2>
            <p>CaseFlow Command is developed and maintained by [Your Studio] for Your Organization. All software, design, branding, and content is the intellectual property of Org and/or [Your Studio]. No portion of the Platform may be copied, reproduced, distributed, or used to create derivative works without prior written consent.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">8. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Org and [Your Studio] shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the Platform, even if advised of the possibility of such damages. The Platform is provided "as is" without warranties of any kind.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">9. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of California. Any disputes shall be resolved exclusively in the state or federal courts located in San Diego County, California.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">10. Changes to Terms</h2>
            <p>The Organization reserves the right to update these Terms at any time. Continued use of the Platform following any changes constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">11. Contact</h2>
            <p>For questions regarding these Terms, contact: <a href="mailto:compliance@yourorg.org" className="text-teal-400 hover:underline">compliance@yourorg.org</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-600">
          <Link href="/legal/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          <Link href="/legal/cookies" className="hover:text-slate-400 transition-colors">Cookie Policy</Link>
          <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
          <span className="ml-auto">© {year} Your Organization</span>
        </div>
      </div>
    </div>
  );
}
