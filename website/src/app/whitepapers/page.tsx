import { whitepapers } from "@/data/whitepapers";
import Link from "next/link";
import { FileText, ArrowRight, Shield, Download, Clock, Sparkles } from "lucide-react";

export const metadata = {
  title: "Research & Whitepapers | Airwalk AI",
  description: "Deep-dive technical whitepapers on Predictive Denial Management, Stateful Agent Architecture, and HIPAA-compliant AI security frameworks for healthcare RCM.",
  keywords: "healthcare AI whitepaper, denial management architecture, HIPAA AI compliance, stateful agents, RCM automation",
};

const categoryIcons: Record<string, typeof Shield> = {
  Architecture: FileText,
  Engineering: FileText,
  Security: Shield,
};

export default function WhitepapersPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-32 pb-24">

      {/* HEADER SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-6 text-center mb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-indigo-500/5 blur-[100px] -z-10 animate-pulse"></div>

        <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-cyan-500/30 bg-slate-900/50 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
          <Sparkles size={12} className="animate-spin-slow" />
          Technical Research Library
        </div>

        <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-white leading-none mb-6">
          Intelligence{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
            Journals
          </span>
          <br />
          <span className="glow-text-cyan">Declassified.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-400 font-light leading-relaxed">
          Production-grade architecture blueprints for healthcare AI infrastructure.
          Zero theory. All implementation.
        </p>
      </section>

      {/* WHITEPAPERS GRID */}
      <section className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {whitepapers.map((paper) => {
            const IconComponent = categoryIcons[paper.category] || FileText;
            return (
              <article
                key={paper.slug}
                className="relative glass-panel rounded-3xl border border-slate-800 bg-[#030712]/50 hover:bg-[#030712]/80 flex flex-col transition-all duration-500 group hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(99,102,241,0.08)]"
              >
                {/* Cover Gradient Bar */}
                <div className={`h-2 w-full rounded-t-3xl bg-gradient-to-r ${paper.coverGradient}`}></div>

                <div className="p-8 flex flex-col flex-1">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">
                      <IconComponent size={11} />
                      {paper.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      <Clock size={10} />
                      {paper.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 leading-tight">
                    {paper.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-sm text-slate-500 font-medium mb-4 leading-snug">
                    {paper.subtitle}
                  </p>

                  {/* Excerpt */}
                  <p className="text-slate-400 text-sm font-light mb-8 leading-relaxed flex-1">
                    {paper.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {paper.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full border border-slate-800 bg-slate-900/50 text-[9px] font-mono text-slate-500 uppercase tracking-wider"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="pt-6 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-600 uppercase">
                      Published {paper.date}
                    </span>
                    <Link
                      href={`/whitepapers/${paper.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-white transition-colors group/link"
                    >
                      Read Paper
                      <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="w-full max-w-3xl mx-auto px-6 mt-24 text-center">
        <div className="glass-panel rounded-3xl border border-slate-800 bg-[#030712]/50 p-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
            Want a Personalized Audit?
          </h2>
          <p className="text-slate-400 mb-8 font-light">
            Our Operational Assessment Engine generates custom audit reports based on your specific
            EHR environment, denial patterns, and team structure.
          </p>
          <Link
            href="/pilot"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <Download size={16} />
            Apply for Velocity Pilot
          </Link>
        </div>
      </section>
    </main>
  );
}
