import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions - Gilang Store",
  description: "Terms and Conditions of Service for Gilang Store.",
};

export default function TermsPage() {
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
              Terms & Conditions
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Effective Date: August 2026 · Last Updated: August 2026
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              By accessing, browsing, or downloading applications from Gilang Store, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue using our services immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Software Usage & License</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              All software, mobile applications, web frameworks, and digital assets distributed on Gilang Store are provided under specific license agreements. You are granted a limited, non-exclusive, non-transferable license to download and install applications for personal or internal business use.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 pl-2">
              <li>You may not reverse engineer, decompile, or disassemble any binary software provided.</li>
              <li>Re-distributing application packages without prior written consent from Gilang Store is prohibited.</li>
              <li>In-app purchases and features remain subject to developer terms.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Custom Application Development</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Requests submitted via the &quot;Contact Custom App&quot; service are handled directly by the Gilang Store engineering team. Scope, deliverables, pricing, and timelines for custom software builds will be finalized under a separate custom development agreement.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Intellectual Property</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              All branding, logos, graphics, visual elements, and storefront software code are the intellectual property of Gilang Store and its authorized creators.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Gilang Store provides all digital products &quot;as-is&quot; without warranties of any kind. Under no circumstances shall Gilang Store be liable for any direct, indirect, or incidental damages resulting from application usage.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-bold text-slate-900">6. Contact & Support</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you have any questions regarding these Terms & Conditions, please contact our customer service center at <span className="font-semibold text-slate-800">0800-112-8888</span> or reach out via official channels.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
