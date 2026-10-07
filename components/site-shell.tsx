"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { Phone, MessageCircle } from "@/components/icons";
import { services, industries } from "@/lib/content";

type NavItem =
  | { label: string; href: string; children?: never }
  | { label: string; children: Array<{ label: string; href: string }>; href?: never };

const navigationItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Solutions",
    children: [
      { label: "Corporate / Boardrooms", href: "/services" },
      { label: "Hotels & Restaurants", href: "/industries" },
      { label: "Churches & Worship", href: "/industries" },
      { label: "Education / Schools", href: "/industries" },
      { label: "Industries", href: "/industries" },
      { label: "Projects / Case Studies", href: "/projects/case-studies" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  {
    label: "Resources",
    children: [
      { label: "Case Studies", href: "/projects/case-studies" },
      { label: "Buyer Guides", href: "/resources/buyer-guides" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    label: "Support",
    children: [
      { label: "Book a Repair", href: "/repairs/book" },
      { label: "Track a Repair", href: "/repairs/track" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const desktopResourcesRef = useRef<HTMLDetailsElement | null>(null);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleMobileMenuKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      closeMobileMenu();
      mobileMenuButtonRef.current?.focus();
    }
  }

  function handleDesktopResourcesKeyDown(event: KeyboardEvent<HTMLDetailsElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.currentTarget.open = false;
      event.currentTarget.querySelector("summary")?.focus();
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link prefetch={false} href="/" className="flex shrink-0 items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 sm:text-base">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">PW</span>
            PowerWave AV
          </Link>
          <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center justify-center gap-1 text-[13px] text-slate-600 xl:flex 2xl:gap-2">
            {navigationItems.map((link) => typeof link.href === "string" ? (
              <Link key={link.href} href={link.href} prefetch={false} className="whitespace-nowrap rounded-md px-2 py-2 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40">
                {link.label}
              </Link>
            ) : (
              <details key={link.label} ref={desktopResourcesRef} onKeyDown={handleDesktopResourcesKeyDown} className="group relative">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1 whitespace-nowrap rounded-md px-2 py-2 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 [&::-webkit-details-marker]:hidden">
                  {link.label}
                  <ChevronDown size={14} className="transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="absolute left-0 top-full z-50 mt-2 min-w-52 rounded-lg border border-[var(--color-border)] bg-white p-1.5 shadow-lg">
                  {link.children.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      onClick={() => {
                        if (desktopResourcesRef.current) desktopResourcesRef.current.open = false;
                      }}
                      className="block rounded-md px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <a href="tel:+254715825819" className="hidden rounded-full border border-[var(--color-border)] bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 xl:inline-flex">
              Call Now
            </a>
            <a href="https://wa.me/254715825819" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#105cda] sm:px-4">
              <MessageCircle size={16} /> <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button
              ref={mobileMenuButtonRef}
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-site-navigation"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 xl:hidden"
            >
              {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
          <nav id="mobile-site-navigation" aria-label="Mobile navigation" onKeyDown={handleMobileMenuKeyDown} hidden={!mobileMenuOpen} className="w-full border-t border-[var(--color-border)] pt-3 xl:hidden">
            <div className="grid gap-1">
              {navigationItems.map((link) => typeof link.href === "string" ? (
                <Link key={link.href} href={link.href} prefetch={false} onClick={closeMobileMenu} className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40">
                  {link.label}
                </Link>
              ) : (
                <details key={link.label} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40 [&::-webkit-details-marker]:hidden">
                    {link.label}
                    <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="grid gap-1 pb-1 pl-4">
                    {link.children.map((item) => (
                      <Link key={item.href} href={item.href} prefetch={false} onClick={closeMobileMenu} className="rounded-md px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/40">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </nav>
        </div>
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
                <li key={item.title}><Link href={item.href} prefetch={false} className="transition hover:text-slate-900">{item.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Industries</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {industries.slice(0, 4).map((item) => (
                <li key={item.name}><Link href={item.href} prefetch={false} className="transition hover:text-slate-900">{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li><Link href="/blog" prefetch={false} className="transition hover:text-slate-900">Insights & guides</Link></li>
              <li><Link href="/faq" prefetch={false} className="transition hover:text-slate-900">FAQ</Link></li>
              <li><Link href="/contact" prefetch={false} className="transition hover:text-slate-900">Contact</Link></li>
              <li><Link href="/privacy-policy" prefetch={false} className="transition hover:text-slate-900">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--color-border)] px-6 py-6 text-sm text-slate-500 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>© 2026 PowerWave AV. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" prefetch={false} className="transition hover:text-slate-900">Terms</Link>
              <Link href="/privacy-policy" prefetch={false} className="transition hover:text-slate-900">Privacy</Link>
              <a href="https://www.instagram.com/pow.e_r/" target="_blank" rel="noreferrer" className="transition hover:text-slate-900">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
