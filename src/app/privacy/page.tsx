import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Gilang Store",
  description: "Privacy Policy and Data Protection guidelines for Gilang Store.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo1.png" alt="Gilang Store Logo" className="h-7 object-contain" />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm space-y-8">
          {/* Header Title */}
          <div className="border-b border-slate-100 pb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Effective Date: August 2026 · Last Updated: August 2026
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At Gilang Store, your privacy is our top priority. We only collect essential information required to deliver application downloads and custom development services:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-2">
              <li><strong className="text-slate-800">Download Telemetry:</strong> Anonymous aggregate metrics (such as download counts) to track app popularity.</li>
              <li><strong className="text-slate-800">Inquiry Data:</strong> Information provided when contacting us for custom app development.</li>
              <li><strong className="text-slate-800">Technical Logs:</strong> Standard web server connection data for security auditing.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. How We Use Your Data</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We process information solely to maintain, improve, and secure Gilang Store services:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-2">
              <li>Facilitating application package downloads.</li>
              <li>Responding to custom software build requests.</li>
              <li>Preventing unauthorized activity or system abuse.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Data Sharing & Third Parties</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We do not sell, rent, or trade your personal information to third-party advertisers. Data is shared strictly when necessary with infrastructure providers (such as database services and cloud hosts) bound by strict confidentiality terms.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Data Security</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We implement industry-standard encryption, secure HTTP protocols (HTTPS/SSL), and Row-Level Security (RLS) models to protect data integrity against unauthorized access.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-bold text-slate-900">5. Contact Us</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you have any privacy inquiries or wish to request data updates, please contact our support team at <span className="font-semibold text-slate-800">0800-112-8888</span>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
