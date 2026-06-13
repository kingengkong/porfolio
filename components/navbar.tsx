"use client";
import { Lock, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePortfolioData } from "@/hooks/use-portfolio-data";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data } = usePortfolioData();
  const profile = data.profile;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-black/10 bg-white/86 py-3 shadow-sm backdrop-blur-xl dark:border-white/15 dark:bg-black/86"
          : "border-black/5 bg-white/40 py-5 backdrop-blur-sm dark:border-white/10 dark:bg-black/40"
      }`}
    >
      <nav className="container-page grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <a
          href="#home"
          className="flex flex-col text-xs font-black uppercase tracking-[0.18em] text-black dark:text-white"
        >
          <span>{profile.name.split(" ")[0]}</span>
          <span className="text-gradient">Portfolio</span>
        </a>

        <div className="hidden items-center rounded-full border border-black/10 bg-white/70 px-2 py-1 dark:border-white/15 dark:bg-black/70 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-neutral-600 transition hover:bg-[#FFC300] hover:text-black dark:text-neutral-300 dark:hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <a
            href="/admin"
            aria-label="Admin"
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#FFC300]/10 dark:hover:bg-[#FFC300]/5 opacity-0 hover:opacity-100 cursor-pointer"
            style={{ pointerEvents: "auto" }}
          >
            <Lock size={16} className="opacity-0 hover:opacity-100 transition-opacity" />
          </a>

          <ThemeToggle />

          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/80 text-black md:hidden dark:border-white/15 dark:bg-black/80 dark:text-white"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="container-page mt-4 grid gap-2 rounded-lg border border-black/10 bg-white/95 p-3 shadow-xl md:hidden dark:border-white/15 dark:bg-black/95">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-[#FFC300]/20 dark:text-neutral-200 dark:hover:bg-[#FFC300]/15"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </motion.header>
  );
}