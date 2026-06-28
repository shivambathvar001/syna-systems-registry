import { blogPosts } from "@/data/blogs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, ShieldCheck, Sparkles } from "lucide-react";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  
  return {
    title: `${post.title} | Airwalk AI`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
  };
}

export default function BlogDetailPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  
  if (!post) {
    notFound();
  }

  // Basic parser for simple markdown formatting (headings, lists, bold)
  const renderContent = (markdown: string) => {
    const lines = markdown.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith("# ")) {
        return <h1 key={idx} className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-8 mb-6">{trimmed.slice(2)}</h1>;
      }
      if (trimmed.startsWith("## ")) {
        return <h2 key={idx} className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-8 mb-4">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith("### ")) {
        return <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-200 mt-6 mb-3">{trimmed.slice(4)}</h3>;
      }
      if (trimmed.startsWith("- ")) {
        return <li key={idx} className="ml-6 list-disc text-slate-300 font-light leading-relaxed mb-2">{trimmed.slice(2)}</li>;
      }
      if (trimmed.startsWith("* **")) {
        // Handle list item with bold prefix
        return <li key={idx} className="ml-6 list-disc text-slate-300 font-light leading-relaxed mb-2">{trimmed.slice(2)}</li>;
      }
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-2 border-cyan-400 bg-slate-900/40 p-4 rounded-r-xl my-6 text-sm italic text-slate-400 font-light leading-relaxed">
            {trimmed.slice(2)}
          </blockquote>
        );
      }
      if (trimmed === "") {
        return <div key={idx} className="h-4"></div>;
      }
      
      return <p key={idx} className="text-slate-300 text-base sm:text-lg font-light leading-relaxed mb-4">{trimmed}</p>;
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#020617] text-slate-200 grid-bg pt-32 pb-24">
      <div className="w-full max-w-4xl mx-auto px-6">
        
        {/* BACK NAVIGATION */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to logs
        </Link>

        {/* HEADER */}
        <header className="mb-12 pb-10 border-b border-slate-900">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="px-2.5 py-0.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[9px] font-mono text-indigo-300 uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-2">
              <Calendar size={12} />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={12} />
              {post.readTime}
            </span>
            <span className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck size={12} />
              Verified Integrity
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 bg-[#030712]/50 mb-12">
          <div className="prose prose-invert max-w-none">
            {renderContent(post.content)}
          </div>
        </section>

        {/* FOOTER CTA */}
        <footer className="glass-panel p-8 rounded-3xl border border-slate-800 bg-[#030712]/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-white font-bold">Ready to secure your RCM pipeline?</h4>
            <p className="text-xs text-slate-400 font-light">Get a custom diagnostic audit of your claim denial logs in 14 days.</p>
          </div>
          <Link 
            href="/pilot"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-450 hover:bg-cyan-500 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#020617] transition-all hover:scale-105 duration-200"
          >
            Request Pilot
            <Sparkles size={14} />
          </Link>
        </footer>

      </div>
    </main>
  );
}
