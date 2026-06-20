import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import { 
  ShieldCheck, 
  Workflow, 
  Database, 
  Lock, 
  FileText, 
  Zap, 
  ArrowRight, 
  FileCode2, 
  Globe2, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Fingerprint
} from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies | Syna Systems Operational ROI",
  description: "Detailed performance reports on enterprise AI implementation. High-precision agentic workflows in Logistics, Healthcare RCM, Recruitment, and Finance.",
};

export default function CaseStudies() {
  const cases = [
    {
      sector: "Healthcare Revenue Cycle Management (RCM)",
      title: "Predictive Denial Management (Project BIO-GUARD)",
      outcome: "12% Clean Claim Boost",
      metric: "$8.4M Recovered",
      icon: <ShieldCheck className="text-emerald-400" size={24} />,
      challenge: "A multi-state hospital system was losing $14M annually to \"Medical Necessity\" denials due to clinical documentation lag and complex payer rules.",
      architecture: [
        { label: "The Sanity Gateway", desc: "Implemented a Zero-Trust PII masking layer that redacts sensitive patient data before it reaches the orchestration layer." },
        { label: "Stateful Clinical Auditor", desc: "A LangGraph-based workflow that cross-references physician notes against 200+ Payer-specific Local Coverage Determinations (LCD)." },
        { label: "Predictive Routing", desc: "Integrated a high-precision risk engine that identifies \"denial-prone\" claims with 92% accuracy, routing them for senior human correction before submission." }
      ],
      result: "12% increase in first-pass clean claims; $8.4M in recovered revenue within 6 months.",
      id: "bio-guard"
    },
    {
      sector: "International Freight & Logistics",
      title: "Carrier Invoice Reconciliation Mesh (Project IRON-LOGIC)",
      outcome: "4 Min Latency",
      metric: "90% Error Reduction",
      icon: <Workflow className="text-cyan-400" size={24} />,
      challenge: "A global logistics firm faced a 4.2-hour latency in carrier invoice reconciliation, leading to massive billing discrepancies and manual backlog.",
      architecture: [
        { label: "Supervisor-Worker Mesh", desc: "Deployed a hierarchical multi-agent system where a \"Supervisor Agent\" governs specialized \"Extractor Agents\" to ensure 99.9% data accuracy." },
        { label: "Self-Healing Resolution", desc: "The system autonomously flags discrepancies and initiates secure MCP (Model Context Protocol) bridges to carrier portals for real-time verification." },
        { label: "Immutable Audit Ledger", desc: "Every agentic decision was logged into a forensic-grade ledger for SOC2 compliance and instant auditing." }
      ],
      result: "Latency reduced from 4.2 hours to 4 minutes; 90% reduction in billing errors.",
      id: "iron-logic"
    },
    {
      sector: "High-Growth Executive Recruitment",
      title: "Signal-Based Candidate Enrichment (Project TALENT-GRAPH)",
      outcome: "70% Faster Triage",
      metric: "4.2x Recruiter Efficiency",
      icon: <Fingerprint className="text-indigo-400" size={24} />,
      challenge: "A top-tier recruitment firm was losing elite technical talent due to a 72-hour manual triage bottleneck and research overhead.",
      architecture: [
        { label: "Signal-Based Enrichment", desc: "Agents autonomously monitor hiring signals across 5+ platforms (GitHub, LinkedIn, StackOverflow) to build a \"Technical Talent Graph.\"" },
        { label: "Autonomous Technical Audit", desc: "A \"Critique Agent\" performs deep-dive code reviews and technical suitability scoring (Sanitized for privacy)." },
        { label: "The HITL Interface", desc: "A custom Command Interface that allows human recruiters to oversee and override agentic rankings in real-time." }
      ],
      result: "Triage time reduced by 70%; 4.2x recruiter efficiency gain; zero \"leakage\" of top-tier talent.",
      id: "talent-graph"
    },
    {
      sector: "Enterprise Data Governance (Financial Services)",
      title: "Zero-Trust LLM Market Data Bridge (Project ZERO-BRIDGE)",
      outcome: "100% Data Sovereignty",
      metric: "Zero Credential Leakage",
      icon: <Lock className="text-purple-400" size={24} />,
      challenge: "A financial services MNC needed to bridge LLMs to proprietary market data without exposing raw database credentials or PII/PHI.",
      architecture: [
        { label: "The Zero-Trust Bridge", desc: "Custom MCP server acting as a \"Secure Proxy\" between the LLM and the Internal Data Lake." },
        { label: "Operational Metric Shield", desc: "The server only exposes aggregated, non-sensitive metrics required for the AI's reasoning, effectively \"air-gapping\" the core data." },
        { label: "Permissioned Tool-Calling", desc: "Restricted agent capabilities to a \"White-List\" of read-only operations with strict schema mapping." }
      ],
      result: "Enabled autonomous market analysis for the investment team while maintaining 100% data sovereignty.",
      id: "zero-bridge"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-20">
        
        {/* HERO SECTION */}
        <section className="relative w-full flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-indigo-500/5 blur-[120px] -z-10 animate-pulse"></div>
          
          <div className="z-10 mb-6 rounded-full border border-slate-800 bg-slate-900/50 w-fit px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
             Declassified Portfolios
          </div>
          
          <h1 className="z-10 text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-none">
             Architectural <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">Credibility.</span>
          </h1>
          
          <p className="z-10 text-base md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
             Sanitized production architecture logs from our most complex enterprise deployments. Proven outcomes over promises.
          </p>
        </section>

        {/* CASE STUDIES CARDS CONTAINER */}
        <section className="w-full max-w-7xl mx-auto px-6 space-y-24 mb-32">
          {cases.map((c, i) => (
            <div 
              key={c.id} 
              className="glass-panel rounded-3xl border border-slate-850 bg-[#030712]/60 p-8 sm:p-12 relative overflow-hidden shadow-2xl transition-all duration-350 hover:border-slate-800"
            >
              <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-bl from-indigo-500/5 to-transparent blur-3xl -z-10"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Info Block */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/40 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {c.icon}
                      {c.sector}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mt-3">
                      {c.title}
                    </h2>
                  </div>

                  {/* Highlight Metrics */}
                  <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-black/40 border border-slate-900">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Measured Outcome</div>
                      <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono tracking-tighter">{c.outcome}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Verified ROI</div>
                      <div className="text-xl sm:text-2xl font-black text-indigo-400 font-mono tracking-tighter">{c.metric}</div>
                    </div>
                  </div>

                  {/* Challenge Text */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <FileText size={12} className="text-cyan-400" />
                      The Challenge
                    </h4>
                    <p className="text-sm text-slate-400 font-light leading-relaxed">
                      {c.challenge}
                    </p>
                  </div>

                  <p className="text-[9px] text-slate-600 font-mono tracking-widest uppercase italic">
                    *Client sovereignty protected under strict multi-year NDA. Reference checks available upon technical alignment.
                  </p>
                </div>

                {/* Architecture / Implementation details */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="p-6 sm:p-8 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2.5">
                      <Zap size={14} />
                      Declassified Architecture
                    </h4>
                    
                    <div className="space-y-6">
                      {c.architecture.map((arch, ai) => (
                        <div key={ai} className="flex gap-4 items-start">
                          <span className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-950/40 border border-cyan-900/50 rounded px-1.5 py-0.5 mt-0.5">
                            0{ai + 1}
                          </span>
                          <div>
                            <h5 className="text-sm font-bold text-white mb-1">{arch.label}</h5>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">{arch.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verified outcome section */}
                  <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-550/15">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-2">
                      <TrendingUp size={12} />
                      Verified Outcomes
                    </h4>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {c.result}
                    </p>
                  </div>

                  {/* Bottom Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 items-center pt-2">
                    <Link 
                      href="/pilot" 
                      className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-cyan-400 transition-colors"
                    >
                      Audit a similar architecture
                      <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      href="https://github.com/shivambathvar001/syna-systems-registry" 
                      target="_blank" 
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <FileCode2 size={12} />
                      View Core Templates
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </section>

        {/* SECURITY ARCHITECTURE BANNER */}
        <section className="w-full py-24 border-y border-slate-900 bg-[#030712]/40 mb-24 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <Lock className="mx-auto text-cyan-400 mb-6" size={36} />
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Cryptographically Sandboxed Deployments
            </h2>
            <p className="max-w-xl mx-auto text-sm text-slate-500 font-light leading-relaxed mb-12">
              Every deployment operates within client-governed VPCs. LLMs run under rigid context parameters with edge-based PHI/PII scrubbers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
              {[
                { title: "Isolated Runtimes", desc: "No training pools or external logging loops." },
                { title: "Deterministic Pipelines", desc: "LangGraph workflows with zero drift." },
                { title: "PII Shield Ingestion", desc: "Cryptographic masking of all data inputs." }
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-900 bg-[#020617] space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE FINAL CTAs */}
        <section className="w-full text-center max-w-4xl mx-auto px-6 mb-16">
          <h2 className="text-4xl sm:text-7xl font-black tracking-tighter text-white mb-8">
            Deploy in <span className="text-cyan-400 glow-text-cyan">14 Days.</span>
          </h2>
          <p className="text-slate-400 font-light max-w-xl mx-auto mb-12 leading-relaxed">
            Proof through execution. Initiate your Pilot slots now to deploy one stateful, self-healing backbone.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/pilot" 
              className="rounded-full bg-white px-10 py-5 text-xs font-black uppercase tracking-widest text-black hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300"
            >
              Begin Velocity Intake
            </Link>
            <Link 
              href="/solutions" 
              className="rounded-full border border-slate-800 bg-slate-900/30 px-10 py-5 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all duration-300"
            >
              Explore Tech Practices
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
