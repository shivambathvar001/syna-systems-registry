"use client";

import Link from "next/link";
import { Cpu, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      scrolled 
        ? "border-slate-800 bg-[#020617]/90 backdrop-blur-lg py-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]" 
        : "border-transparent bg-transparent py-6"
    } px-6`}>
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-slate-850 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 transition-all duration-300">
            <Cpu size={20} className="animate-pulse" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">
            SYNA<span className="text-cyan-400">.</span>SYSTEMS
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-xs font-black tracking-[0.2em] text-slate-400 uppercase">
          <Link href="/" className="hover:text-cyan-400 transition-colors duration-200">
            Home
          </Link>
          <Link href="/solutions" className="hover:text-cyan-400 transition-colors duration-200">
            Practices
          </Link>
          <Link href="/case-studies" className="hover:text-cyan-400 transition-colors duration-200">
            Case Studies
          </Link>
          <Link href="/projects" className="hover:text-cyan-400 transition-colors duration-200">
            Registry
          </Link>
          <Link href="/pilot" className="hover:text-cyan-400 transition-colors duration-200">
            Velocity Pilot
          </Link>
        </div>

        <div>
          <Link 
            href="/pilot" 
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-cyan-500/30 bg-slate-900/50 px-6 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
          >
            Apply for Pilot
            <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
