"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface AccordionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export default function Accordion({
  title,
  subtitle,
  children,
  className,
  defaultOpen = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={twMerge("border-b border-slate-900/50 py-4 transition-colors", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-left focus:outline-none"
      >
        <div className="flex gap-4 items-start">
          {subtitle && (
            <span className="text-[10px] font-mono text-indigo-400 font-bold w-16 shrink-0 pt-0.5">
              {subtitle}
            </span>
          )}
          <div>
            <h5 className="text-xs font-bold text-white mb-0.5">{title}</h5>
          </div>
        </div>
        <ChevronDown
          size={14}
          className={clsx("text-slate-500 transition-transform duration-300", {
            "rotate-180 text-cyan-400": isOpen,
          })}
        />
      </button>
      
      {isOpen && (
        <div className="mt-2 pl-20 pr-4 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="text-[11px] text-slate-500 font-light leading-relaxed">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
