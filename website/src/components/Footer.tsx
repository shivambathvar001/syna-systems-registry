import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 py-24 px-8 bg-[#020617] relative z-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-[1px]">
                <div className="h-full w-full bg-[#020617] rounded-xl flex items-center justify-center font-black text-white text-lg tracking-tighter">
                  A
                </div>
              </div>
              <div className="text-2xl font-black tracking-tighter text-white">AIRWALK AI</div>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed font-light text-base">
              Global Operational AI Infrastructure Partner. <br />
              We deliver high-precision MVPs in 14 days to eliminate manual enterprise bottlenecks.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Capabilities</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><Link href="/solutions" className="hover:text-cyan-400 transition-colors">Intelligent Document Processing</Link></li>
              <li><Link href="/solutions" className="hover:text-cyan-400 transition-colors">Autonomous Revenue Operations</Link></li>
              <li><Link href="/solutions" className="hover:text-cyan-400 transition-colors">Zero-Trust AI Governance</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Company & Legal</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><Link href="/case-studies" className="hover:text-cyan-400 transition-colors">Case Studies</Link></li>
              <li><Link href="/blog" className="hover:text-cyan-400 transition-colors">Insights Journal</Link></li>
              <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-700">
            <span>© 2026 Airwalk AI</span>
            <span>All Rights Reserved</span>
            <span>San Francisco | London | Remote</span>
          </div>
          <div className="text-[10px] font-black tracking-widest text-slate-500">
            BUILT WITH PRECISION OPERATIONAL ENGINEERING
          </div>
        </div>
      </div>
    </footer>
  );
}
