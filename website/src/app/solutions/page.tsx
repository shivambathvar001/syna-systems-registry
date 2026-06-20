import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import { Cpu, Terminal, ShieldAlert, Workflow, Database, RefreshCw, BarChart4, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Practices | Syna Systems Architecture & Engineering",
  description: "Specialized engineering practices for the autonomous enterprise. Intelligent Document Processing, Revenue Operations, and Zero-Trust Governance.",
};

export default function Solutions() {
  const practices = [
    {
      title: "Intelligent Document Processing (IDP)",
      sector: "Logistics, Legal, Finance",
      focus: "Converting unstructured human communication into structured, validated data streams.",
      icon: <Database size={32} />,
      capabilities: [
        "Multi-modal extraction (OCR + LLM critique)",
        "Automated trade policy cross-referencing",
        "Deterministic JSON schema validation",
        "HITL exception routing via secure UI"
      ]
    },
    {
      title: "Autonomous Revenue Operations",
      sector: "B2B SaaS, Managed Services",
      focus: "Automating the lead-to-close technical research and outreach pipeline.",
      icon: <Workflow size={32} />,
      capabilities: [
        "Real-time intent signal monitoring",
        "Hyper-personalized technical assessments",
        "CRM-synced lead enrichment & scoring",
        "Automated technical qualification loops"
      ]
    },
    {
      title: "Zero-Trust AI Governance",
      sector: "Enterprise IT, Healthcare, Cybersecurity",
      icon: <ShieldAlert size={32} />,
      focus: "Building the secure runtime environment where agents can safely interact with core systems.",
      capabilities: [
        "Model Context Protocol (MCP) servers",
        "Dynamic PII/PHI scrubbing pipelines",
        "Granular token-based permission scoping",
        "Cryptographic audit trail logging"
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center bg-[#020617] text-slate-200 grid-bg">
        
        {/* SECTION 1: HERO */}
        <section className="relative w-full flex flex-col items-center justify-center px-6 pt-48 pb-32 text-center overflow-hidden">
          <div className="absolute top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
          <div className="z-10 mb-8 rounded-full border border-slate-800 bg-slate-900/50 w-fit px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
            Enterprise Capabilities
          </div>
          <h1 className="z-10 text-5xl md:text-9xl font-black tracking-tighter text-white mb-10 leading-[0.9]">
            Engineering <br /><span className="glow-text-indigo">Practices.</span>
          </h1>
          <p className="z-10 text-xl text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
            Syna Systems deploys mission-critical infrastructure across three core technical domains.
          </p>
        </section>

        {/* SECTION 2-4: THE PRACTICES (3 SECTIONS) */}
        {practices.map((p, i) => (
          <section key={i} className={`w-full py-32 px-8 border-b border-slate-900 ${i % 2 === 0 ? "bg-[#030712]/40" : "bg-transparent"}`}>
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div className={i % 2 !== 0 ? "md:order-last" : ""}>
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-10 border border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.1)]">
                   {p.icon}
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-4">{p.sector}</p>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">{p.title}</h2>
                <p className="text-lg text-slate-400 font-light leading-relaxed mb-12">{p.focus}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                   {p.capabilities.map((cap, ci) => (
                     <div key={ci} className="flex items-center gap-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
                       <div className="h-1 w-1 bg-indigo-500 rounded-full"></div>
                       {cap}
                     </div>
                   ))}
                </div>
                <div className="flex gap-6 mt-12">
                   <Link href="/pilot" className="inline-block rounded-full bg-white px-10 py-4 text-sm font-bold text-black transition-all hover:bg-neutral-200">
                      Request Practice Audit
                   </Link>
                   <Link href="https://github.com/shivambathvar001/syna-systems-registry" target="_blank" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-cyan-400 group/link">
                      Audit Codebase <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-all" />
                   </Link>
                </div>
              </div>
              <div className="aspect-video w-full rounded-3xl border border-slate-800 bg-[#020617] p-8 relative overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 grid-bg opacity-30"></div>
                 <div className="relative h-full w-full border border-slate-900 rounded-xl bg-black/50 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center opacity-40">
                       <Terminal size={14} className="text-slate-500" />
                       <span className="text-[8px] font-mono text-slate-500 uppercase">SYS_LOG :: PRODUCTION_NODE</span>
                    </div>
                    <div className="space-y-3 opacity-20">
                       <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
                       <div className="h-2 w-1/2 bg-slate-800 rounded"></div>
                       <div className="h-2 w-5/6 bg-slate-800 rounded"></div>
                    </div>
                    <div className="flex justify-center">
                       <RefreshCw size={40} className="text-indigo-500/40 animate-spin-slow" />
                    </div>
                 </div>
              </div>
            </div>
          </section>
        ))}

        {/* SECTION 5: PERFORMANCE MATRIX */}
        <section className="w-full py-48 px-8">
           <div className="mx-auto max-w-5xl text-center">
              <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white mb-12">Legacy RPA <br /><span className="text-slate-700 uppercase italic">vs</span> <br />Syna Systems.</h2>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse border-t border-slate-900">
                    <thead>
                       <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                          <th className="py-10 border-b border-slate-900">Criteria</th>
                          <th className="py-10 border-b border-slate-900">Legacy RPA</th>
                          <th className="py-10 border-b border-slate-900 text-cyan-400">Agentic Infra</th>
                       </tr>
                    </thead>
                    <tbody className="text-sm font-light text-slate-400">
                       {[
                         { c: "Unstructured Data", r: "Failure-prone (OCR only)", s: "92%+ Accuracy (LLM Reasoner)" },
                         { c: "Reasoning Depth", r: "Hardcoded Rules", s: "Stateful Agentic Chain" },
                         { c: "Failure Recovery", r: "Manual Ticket", s: "Self-Healing (Auto-Retry)" },
                         { c: "Deployment Time", r: "6-12 Months", s: "14-Day Pilot" }
                       ].map((row, ri) => (
                         <tr key={ri} className="border-b border-slate-900/50">
                            <td className="py-8 font-bold text-white">{row.c}</td>
                            <td className="py-8 opacity-40">{row.r}</td>
                            <td className="py-8 text-cyan-400 font-medium">{row.s}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </section>

        {/* SECTION 6: THE PIPELINE */}
        <section className="w-full py-48 px-8 bg-indigo-600 text-white relative overflow-hidden">
           <div className="absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full bg-white/10 blur-[100px]"></div>
           <div className="mx-auto max-w-4xl relative z-10">
              <BarChart4 size={60} className="mb-12 opacity-50" />
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 uppercase">14-Day <br />Pilot Cycle.</h2>
              <p className="text-xl text-indigo-100 font-light leading-relaxed mb-16 max-w-2xl">
                 We commit to production readiness within two weeks. Our &quot;Velocity Pilot&quot; program identifies one critical bottleneck and delivers a functioning, secure agentic backbone.
              </p>
              <Link href="/pilot" className="inline-block rounded-full bg-white px-16 py-6 text-sm font-black text-indigo-600 transition-all hover:bg-neutral-100">
                 Request Pilot Slots
              </Link>
           </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full border-t border-slate-900 py-32 px-8 bg-[#020617]">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-20">
            <div className="md:col-span-2">
               <div className="text-3xl font-black tracking-tighter text-white mb-8 italic uppercase">SYNA SYSTEMS</div>
               <p className="text-slate-500 max-w-xs leading-relaxed font-light">
                 High-Precision Infrastructure for the Autonomous Enterprise.
               </p>
            </div>
            <div className="space-y-8">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Company</h4>
               <ul className="space-y-4 text-sm font-medium text-slate-400">
                  <li><Link href="/about" className="hover:text-cyan-400 transition-colors">Our Ethos</Link></li>
                  <li><Link href="/insights" className="hover:text-cyan-400 transition-colors">Intelligence</Link></li>
                  <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
               </ul>
            </div>
            <div className="space-y-8">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Offices</h4>
               <p className="text-xs text-slate-600 leading-relaxed font-mono">
                  LONDON_UK <br />
                  SINGAPORE_SG <br />
                  REMOTE_DEPLOYMENT
               </p>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
