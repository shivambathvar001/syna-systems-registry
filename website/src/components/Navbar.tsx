"use client";

import { useState, useEffect } from "react";
import { Cpu, Menu, X } from "lucide-react";
import Link from "@/components/ui/Link";
import Button from "@/components/ui/Button";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/solutions", label: "Practices" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/projects", label: "Registry" },
    { href: "/blog", label: "Logs" },
    { href: "/pilot", label: "Velocity Pilot" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-slate-800 bg-[#020617]/90 backdrop-blur-lg py-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "border-transparent bg-transparent py-6"
        } px-6 w-full overflow-hidden`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between w-full">
          {/* Logo */}
          <NextLink href="/" className="flex items-center gap-3 group shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-slate-850 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50 transition-all duration-300">
              <Cpu size={20} className="animate-pulse" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              SYNA<span className="text-cyan-400">.</span>SYSTEMS
            </span>
          </NextLink>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-black tracking-[0.2em] uppercase">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                active={pathname === link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Button / Hamburger */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              href="/pilot"
              size="sm"
              className="hidden sm:inline-flex border-cyan-500/30 text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)]"
            >
              Apply for Pilot
            </Button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-slate-400 hover:text-white focus:outline-none p-1 shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-[#020617]/98 backdrop-blur-2xl lg:hidden flex flex-col justify-center px-10 py-20 animate-in fade-in duration-300">
          <div className="flex flex-col gap-8 text-center text-lg font-black tracking-[0.2em] uppercase">
            {navLinks.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-2 transition-colors duration-200 ${
                  pathname === link.href ? "text-cyan-400" : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </NextLink>
            ))}
            <div className="pt-8">
              <Button
                variant="cyan-glow"
                href="/pilot"
                size="md"
                className="w-full max-w-xs"
              >
                Apply for Pilot
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
