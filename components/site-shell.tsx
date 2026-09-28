"use client";

import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle } from "@/components/icons";
import { services, industries } from "@/lib/content";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Solutions", href: "/industries" },
  { label: "Case Studies", href: "/projects/case-studies" },
  { label: "Buyer Guides", href: "/resources/buyer-guides" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 text-base font-semibold tracking-[0.3em] uppercase text-slate-900">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">PW</span>
              PowerWave AV
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
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

          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-slate-900">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:+254715825819" className="hidden rounded-full border border-[var(--color-border)] bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 md:inline-flex hover:bg-slate-100">
              Call Now
            </a>
            <a href="https://wa.me/254715825819" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#105cda]">
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
              className="overflow-hidden border-t border-[var(--color-border)] bg-white md:hidden"
            >
              <div className="space-y-2 px-6 py-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
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
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
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
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Services</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {services.slice(0, 4).map((item) => (
                <li key={item.title}><Link href={item.href} className="transition hover:text-slate-900">{item.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Industries</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {industries.slice(0, 4).map((item) => (
                <li key={item.name}><Link href={item.href} className="transition hover:text-slate-900">{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Resources</h3>
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
