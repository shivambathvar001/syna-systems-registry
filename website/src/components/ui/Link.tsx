import React from "react";
import NextLink from "next/link";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
  active?: boolean;
}

export default function Link({
  href,
  className,
  children,
  active = false,
  ...props
}: LinkProps) {
  const baseStyles = "relative py-1 text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300";
  
  const stateStyles = active 
    ? "text-cyan-400" 
    : "text-slate-400 hover:text-cyan-400";

  const underlineStyles = "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-right after:scale-x-0 after:bg-cyan-400 after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100";

  const combinedClasses = twMerge(
    clsx(
      baseStyles,
      stateStyles,
      underlineStyles,
      className
    )
  );

  return (
    <NextLink href={href} className={combinedClasses} {...props}>
      {children}
    </NextLink>
  );
}
