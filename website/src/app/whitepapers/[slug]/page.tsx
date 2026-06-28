import { whitepapers } from "@/data/whitepapers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, FileText } from "lucide-react";
import PrintButton from "@/components/PrintButton";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return whitepapers.map((paper) => ({
    slug: paper.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const paper = whitepapers.find((p) => p.slug === slug);
  if (!paper) return { title: "Whitepaper Not Found | Airwalk AI" };
  return {
    title: `${paper.title} | Airwalk AI Research`,
    description: paper.excerpt,
    keywords: paper.tags.join(", "),
  };
}

export default async function WhitepaperReaderPage({ params }: PageProps) {
  const { slug } = await params;
  const paper = whitepapers.find((p) => p.slug === slug);
  if (!paper) notFound();

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#020617] text-slate-200 pt-32 pb-24">

      {/* Header */}
      <section className="relative w-full max-w-4xl mx-auto px-6 mb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[200px] w-[500px] rounded-full bg-indigo-500/5 blur-[80px] -z-10"></div>

        <Link
          href="/whitepapers"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-400 uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          All Whitepapers
        </Link>

        {/* Category + Meta */}
        <div className="flex items-center gap-4 mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">
            <FileText size={11} />
            {paper.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
            <Calendar size={10} />
            {paper.date}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
            <Clock size={10} />
            {paper.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white leading-tight mb-3">
          {paper.title}
        </h1>

        <p className="text-lg text-slate-400 font-light leading-relaxed mb-6">
          {paper.subtitle}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {paper.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full border border-slate-800 bg-slate-900/50 text-[9px] font-mono text-slate-500 uppercase tracking-wider"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Print Button */}
        <div className="flex items-center gap-4 pb-8 border-b border-slate-800">
          <PrintButton />
          <span className="text-[10px] font-mono text-slate-600">
            Airwalk AI Intelligence Journal
          </span>
        </div>
      </section>

      {/* Content */}
      <article className="w-full max-w-4xl mx-auto px-6 whitepaper-content">
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight
            prose-h1:text-3xl prose-h1:text-white prose-h1:mb-4
            prose-h2:text-2xl prose-h2:text-white prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-3
            prose-h3:text-xl prose-h3:text-slate-200 prose-h3:mt-8 prose-h3:mb-3
            prose-h4:text-lg prose-h4:text-slate-300
            prose-p:text-slate-400 prose-p:font-light prose-p:leading-relaxed
            prose-strong:text-white prose-strong:font-bold
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-white
            prose-blockquote:border-l-cyan-500/50 prose-blockquote:bg-slate-900/30 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-6
            prose-code:text-cyan-300 prose-code:bg-slate-900 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
            prose-pre:bg-[#0a0f1e] prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-2xl
            prose-table:border-collapse
            prose-th:border prose-th:border-slate-700 prose-th:bg-slate-900/80 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-xs prose-th:font-bold prose-th:uppercase prose-th:tracking-wider prose-th:text-slate-300
            prose-td:border prose-td:border-slate-800 prose-td:px-4 prose-td:py-2 prose-td:text-sm prose-td:text-slate-400
            prose-li:text-slate-400 prose-li:font-light
            prose-hr:border-slate-800
            prose-em:text-slate-400
          "
          dangerouslySetInnerHTML={{
            __html: paper.content
              .replace(/^# (.+)$/gm, '<h1>$1</h1>')
              .replace(/^## (.+)$/gm, '<h2>$1</h2>')
              .replace(/^### (.+)$/gm, '<h3>$1</h3>')
              .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
              .replace(/`([^`]+)`/g, '<code>$1</code>')
              .replace(/^---$/gm, '<hr />')
              .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
              .replace(/^\| (.+) \|$/gm, (match) => {
                const cells = match.split('|').filter(c => c.trim()).map(c => c.trim());
                if (cells.every(c => c.match(/^-+$/))) return '</thead><tbody>';
                const tag = cells.every(c => c.match(/^\*\*/)) ? 'th' : 'td';
                const row = cells.map(c => `<${tag}>${c.replace(/\*\*/g, '')}</${tag}>`).join('');
                return `<tr>${row}</tr>`;
              })
              .replace(/<tr><th>/g, (m, offset, str) => {
                const before = str.substring(Math.max(0, offset - 10), offset);
                if (!before.includes('<table>')) return `<table><thead><tr><th>`;
                return m;
              })
              .replace(/<\/tbody>(?![\s\S]*<\/table>)/g, '</tbody></table>')
              .replace(/^- (.+)$/gm, '<li>$1</li>')
              .replace(/(<li>[\s\S]*<\/li>)/g, (match) => `<ul>${match}</ul>`)
              .replace(/<\/ul>\s*<ul>/g, '')
              .replace(/\n{2,}/g, '</p><p>')
              .replace(/^(?!<[htupblo])/gm, (match) => match ? `<p>${match}` : match)
          }}
        />
      </article>

      {/* Bottom CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 mt-16">
        <div className="glass-panel rounded-3xl border border-slate-800 bg-[#030712]/50 p-10 text-center">
          <h3 className="text-xl font-bold text-white mb-3">
            Ready for a Personalized Assessment?
          </h3>
          <p className="text-slate-400 text-sm mb-6 font-light">
            Get a custom operational audit tailored to your organization&apos;s specific EHR environment and denial patterns.
          </p>
          <Link
            href="/pilot"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all"
          >
            Apply for Velocity Pilot
          </Link>
        </div>
      </section>
    </main>
  );
}
