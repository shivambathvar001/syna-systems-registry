import { blogPosts } from "@/data/blogs";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";

export const metadata = {
  title: "Insights Journal & Technical Blogs | Airwalk AI",
  description: "Read technical breakdowns on EHR integrations, HIPAA-compliant data pipeline design, and AI reliability frameworks in revenue cycle operations.",
  keywords: "RCM, AI reliability, EHR integrations, HIPAA compliance, healthcare technology",
};

export default function BlogListingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-32 pb-24">
      
      {/* HEADER SECTION */}
      <section className="relative w-full max-w-7xl mx-auto px-6 text-center mb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[200px] w-[500px] rounded-full bg-indigo-500/5 blur-[80px] -z-10 animate-pulse"></div>
        
        <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-indigo-500/30 bg-slate-900/50 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
          <Sparkles size={12} className="animate-spin-slow" />
          Technical Logs & Research
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-white leading-none mb-6">
          The Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">Backplane</span> <br />
          <span className="glow-text-cyan">Declassified.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-400 font-light leading-relaxed">
          Deep-dives into HIPAA-compliant data scrubbing, Epic/Cerner integration pipelines, and deterministic agent workflows.
        </p>
      </section>

      {/* ARTICLES GRID */}
      <section className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article 
              key={post.slug} 
              className="glass-panel p-8 rounded-3xl border border-slate-800 bg-[#030712]/50 hover:bg-[#030712]/80 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2.5 py-0.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[9px] font-mono text-indigo-300 uppercase tracking-wider"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-3 leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-slate-400 text-sm font-light mb-6 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-900 flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {post.readTime}
                  </span>
                </div>
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center justify-between text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-white transition-colors group/link mt-2"
                >
                  Read Analysis
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

    </main>
  );
}
