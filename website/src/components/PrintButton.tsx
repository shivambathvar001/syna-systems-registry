"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/50 text-xs font-bold text-slate-400 hover:text-white hover:border-cyan-500/30 transition-all uppercase tracking-widest"
    >
      <Printer size={14} />
      Print / Save PDF
    </button>
  );
}
