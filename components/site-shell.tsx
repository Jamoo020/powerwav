"use client";

import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Phone, MessageCircle } from "@/components/icons";
import { services, industries } from "@/lib/content";

type MenuItem = { label: string; href: string };

const solutionLinks: MenuItem[] = [
  { label: "Home Entertainment", href: "/shop" },
  { label: "Commercial AV", href: "/services" },
  { label: "CCTV & Security", href: "/services" },
  { label: "Networking", href: "/services" },
  { label: "Other AV Solutions", href: "/industries" },
  { label: "Projects / Solutions Delivered", href: "/projects" },
];

const resourceLinks: MenuItem[] = [
  { label: "Case Studies", href: "/projects/case-studies" },
  { label: "Buyer Guides", href: "/resources/buyer-guides" },
  { label: "Blog", href: "/blog" },
];

const supportLinks: MenuItem[] = [
  { label: "Book a Repair", href: "/maintenance" },
  { label: "Track a Repair", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Support", href: "/contact" },
];

type NavLink =
  | { type: "link"; label: string; href: string }
  | { type: "dropdown"; label: string; children: MenuItem[] };

const navLinks: NavLink[] = [
  { type: "link", label: "Home", href: "/" },
  { type: "link", label: "About", href: "/about" },
  { type: "dropdown", label: "Solutions", children: solutionLinks },
  { type: "link", label: "Services", href: "/services" },
  { type: "link", label: "Shop", href: "/shop" },
  { type: "dropdown", label: "Resources", children: resourceLinks },
  { type: "dropdown", label: "Support", children: supportLinks },
  { type: "link", label: "Contact", href: "/contact" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 shadow-[0_2px_12px_rgba(11,31,58,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:flex-nowrap lg:gap-4 xl:px-8">
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap text-[15px] font-semibold tracking-[0.2em] uppercase text-slate-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">PW</span>
              PowerWave AV
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center rounded-xl border border-[var(--color-border)] bg-white p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Toggle navigation menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-2 text-[13px] text-slate-600 lg:flex xl:gap-x-3 2xl:gap-x-4">
            {navLinks.map((link) => link.type === "dropdown" ? (
              <div key={link.label} className="relative">
                <button
                  type="button"
                  aria-expanded={openDropdown === link.label}
                  aria-haspopup="true"
                  aria-controls={`desktop-${link.label.toLowerCase()}-menu`}
                  onClick={() => setOpenDropdown((open) => open === link.label ? null : link.label)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setOpenDropdown(null);
                  }}
                  className="inline-flex items-center gap-1 whitespace-nowrap px-1 py-2 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
                >
                  {link.label}
                  <ChevronDown size={14} className={`transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openDropdown === link.label ? (
                    <motion.div
                      id={`desktop-${link.label.toLowerCase()}-menu`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 mt-2 w-52 rounded-xl border border-[var(--color-border)] bg-white p-1.5 shadow-[var(--shadow-card-hover)]"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={link.label === "Shop"
                  ? "whitespace-nowrap rounded-full bg-[var(--color-primary)]/10 px-3 py-2 font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/15"
                  : "whitespace-nowrap px-1 py-2 transition hover:text-[var(--color-primary)]"}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a href="tel:+254715825819" className="hidden rounded-full border border-[var(--color-border)] bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-100 lg:inline-flex xl:px-4 xl:text-sm">
              Call Now
            </a>
            <a href="https://wa.me/254715825819" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#105cda] xl:px-4 xl:text-sm">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] lg:hidden"
            >
              <div className="space-y-2 px-6 py-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    {link.type === "dropdown" ? (
                      <div>
                        <button
                          type="button"
                          aria-expanded={openDropdown === link.label}
                          aria-controls={`mobile-${link.label.toLowerCase()}-menu`}
                          onClick={() => setOpenDropdown((open) => open === link.label ? null : link.label)}
                          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                        >
                          {link.label}
                          <ChevronDown size={16} className={`transition-transform ${openDropdown === link.label ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {openDropdown === link.label ? (
                            <motion.div
                              id={`mobile-${link.label.toLowerCase()}-menu`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 border-l border-[var(--color-border)] py-1 pl-3">
                                {link.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    href={child.href}
                                    className="block rounded-xl px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                                    onClick={() => {
                                      setOpenDropdown(null);
                                      setMenuOpen(false);
                                    }}
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                        onClick={() => {
                          setOpenDropdown(null);
                          setMenuOpen(false);
                        }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
                <a href="tel:+254715825819" className="mt-2 block rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                  Call Now
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[var(--color-border)] bg-slate-50 text-slate-700">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8 lg:py-16">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">PowerWave AV</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              Premium audio visual systems for businesses, hospitality venues, schools, churches, and public institutions across Kenya.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
              <a href="tel:+254715825819" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-2 hover:bg-slate-50"><Phone size={16} /> 0715 825 819</a>
              <a href="mailto:info@powerwaveav.com" className="rounded-full border border-[var(--color-border)] bg-white px-3 py-2 hover:bg-slate-50">info@powerwaveav.com</a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Services</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {services.slice(0, 4).map((item) => (
                <li key={item.title}><Link href={item.href} className="transition hover:text-slate-900">{item.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Industries</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {industries.slice(0, 4).map((item) => (
                <li key={item.name}><Link href={item.href} className="transition hover:text-slate-900">{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li><Link href="/blog" className="transition hover:text-slate-900">Insights & guides</Link></li>
              <li><Link href="/faq" className="transition hover:text-slate-900">FAQ</Link></li>
              <li><Link href="/contact" className="transition hover:text-slate-900">Contact</Link></li>
              <li><Link href="/privacy-policy" className="transition hover:text-slate-900">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--color-border)] px-6 py-6 text-sm text-slate-500 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>© 2026 PowerWave AV. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="transition hover:text-slate-900">Terms</Link>
              <Link href="/privacy-policy" className="transition hover:text-slate-900">Privacy</Link>
              <a href="https://www.instagram.com/pow.e_r/" target="_blank" rel="noreferrer" className="transition hover:text-slate-900">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
