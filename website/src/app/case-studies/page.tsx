import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import { LineChart, Zap, Target, FileText, Lock, Globe2, ChevronRight, BarChart, FileCode2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies | Syna Systems Operational ROI",
  description: "Detailed performance reports on enterprise AI implementation. High-precision agentic workflows in Logistics, Recruitment, and SaaS.",
};

export default function CaseStudies() {
  const cases = [
    {
      sector: "Healthcare RCM",
      title: "Predictive Denial Management (Project BIO-GUARD)",
      outcome: "12% Clean Claim Boost",
      metric: "$8.4M Recovered",
      icon: <Target className="text-emerald-500" />,
      challenge: "A multi-state hospital system was losing $14M annually to 'Medical Necessity' denials due to clinical documentation lag and complex payer rules.",
      solution: "Deployed a Stateful Clinical Auditor using LangGraph with a Zero-Trust PII gateway. The system cross-references physician notes against 200+ Payer policies in real-time, routing high-risk claims for human review.",
      id: "healthcare-01"
    },
    {
      sector: "Logistics & Global Trade",
      title: "Automating Carrier Documentation for a Global Freight Forwarder",
      outcome: "92.4% Accuracy",
      metric: "$1.2M Annual Savings",
      icon: <LineChart className="text-cyan-500" />,
      challenge: "The client was manually processing 10,000+ invoices monthly, leading to significant billing errors and customs delays.",
      solution: "Implemented a multi-agent Supervisor-Worker system using LangGraph. Agent A (Extraction) parses unstructured invoices. Agent B (Validation) checks against trade policies. Agent C (Audit) flags discrepancies.",
      id: "logistics-01"
    },
    {
      sector: "Recruitment & Staffing",
      title: "Eliminating Candidate Screening Latency for a Global Staffing Firm",
      outcome: "4 Min Avg. Triage",
      metric: "75% Admin Reduction",
      icon: <Target className="text-indigo-500" />,
      challenge: "High-volume technical recruitment required 40+ hours of manual LinkedIn research and screening per week per recruiter.",
      solution: "Developed an autonomous Talent Research Agent that enriches candidate profiles via public signals and generates technical audits before recruiter review.",
      id: "recruitment-01"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center bg-[#020617] text-slate-200 grid-bg">
        
        {/* SECTION 1: HERO */}
        <section className="relative w-full flex flex-col items-center justify-center px-6 pt-48 pb-32 text-center overflow-hidden">
          <div className="z-10 mb-8 rounded-full border border-slate-800 bg-slate-900/50 w-fit px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
             Impact Records
          </div>
          <h1 className="z-10 text-5xl md:text-9xl font-black tracking-tighter text-white mb-10 leading-[0.9]">
             Performance <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-700">Records.</span>
          </h1>
          <p className="z-10 text-xl text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
             Production-grade outcomes for the high-volume enterprise.
          </p>
        </section>

        {/* SECTION 2-3: THE CASES (DETAILED) */}
        {cases.map((c, i) => (
          <section key={i} className={`w-full py-32 px-8 border-b border-slate-900 ${i % 2 === 0 ? "bg-[#030712]/60" : "bg-transparent"}`}>
             <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
                <div>
                   <div className="flex items-center gap-6 mb-12">
                      <div className="h-14 w-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                         {c.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">{c.sector}</p>
                        <h2 className="text-3xl font-bold text-white">{c.title}</h2>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-10 mb-16 border-l border-slate-800 pl-10">
                      <div>
                         <p className="text-4xl font-black text-white tracking-tighter">{c.outcome}</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mt-2">Verified Outcome</p>
                      </div>
                      <div>
                         <p className="text-4xl font-black text-white tracking-tighter">{c.metric}</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mt-2">Measured ROI</p>
                      </div>
                   </div>

                   <p className="text-[10px] text-slate-600 font-mono mb-8 uppercase tracking-widest leading-relaxed italic">
                      *Client identity protected under strict multi-year NDA. Reference checks available upon technical alignment.
                   </p>
                </div>

                <div className="space-y-12">
                   <div className="p-10 rounded-3xl bg-black/40 border border-slate-900 shadow-2xl">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-3">
                         <FileText size={14} /> The Challenge
                      </h4>
                      <p className="text-slate-400 font-light leading-relaxed">{c.challenge}</p>
                   </div>
                   <div className="p-10 rounded-3xl bg-indigo-500/5 border border-indigo-500/20">
                      <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-3">
                         <Zap size={14} /> The Syna Implementation
                      </h4>
                      <p className="text-slate-300 font-light leading-relaxed">{c.solution}</p>
                   </div>
                   <div className="flex gap-8 mt-12 items-center">
                        <Link href="/audit" className="inline-block text-sm font-bold text-white border-b border-neutral-800 pb-1 hover:border-white transition-all">
                          Analyze a similar workflow →
                        </Link>
                        <Link href="https://github.com/shivambathvar001/syna-systems-registry" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-cyan-500/50 hover:text-cyan-400 transition-colors flex items-center gap-2">
                           <FileCode2 size={14} /> View Graph Source
                        </Link>
                   </div>
                </div>
             </div>
          </section>
        ))}

        {/* SECTION 4: SECURITY PROTOCOL SECTION */}
        <section className="w-full py-48 px-8 border-b border-slate-900">
           <div className="mx-auto max-w-7xl text-center">
              <Lock className="mx-auto text-slate-700 mb-12" size={48} />
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-8 leading-tight">Data <br />Sovereignty.</h2>
              <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto mb-20 leading-relaxed">
                 We deploy case-specific VPCs and local-first execution runtimes to ensure our implementations never compromise your underlying data security.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                 {["Isolated Execution", "End-to-End Encryption", "Cryptographic Logging"].map((item, i) => (
                   <div key={i} className="p-10 rounded-3xl border border-slate-900 bg-[#020617]">
                      <h4 className="text-lg font-bold text-white mb-4">{item}</h4>
                      <div className="h-[2px] w-8 bg-cyan-500 mb-6"></div>
                      <p className="text-sm text-slate-500 font-light leading-relaxed">Production standard for all high-volume enterprise deployments in 2026.</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* SECTION 5: GLOBAL FOOTPRINT VISUAL */}
        <section className="w-full py-48 px-8 bg-black relative">
           <div className="absolute inset-0 grid-bg opacity-10"></div>
           <div className="mx-auto max-w-7xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div>
                 <Globe2 className="text-cyan-500 mb-10" size={50} />
                 <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white mb-8">Global <br />Fulfillment.</h2>
                 <p className="text-lg text-slate-400 font-light leading-relaxed">
                    We maintain operational nodes in London, Singapore, and San Francisco, providing 24/7 technical monitoring for international trade and logistics partners.
                 </p>
              </div>
              <div className="rounded-3xl border border-slate-800 p-12 bg-[#020617]/80 backdrop-blur-md">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-10">Operations Monitored</h4>
                 <div className="space-y-8">
                    {[
                      { l: "London_HUB", v: "14.2k ops/hr" },
                      { l: "Singapore_NODE", v: "8.9k ops/hr" },
                      { l: "SFO_EDGE", v: "22.1k ops/hr" }
                    ].map((hub, i) => (
                      <div key={i} className="flex justify-between items-end border-b border-slate-900 pb-4">
                         <span className="text-xs font-mono text-slate-400">{hub.l}</span>
                         <span className="text-xl font-black text-cyan-400 font-mono tracking-tighter">{hub.v}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION 6: THE CALL TO AUDIT */}
        <section className="w-full py-64 px-8 text-center bg-white text-black relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-black text-neutral-100 -z-0">ROI</div>
           <div className="relative z-10">
              <h2 className="text-5xl md:text-9xl font-black tracking-tighter mb-16 leading-[0.8] uppercase">Scale <br />With <br />Precision.</h2>
              <Link href="/audit" className="inline-block px-16 py-7 bg-black text-white text-xs font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-2xl">
                 Initiate Architecture Audit
              </Link>
           </div>
        </section>

      </main>
    </>
  );
}
