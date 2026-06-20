import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import {
  TrendingUp,
  Shield,
  Zap,
  Users,
  ArrowUpRight,
  CheckCircle,
  Star,
  Clock,
  DollarSign,
  ChevronRight,
  BarChart3,
  Cpu,
  Building2,
  Lock
} from "lucide-react";

export const metadata: Metadata = {
  title: "Portfolio | Syna Systems — Deployed Enterprise AI",
  description:
    "Real-world enterprise AI deployments by Syna Systems. Healthcare RCM, freight logistics, talent intelligence, and secure data governance case studies with measurable ROI.",
};

const ENGAGEMENTS = [
  {
    id: "bio-guard",
    codename: "PROJECT BIO-GUARD",
    sector: "Healthcare Revenue Cycle Management",
    client: "Multi-State Hospital System",
    status: "LIVE",
    year: "2024",
    icon: <Shield className="text-emerald-400" size={28} />,
    accentColor: "emerald",
    gradient: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    tagline: "Turning $14M in Annual Losses Into $8.4M Recovered Revenue",
    problem:
      "Medical Necessity denials were draining $14M annually. Claims were submitted blind — no pre-audit, no payer-policy alignment.",
    solution:
      "Deployed a stateful LangGraph Claim Scrubber that audits clinical notes against 200+ payer-specific Local Coverage Determinations before submission, with a zero-trust PII masking gateway.",
    metrics: [
      { label: "Revenue Recovered", value: "$8.4M", icon: <DollarSign size={16} /> },
      { label: "Clean Claim Rate +", value: "12%", icon: <TrendingUp size={16} /> },
      { label: "Denial Prediction Accuracy", value: "92%", icon: <BarChart3 size={16} /> },
      { label: "Deployment Timeline", value: "11 Days", icon: <Clock size={16} /> },
    ],
    tags: ["LangGraph", "HIPAA Proxy", "LangChain", "TypeScript"],
    caseStudyHref: "/case-studies#bio-guard",
  },
  {
    id: "iron-logic",
    codename: "PROJECT IRON-LOGIC",
    sector: "International Freight & Logistics",
    client: "Global Logistics Operator (EU)",
    status: "LIVE",
    year: "2024",
    icon: <Zap className="text-cyan-400" size={28} />,
    accentColor: "cyan",
    gradient: "from-cyan-500/10 to-blue-500/5",
    border: "border-cyan-500/20",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    tagline: "4.2 Hours → 4 Minutes. Automated Invoice Reconciliation.",
    problem:
      "4.2-hour billing latency per carrier cycle. Manual reconciliation errors costing 6-figure quarterly write-offs across 400+ active carriers.",
    solution:
      "Deployed a Supervisor-Worker multi-agent mesh with self-healing MCP bridges to carrier portals, real-time discrepancy flagging, and a SOC2-grade forensic audit ledger.",
    metrics: [
      { label: "Latency Reduction", value: "98.4%", icon: <TrendingUp size={16} /> },
      { label: "Billing Error Rate", value: "−90%", icon: <BarChart3 size={16} /> },
      { label: "Active Carriers", value: "400+", icon: <Building2 size={16} /> },
      { label: "Time to Deploy", value: "9 Days", icon: <Clock size={16} /> },
    ],
    tags: ["Python", "Playwright", "MCP", "SOC2 Ledger"],
    caseStudyHref: "/case-studies#iron-logic",
  },
  {
    id: "talent-graph",
    codename: "PROJECT TALENT-GRAPH",
    sector: "High-Growth Executive Recruitment",
    client: "Series-B Tech Staffing Firm",
    status: "LIVE",
    year: "2024",
    icon: <Users className="text-indigo-400" size={28} />,
    accentColor: "indigo",
    gradient: "from-indigo-500/10 to-purple-500/5",
    border: "border-indigo-500/20",
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    tagline: "4.2x Recruiter Efficiency. 70% Faster Engineering Hires.",
    problem:
      "Manual resume screening consumed 60% of recruiter bandwidth. Technical assessment quality was inconsistent, leading to costly mis-hires.",
    solution:
      "Built an Agentic Candidate Triage Engine that processes hiring signals from GitHub, LinkedIn, and assessment platforms — building a scored talent graph with automated pass/fail routing.",
    metrics: [
      { label: "Screening Speed", value: "+70%", icon: <TrendingUp size={16} /> },
      { label: "Recruiter Efficiency", value: "4.2×", icon: <Users size={16} /> },
      { label: "Mis-hire Rate", value: "−55%", icon: <Star size={16} /> },
      { label: "Profiles Processed/Day", value: "2,400+", icon: <Cpu size={16} /> },
    ],
    tags: ["LangGraph", "GitHub API", "Node.js", "React"],
    caseStudyHref: "/case-studies#talent-graph",
  },
  {
    id: "zero-bridge",
    codename: "PROJECT ZERO-BRIDGE",
    sector: "Enterprise Data Governance",
    client: "FinTech Infrastructure Provider",
    status: "LIVE",
    year: "2023",
    icon: <Lock className="text-purple-400" size={28} />,
    accentColor: "purple",
    gradient: "from-purple-500/10 to-pink-500/5",
    border: "border-purple-500/20",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    tagline: "AI Agents With Database Access. Zero Direct Credentials Exposed.",
    problem:
      "The client needed to give AI agents database query capabilities while maintaining absolute data sovereignty and passing regulatory audits.",
    solution:
      "Engineered a Zero-Trust MCP Server — a restricted API gateway with strict input sanitization, PII redaction at the wire level, immutable query logging, and role-based tool exposure.",
    metrics: [
      { label: "Credential Exposure", value: "0%", icon: <Lock size={16} /> },
      { label: "Audit Pass Rate", value: "100%", icon: <CheckCircle size={16} /> },
      { label: "PII Redaction Speed", value: "<2ms", icon: <Zap size={16} /> },
      { label: "Compliance Frameworks", value: "SOC2 / GDPR", icon: <Shield size={16} /> },
    ],
    tags: ["MCP", "Express", "SQLite", "PII Engine"],
    caseStudyHref: "/case-studies#zero-bridge",
  },
];

export default function Portfolio() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-20">

        {/* HERO */}
        <section className="relative w-full flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-indigo-500/6 blur-[140px] -z-10" />
          <div className="absolute top-20 right-20 h-[200px] w-[200px] rounded-full bg-cyan-500/5 blur-[80px] -z-10 animate-pulse" />

          <div className="z-10 mb-6 rounded-full border border-slate-800 bg-slate-900/50 w-fit px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
            Deployed Engagements
          </div>

          <h1 className="z-10 text-5xl sm:text-8xl font-black tracking-tighter text-white leading-none mb-6">
            Enterprise <br />
            <span className="glow-text-indigo">Intelligence</span>
            <br />
            <span className="text-slate-500">In Production.</span>
          </h1>

          <p className="z-10 max-w-2xl mx-auto text-base sm:text-xl text-slate-400 font-light leading-relaxed mb-12">
            Not prototypes. Not demos. Real operational infrastructure, deployed inside
            real enterprises — with verifiable, auditable outcomes.
          </p>

          {/* Summary Stats */}
          <div className="z-10 w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Live Deployments", value: "4+" },
              { label: "Combined ROI Unlocked", value: "$12M+" },
              { label: "Avg. Deploy Time", value: "10 Days" },
              { label: "Compliance Passed", value: "100%" },
            ].map((stat, i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 text-center">
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ENGAGEMENTS */}
        <section className="w-full max-w-7xl mx-auto px-6 pb-32 space-y-16">
          {ENGAGEMENTS.map((eng, idx) => (
            <div
              key={eng.id}
              className={`glass-panel rounded-3xl overflow-hidden border ${eng.border} relative`}
            >
              {/* Top accent gradient */}
              <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${eng.gradient.replace('/10', '/30').replace('/5', '/15')}`} />

              <div className="p-8 lg:p-12">
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center bg-gradient-to-br ${eng.gradient}`}>
                      {eng.icon}
                    </div>
                    <div>
                      <div className={`text-[9px] font-mono font-bold tracking-widest uppercase border rounded-full px-3 py-1 w-fit mb-2 ${eng.badge}`}>
                        {eng.status} · {eng.year}
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-slate-500 uppercase block">
                        {eng.codename}
                      </span>
                    </div>
                  </div>
                  <div className="text-right lg:max-w-xs">
                    <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-1">{eng.sector}</div>
                    <div className="text-[11px] font-bold text-slate-400">{eng.client}</div>
                  </div>
                </div>

                {/* Tagline */}
                <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tight mb-8 max-w-3xl leading-tight">
                  {eng.tagline}
                </h2>

                {/* Problem / Solution columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                  <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-900">
                    <div className="text-[9px] font-mono font-bold tracking-[0.3em] text-red-400 uppercase mb-3">{"// The Problem"}</div>
                    <p className="text-sm text-slate-400 leading-relaxed">{eng.problem}</p>
                  </div>
                  <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-900">
                    <div className="text-[9px] font-mono font-bold tracking-[0.3em] text-green-400 uppercase mb-3">{"// Our Architecture"}</div>
                    <p className="text-sm text-slate-400 leading-relaxed">{eng.solution}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                  {eng.metrics.map((m, mi) => (
                    <div key={mi} className={`rounded-2xl p-5 bg-gradient-to-br ${eng.gradient} border ${eng.border}`}>
                      <div className="flex items-center gap-2 text-slate-500 mb-2">{m.icon}<span className="text-[9px] font-mono uppercase tracking-widest">{m.label}</span></div>
                      <div className="text-2xl font-black text-white">{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-900">
                  <div className="flex flex-wrap gap-2">
                    {eng.tags.map((tag, ti) => (
                      <span key={ti} className="px-3 py-1 rounded-md text-[9px] font-mono font-bold bg-white/5 border border-white/5 text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={eng.caseStudyHref}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${eng.badge} hover:scale-105`}
                  >
                    Full Case Study
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="w-full py-24 bg-[#030712]/50 border-t border-slate-950 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400 mb-4">
              Start Your Engagement
            </div>
            <h3 className="text-4xl font-black text-white tracking-tighter mb-4">
              Want results like these?
            </h3>
            <p className="text-sm text-slate-400 font-light mb-10 leading-relaxed">
              Every engagement begins with a 14-day Velocity Pilot. We identify your highest-friction operational bottleneck, deploy a working proof-of-concept, and give you measurable ROI data before any long-term commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pilot"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-full hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all text-xs"
              >
                Configure Velocity Pilot
                <ChevronRight size={14} />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 border border-slate-700 text-slate-300 font-black uppercase tracking-wider rounded-full hover:bg-slate-900 transition-all text-xs"
              >
                View Technical Registry
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
