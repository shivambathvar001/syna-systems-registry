import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Cpu, ShieldCheck, BarChart3, Globe, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Airwalk AI | Operational AI Infrastructure Partner",
  description: "Airwalk AI architects elite stateful agentic backbones and reliable zero-failure automation for logistics, healthcare, and enterprise revenue operations.",
  keywords: ["Operational AI", "Agentic backbones", "Enterprise automation", "Zero-trust runtime", "Model Context Protocol", "Logistics automation", "RCM Rationale"],
};

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-[#020617] text-slate-200 grid-bg">
        
        {/* SECTION 1: HERO - Dynamic & Technical */}
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
          <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse"></div>
          
          <div className="z-10 mb-8 rounded-full border border-slate-800 bg-slate-900/50 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            Elite Agentic Infrastructure for the High-Friction Enterprise
          </div>
          
          <h1 className="z-10 max-w-6xl text-6xl font-black tracking-tighter sm:text-9xl leading-[0.9] text-white text-center">
            Architecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">Autonomous</span> <br />
            <span className="glow-text-cyan">Backbones.</span>
          </h1>
          
          <p className="z-10 mt-12 max-w-3xl text-lg md:text-2xl text-slate-400 leading-relaxed font-light text-center">
            We replace manual operational bottlenecks with high-precision, stateful agentic workflows. 
            Airwalk AI moves enterprises beyond experimental chat into mission-critical, self-healing automation.
          </p>
          
          <div className="z-10 mt-16 flex flex-col sm:flex-row gap-8 w-full sm:w-auto px-10">
            <Link href="/pilot" className="group relative rounded-full bg-white px-12 py-6 text-sm font-black text-black transition-all hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]">
              INITIATE TECHNICAL AUDIT
              <ChevronRight size={18} className="inline-block ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/solutions" className="group rounded-full border border-slate-700 bg-slate-900/40 backdrop-blur-md px-12 py-6 text-sm font-black text-white transition-all hover:bg-slate-800">
              EXPLORE PRACTICES
            </Link>
          </div>

          <div className="z-10 mt-24 animate-float">
             <div className="flex flex-col items-center gap-4 text-slate-600">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll to Audit Architecture</span>
               <div className="h-12 w-[1px] bg-gradient-to-b from-cyan-500 to-transparent"></div>
             </div>
          </div>
        </section>

        {/* SECTION 2: THE AUTOMATION DEFICIT - Meaningful Stats */}
        <section className="w-full py-32 px-8 border-y border-slate-900 bg-[#030712]/50">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
              <div className="flex flex-col gap-4">
                <BarChart3 className="text-cyan-500 mb-4" size={40} />
                <h3 className="text-5xl font-black text-white tracking-tighter">$2.1T</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Annual Economic Leakage</p>
                <p className="text-sm text-slate-400 font-light leading-relaxed">Lost globally due to manual operational latency and &quot;Human Middleware&quot; bottlenecks in mid-to-large enterprises.</p>
              </div>
              <div className="flex flex-col gap-4">
                <Layers className="text-indigo-500 mb-4" size={40} />
                <h3 className="text-5xl font-black text-white tracking-tighter">73%</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Unstructured Dark Data</p>
                <p className="text-sm text-slate-400 font-light leading-relaxed">Of enterprise data remains trapped in emails, PDFs, and voice logs—invisible to legacy RPA and standard software.</p>
              </div>
              <div className="flex flex-col gap-4">
                <ShieldCheck className="text-emerald-500 mb-4" size={40} />
                <h3 className="text-5xl font-black text-white tracking-tighter">&lt; 14 Days</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Velocity to ROI</p>
                <p className="text-sm text-slate-400 font-light leading-relaxed">Average timeline for an Airwalk AI &quot;Velocity Pilot&quot; to demonstrate measurable efficiency gains in production environments.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: PLATFORM ARCHITECTURE - Technical Visualization */}
        <section className="w-full py-48 px-8 overflow-hidden">
          <div className="mx-auto max-w-7xl relative">
            <div className="absolute top-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_top_right,_var(--accent-glow)_0%,_transparent_70%)] opacity-30"></div>
            
            <div className="max-w-3xl mx-auto text-center mb-32">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-500 mb-6">The Airwalk Stack</p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8">Engineering for <br />Stateful Reliability.</h2>
              <p className="text-xl text-slate-400 font-light leading-relaxed">
                Most AI agencies build &quot;wrappers.&quot; We architect infrastructure. Our deployments utilize a three-layer security and orchestration stack designed for zero-failure operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="glass-panel p-10 rounded-3xl group hover:border-cyan-500/50 transition-all duration-500">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-8">
                    <Cpu size={24} />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Supervisor-Worker Orchestration</h4>
                  <p className="text-slate-400 font-light leading-relaxed mb-8">
                    We deploy centralized routing LLMs that decompose complex enterprise requests into discrete sub-tasks, dispatched to specialized workers optimized for deterministic outcomes.
                  </p>
                  <ul className="space-y-3">
                    {["Isolated failure domains", "Parallel task execution", "Automatic retry logic"].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-mono text-cyan-500/70">
                        <div className="h-1 w-1 bg-cyan-500 rounded-full"></div>
                        {f}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="glass-panel p-10 rounded-3xl group hover:border-indigo-500/50 transition-all duration-500">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Zero-Trust MCP Runtime</h4>
                  <p className="text-slate-400 font-light leading-relaxed mb-8">
                    Agents operate within cryptographically secured boundaries. Our Model Context Protocol implementation ensures LLMs never touch raw credentials or sensitive PII.
                  </p>
                  <ul className="space-y-3">
                    {["SOC2-compliant audit trails", "Granular permission scoping", "Edge-based PII masking"].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-mono text-indigo-500/70">
                        <div className="h-1 w-1 bg-indigo-500 rounded-full"></div>
                        {f}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: SECTOR DYNAMICS - Industry Sync */}
        <section className="w-full py-48 bg-[#050505] px-8 border-y border-slate-900">
           <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center text-center mb-32">
                 <div className="max-w-2xl mx-auto mb-8">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white mb-8">Sector <br />Intelligence.</h2>
                    <p className="text-xl text-slate-500 font-light">We solve the specific manual friction nodes unique to high-volume industries.</p>
                 </div>
                 <Link href="/pilot" className="text-sm font-bold text-cyan-400 border-b border-cyan-400/30 pb-2 hover:border-cyan-400 transition-all">
                    Request Sector Audit →
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { 
                     title: "Logistics & Global Trade", 
                     stats: "92.4% Accuracy",
                     desc: "Automating customs documentation and carrier invoice reconciliation for freight forwarders moving 5,000+ units monthly.",
                     tech: "IDP + Policy Graphs"
                   },
                   { 
                     title: "Recruitment & Staffing", 
                     stats: "4m Avg. Triage",
                     desc: "Replacing manual LinkedIn research with autonomous talent agents that generate technical audits before a recruiter even sees the profile.",
                     tech: "Signal Monitoring + RAG"
                   },
                   { 
                     title: "B2B SaaS Support", 
                     stats: "60% Auto-Resolution",
                     desc: "Self-healing operational backends that execute database corrections and configuration updates via secure agentic boundaries.",
                     tech: "MCP + MCP Servers"
                   }
                 ].map((item, i) => (
                   <div key={i} className="p-12 rounded-3xl border border-slate-900 bg-[#020617] transition-all hover:scale-[1.02] hover:shadow-2xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 mb-8">{item.tech}</p>
                      <h3 className="text-2xl font-bold text-white mb-6 leading-tight">{item.title}</h3>
                      <div className="text-4xl font-black text-cyan-500/30 mb-8 tracking-tighter">{item.stats}</div>
                      <p className="text-sm text-slate-400 font-light leading-relaxed">{item.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* SECTION 5: GLOBAL FOOTPRINT - Simulated Scale */}
        <section className="w-full py-48 px-8 text-center bg-[#020617] relative">
          <div className="absolute inset-0 opacity-10">
             <div className="grid-bg h-full w-full"></div>
          </div>
          <div className="mx-auto max-w-4xl relative z-10">
            <Globe className="mx-auto text-cyan-500 mb-12 animate-pulse" size={60} />
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-12 uppercase">Precision <br />At Scale.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               <div>
                 <p className="text-4xl font-black text-white">2.4M</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-2">Annual Operations Monitored</p>
               </div>
               <div>
                 <p className="text-4xl font-black text-white">42k</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-2">Active Agent Nodes</p>
               </div>
               <div>
                 <p className="text-4xl font-black text-white">99.9%</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-2">Execution Uptime</p>
               </div>
               <div>
                 <p className="text-4xl font-black text-white">SOC2</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-2">Compliance Ready</p>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: THE ALIGNMENT PROTOCOL - Methodology */}
        <section className="w-full py-48 px-8 bg-white text-black">
           <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
                 <div>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12">The <br />Alignment <br />Protocol.</h2>
                    <p className="text-xl text-neutral-600 font-light leading-relaxed">
                       We don&apos;t sell software licenses. We build long-term operational partnerships through a rigorous, multi-stage deployment framework.
                    </p>
                 </div>
                 <div className="space-y-16 pt-4">
                    {[
                      { step: "01", label: "Diagnostic Audit", desc: "15-minute technical scan to identify high-latency friction nodes." },
                      { step: "02", label: "Architectural Synthesis", desc: "Mapping your current stack to a stateful agentic schema." },
                      { step: "03", label: "Autonomous Rollout", desc: "Phased deployment starting with your most expensive manual bottleneck." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-10">
                        <span className="text-3xl font-black text-neutral-300 font-mono italic">{item.step}</span>
                        <div>
                          <h4 className="text-2xl font-bold mb-4">{item.label}</h4>
                          <p className="text-sm text-neutral-500 leading-relaxed font-light">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                    <Link href="/pilot" className="inline-block mt-12 px-12 py-6 bg-black text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-2xl">
                       Begin Stage 01 Alignment
                    </Link>
                 </div>
              </div>
           </div>
        </section>

      </main>
    </>
  );
}
