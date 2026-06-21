import React from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "cyan-glow";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 rounded-full shrink-0 select-none";
  
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-white text-black hover:bg-slate-200 active:scale-95",
    secondary: "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 active:scale-95",
    outline: "border border-slate-700 hover:border-white text-white bg-transparent active:scale-95",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-slate-900",
    "cyan-glow": "bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white shadow-[0_0_30px_rgba(79,70,229,0.25)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] active:scale-[0.98]",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-[10px] tracking-wider",
    md: "px-6 py-2.5 text-xs tracking-widest",
    lg: "px-10 py-5 text-sm tracking-widest",
  };

  const combinedClasses = twMerge(clsx(baseStyles, variants[variant], sizes[size], className));

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
