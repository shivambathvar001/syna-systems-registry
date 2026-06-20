import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import { 
  Terminal, 
  Code2, 
  Settings, 
  Database, 
  ArrowUpRight, 
  FolderGit2, 
  Cpu, 
  Binary,
  Layers,
  ChevronRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Project Registry | Syna Systems Technical Backbones",
  description: "Explore the open-source and proprietary core agentic architecture blueprints engineered by Syna Systems.",
};

export default function ProjectRegistry() {
  const projects = [
    {
      title: "Predictive Denial Management (PDM)",
      category: "Healthcare Revenue Cycle Management",
      icon: <Database className="text-cyan-400" size={24} />,
      description: "A stateful 'Claim Scrubber' workflow that audits physician notes and billing codes against payer policy rules before submittal.",
      stack: ["LangGraph", "LangChain", "TypeScript", "HIPAA Proxy Gateway"],
      metrics: "40% medical necessity denial reduction",
      templatePath: "/registry/healthcare-rcm/pdm-scrubber.ts",
      declassifiedId: "bio-guard"
    },
    {
      title: "Autonomous Invoice Reconciliation Mesh",
      category: "Carrier Freight & Logistics Ops",
      icon: <Binary className="text-indigo-400" size={24} />,
      description: "Multi-agent 'Supervisor-Worker' system designed to extract invoices, cross-reference contract terms, and heal discrepancies via MCP.",
      stack: ["Python", "Playwright", "Model Context Protocol", "JSON Schema"],
      metrics: "90% error reduction; billing latency down to 4m",
      templatePath: "/registry/recruitment-agent/template.ts", // Fallback technical link
      declassifiedId: "iron-logic"
    },
    {
      title: "Agentic Candidate Triage Engine",
      category: "High-Volume Technical Recruitment",
      icon: <Cpu className="text-emerald-400" size={24} />,
      description: "Stateful auditing engine that processes hiring signals, runs automated code assessments, and builds technical talent graphs.",
      stack: ["LangGraph", "GitHub API", "React Tooling", "Node.js"],
      metrics: "70% faster candidate screening; 4.2x recruiter efficiency",
      templatePath: "/registry/recruitment-agent/template.ts",
      declassifiedId: "talent-graph"
    },
    {
      title: "Zero-Trust Enterprise MCP Server",
      category: "Secure Data Governance Bridge",
      icon: <Terminal className="text-purple-400" size={24} />,
      description: "A model context protocol bridge providing AI agents with restricted database access, strict sanitization gateways, and immutable logging.",
      stack: ["Model Context Protocol", "Express", "SQLite", "PII Redaction Engine"],
      metrics: "100% data sovereignty; zero direct credentials exposed",
      templatePath: "/registry/mcp-server/index.ts",
      declassifiedId: "zero-bridge"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-20">
        
        {/* HERO */}
        <section className="relative w-full flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[350px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px] -z-10 animate-pulse"></div>
          
          <div className="z-10 mb-6 rounded-full border border-slate-800 bg-slate-900/50 w-fit px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
             Technical Registry
          </div>
          
          <h1 className="z-10 text-4xl sm:text-7xl font-black tracking-tighter text-white leading-none mb-6">
            Architectural <br />
            <span className="glow-text-indigo">Blueprints.</span>
          </h1>
          
          <p className="z-10 max-w-2xl mx-auto text-base sm:text-xl text-slate-400 font-light leading-relaxed">
            We build open-source templates and proprietary backbones for enterprise scaling. Browse our system schemas below.
          </p>
        </section>

        {/* PROJECTS GRID */}
        <section className="w-full max-w-7xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj, idx) => (
              <div 
                key={idx} 
                className="glass-panel p-8 rounded-3xl flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-indigo-500/5 to-transparent blur-xl"></div>
                
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-12 w-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                      {proj.icon}
                    </div>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                      {proj.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors mb-3">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">
                    {proj.description}
                  </p>

                  {/* STACK BADGES */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {proj.stack.map((item, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-md text-[9px] font-mono font-bold bg-white/5 border border-white/5 text-slate-400"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="text-slate-600 block uppercase tracking-wider text-[9px] font-mono">Performance Metric</span>
                    <span className="font-bold text-white/90">{proj.metrics}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Link 
                      href={`/case-studies#${proj.declassifiedId}`}
                      className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      Case Study
                    </Link>
                    
                    <a 
                      href={proj.templatePath}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/25 transition-all text-xs font-bold font-mono"
                    >
                      CODE
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="w-full py-24 bg-[#030712]/50 border-t border-slate-950 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Deploy a Velocity Pilot</h3>
            <p className="text-sm text-slate-400 font-light mb-8 leading-relaxed">
              Interested in integrating these architectures into your existing enterprise stack? Request a 14-day velocity pilot slot to deploy a secure sandbox.
            </p>
            <Link 
              href="/pilot"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-full hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all text-xs"
            >
              Configure Deployment Parameters
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
