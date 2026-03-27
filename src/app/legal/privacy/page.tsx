import Link from "next/link";

export const metadata = { title: "Privacy Policy — CaseFlow Operations" };

export default function PrivacyPage() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-teal-400 hover:text-teal-300 text-sm font-semibold mb-10 inline-block transition-colors">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: March 24, 2026 · Effective: March 24, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-base mb-2">1. Who We Are</h2>
            <p>T.O.O.LS INC ("Org," "we," "us," or "our") operates CaseFlow Operations, a case management platform developed by A MackProjekt. This Privacy Policy explains how we collect, use, store, and protect personal information and Protected Health Information (PHI) in connection with the Platform.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. Information We Collect</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-slate-200 font-semibold mb-1">Account Information</h3>
                <p className="text-slate-400">Name, email address, profile photo, and role — provided at sign-in via Google OAuth.</p>
              </div>
              <div>
                <h3 className="text-slate-200 font-semibold mb-1">Program Data (PHI)</h3>
                <p className="text-slate-400">Case notes, demographics, housing status, employment status, insurance type, goals, and documents you or your case manager submit through the Platform.</p>
              </div>
              <div>
                <h3 className="text-slate-200 font-semibold mb-1">Usage &amp; Audit Data</h3>
                <p className="text-slate-400">IP addresses, session timestamps, pages visited, actions taken, document access, and sign-in events — automatically collected for security and compliance.</p>
              </div>
              <div>
                <h3 className="text-slate-200 font-semibold mb-1">Communications</h3>
                <p className="text-slate-400">Messages sent through the Platform's integrated messaging features are stored and may be reviewed by authorized staff and administrators.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. How We Use Your Information</h2>
            <ul className="ml-5 list-disc space-y-1 text-slate-400">
              <li>To provide case management services and program support.</li>
              <li>To authenticate and authorize access to the Platform.</li>
              <li>To maintain HIPAA compliance, audit trails, and security monitoring.</li>
              <li>To generate anonymized aggregate analytics for program reporting.</li>
              <li>To communicate with you about your account, program status, and access requests.</li>
              <li>To comply with legal obligations and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. HIPAA Compliance</h2>
            <p>The Organization is a covered entity and/or business associate under HIPAA. PHI collected on this Platform is handled in accordance with the HIPAA Privacy Rule (45 CFR Part 164, Subpart E) and the HIPAA Security Rule (45 CFR Part 164, Subparts A and C). We maintain a Business Associate Agreement (BAA) with all third-party services that process PHI on our behalf, including our cloud infrastructure providers.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Data Sharing &amp; Disclosure</h2>
            <p>We do not sell your personal information. We may share data only as follows:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Within the Organization:</strong> Staff and supervisors access client data only as required for their authorized role.</li>
              <li><strong className="text-slate-300">Service Providers:</strong> Vercel (hosting), Convex (database), Vercel KV (session storage), Google (authentication/chat), Resend (email) — all under appropriate data processing agreements.</li>
              <li><strong className="text-slate-300">Legal Requirements:</strong> If required by law, court order, or government authority.</li>
              <li><strong className="text-slate-300">Emergency Situations:</strong> To prevent imminent harm to you or others.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Data Retention</h2>
            <p>We retain personal data and PHI for as long as necessary to fulfill the purposes for which it was collected, comply with legal and regulatory obligations, and resolve disputes. Program data is typically retained for a minimum of 6 years from the date of last service in accordance with HIPAA requirements.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. Security</h2>
            <p>We implement administrative, technical, and physical safeguards to protect your information, including:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-slate-400">
              <li>AES-256 encryption at rest and TLS 1.3 in transit.</li>
              <li>Two-factor authentication enforced for all staff and admin accounts.</li>
              <li>Role-based access controls limiting data access to authorized users.</li>
              <li>Complete audit logging of all data access and modification events.</li>
              <li>Regular security assessments and compliance reviews.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">8. Your Rights</h2>
            <p>Depending on your location and applicable law, you may have the right to:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-slate-400">
              <li>Access, correct, or request deletion of your personal information.</li>
              <li>Request an accounting of disclosures of your PHI (under HIPAA).</li>
              <li>Restrict how your information is used or shared in certain circumstances.</li>
              <li>File a complaint with the U.S. Department of Health &amp; Human Services Office for Civil Rights.</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact: <a href="mailto:privacy@sdtoolsinc.org" className="text-teal-400 hover:underline">privacy@sdtoolsinc.org</a></p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">9. Children's Privacy</h2>
            <p>The Platform is not directed to individuals under 18. We do not knowingly collect personal information from minors without verified parental or guardian consent as required by applicable law.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify authorized users of material changes via the Platform or email. Continued use after the effective date of any changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">11. Contact Us</h2>
            <p>For privacy-related questions or to submit a request:<br />
              <a href="mailto:privacy@sdtoolsinc.org" className="text-teal-400 hover:underline">privacy@sdtoolsinc.org</a><br />
              T.O.O.LS INC · San Diego, California
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-600">
          <Link href="/legal/terms" className="hover:text-slate-400 transition-colors">Terms of Use</Link>
          <Link href="/legal/cookies" className="hover:text-slate-400 transition-colors">Cookie Policy</Link>
          <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
          <span className="ml-auto">© {year} T.O.O.LS INC</span>
        </div>
      </div>
    </div>
  );
}
