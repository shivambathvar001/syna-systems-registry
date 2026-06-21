"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function Dropdown({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className,
  icon,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={twMerge("relative w-full space-y-2", className)}>
      {label && (
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
          {icon}
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-5 py-4 text-left text-sm text-slate-200 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-light"
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown
            size={16}
            className={clsx("text-slate-500 transition-transform duration-300", {
              "rotate-180 text-cyan-400": isOpen,
            })}
          />
        </button>

        {isOpen && (
          <ul className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl py-2 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={clsx(
                      "flex w-full items-center justify-between px-5 py-3 text-left text-sm transition-colors font-light",
                      {
                        "bg-indigo-500/10 text-cyan-400 font-medium": isSelected,
                        "text-slate-400 hover:bg-slate-900 hover:text-slate-200": !isSelected,
                      }
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} className="text-cyan-400" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
