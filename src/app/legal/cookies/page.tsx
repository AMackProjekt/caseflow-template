import Link from "next/link";

export const metadata = { title: "Cookie Policy — CaseFlow Command" };

export default function CookiesPage() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-teal-400 hover:text-teal-300 text-sm font-semibold mb-10 inline-block transition-colors">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-black text-white mb-2">Cookie Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: March 24, 2026 · Effective: March 24, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-bold text-base mb-2">1. What Are Cookies</h2>
            <p>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, remember your preferences, and provide security. CaseFlow Command uses cookies and similar technologies to operate securely and deliver a consistent experience.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. Cookies We Use</h2>
            <div className="space-y-5">

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-teal-950 border border-teal-800 text-teal-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Strictly Necessary</span>
                </div>
                <p className="text-slate-400 mb-3">These cookies are essential for the Platform to function. The Platform cannot operate without them and they cannot be disabled.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-500 text-left border-b border-slate-800">
                        <th className="pb-2 pr-4 font-semibold">Cookie</th>
                        <th className="pb-2 pr-4 font-semibold">Purpose</th>
                        <th className="pb-2 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-400 space-y-1">
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2 pr-4 font-mono text-slate-300">next-auth.session-token</td>
                        <td className="py-2 pr-4">Maintains your authenticated session</td>
                        <td className="py-2">Session / 30 days</td>
                      </tr>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2 pr-4 font-mono text-slate-300">next-auth.csrf-token</td>
                        <td className="py-2 pr-4">Prevents cross-site request forgery attacks</td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2 pr-4 font-mono text-slate-300">next-auth.callback-url</td>
                        <td className="py-2 pr-4">Remembers where to redirect after sign-in</td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono text-slate-300">__Secure-next-auth.*</td>
                        <td className="py-2 pr-4">Secure variants of session cookies (HTTPS only)</td>
                        <td className="py-2">Session / 30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-amber-950 border border-amber-800 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Functional</span>
                </div>
                <p className="text-slate-400 mb-3">These are stored in your browser's <code className="text-slate-300 bg-slate-800 px-1 rounded">localStorage</code> (not cookies) to remember your preferences within a session.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-500 text-left border-b border-slate-800">
                        <th className="pb-2 pr-4 font-semibold">Key</th>
                        <th className="pb-2 pr-4 font-semibold">Purpose</th>
                        <th className="pb-2 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-400">
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2 pr-4 font-mono text-slate-300">caseflow_staff_onboarded</td>
                        <td className="py-2 pr-4">Remembers if onboarding tour has been completed (staff)</td>
                        <td className="py-2">Persistent</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono text-slate-300">caseflow_client_onboarded</td>
                        <td className="py-2 pr-4">Remembers if onboarding tour has been completed (client)</td>
                        <td className="py-2">Persistent</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-blue-950 border border-blue-800 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Analytics</span>
                </div>
                <p className="text-slate-400">The Platform uses <strong className="text-slate-300">Vercel Analytics</strong> to collect anonymized, aggregated performance and usage data. No personally identifiable information is collected. These analytics help us improve platform performance and reliability.</p>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. Third-Party Cookies</h2>
            <p>Third-party services integrated with the Platform may set their own cookies. These include:</p>
            <ul className="mt-2 ml-5 list-disc space-y-2 text-slate-400">
              <li><strong className="text-slate-300">Google OAuth:</strong> Sets cookies to manage your Google authentication state. Governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Google's Privacy Policy</a>.</li>
              <li><strong className="text-slate-300">Vercel:</strong> Infrastructure cookies for routing and edge functions. Governed by <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Vercel's Privacy Policy</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. PWA &amp; Service Worker Storage</h2>
            <p>If you install the Participant Portal as a Progressive Web App (PWA), the Platform stores cached page data in your browser's Cache Storage to enable offline access. This data includes page HTML, static assets, and previously loaded data. It is stored locally on your device and is not transmitted to any third party. You can clear this data through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Managing Cookies</h2>
            <p>You can control and delete cookies through your browser settings. Please note that disabling strictly necessary cookies will prevent you from signing in and using the Platform. Browser-specific cookie management instructions:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1 text-slate-400">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Microsoft Edge</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Consent</h2>
            <p>By using CaseFlow Command, you consent to the placement of strictly necessary cookies as described in this policy. These cannot be opted out of as they are required for the Platform to function securely. For functional and analytics data, you may clear your localStorage and browser cache at any time through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. Changes to This Policy</h2>
            <p>We may update this Cookie Policy from time to time. The "Last updated" date at the top of this page reflects when the policy was last revised. Continued use of the Platform after changes take effect constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">8. Contact</h2>
            <p>For questions about our use of cookies: <a href="mailto:privacy@yourorg.org" className="text-teal-400 hover:underline">privacy@yourorg.org</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-600">
          <Link href="/legal/terms" className="hover:text-slate-400 transition-colors">Terms of Use</Link>
          <Link href="/legal/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
          <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
          <span className="ml-auto">© {year} Your Organization</span>
        </div>
      </div>
    </div>
  );
}
