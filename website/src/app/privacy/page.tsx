import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Syna Systems",
  description: "Learn how Syna Systems protects client data, masked PHI/PII ingestion, and HIPAA data compliance boundaries.",
};

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-48 pb-24">
      <div className="max-w-4xl mx-auto px-6 w-full prose prose-invert">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white mb-10">
          Privacy <span className="glow-text-indigo">Policy.</span>
        </h1>
        <p className="text-slate-400 font-light text-sm leading-relaxed mb-8">
          Last Updated: June 28, 2026
        </p>

        <section className="space-y-6 text-sm text-slate-400 font-light leading-relaxed">
          <h2 className="text-2xl font-bold text-white mt-10">1. Data Sovereignty & Protection</h2>
          <p>
            At Syna Systems, we implement security-by-design principles across all intelligent agent runtimes.
            All client integrations operate inside client-owned virtual private clouds (VPC). We do not collect,
            aggregate, or lease proprietary enterprise data, clinical records, or client database transactions.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10">2. PII / PHI Masking Gateways</h2>
          <p>
            For healthcare integrations involving Revenue Cycle Management (RCM), all patient logs and clinical notes
            are processed through a zero-trust Sanitization Gateway prior to AI reasoning. All protected health
            information (PHI) is cryptographically masked, redacting SSNs, names, and DOBs at the local boundary.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10">3. Model Context Protocol Boundaries</h2>
          <p>
            Our Model Context Protocol (MCP) bridges enforce read-only scopes. Large Language Models (LLMs) executing
            under our runtime stack cannot alter production data without explicit Human-in-the-Loop (HITL) clearance.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10">4. Policy Changes & Contact</h2>
          <p>
            We regularly update our privacy parameters to maintain alignment with HIPAA, SOC2 Type II, and regional
            data sovereignty regulations. For compliance inquiries, contact security@syna.systems.
          </p>
        </section>
      </div>
    </main>
  );
}

