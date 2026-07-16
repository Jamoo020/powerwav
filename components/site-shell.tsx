import Link from "next/link";
import { ArrowRight, Phone, MessageCircle, ChevronRight } from "lucide-react";
import { services, industries, faqs, testimonials } from "@/lib/content";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Projects", href: "/projects" },
  { label: "Maintenance", href: "/maintenance" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-[0.2em] text-white uppercase">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">PW</span>
            PowerWave AV
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href="tel:+254715825819" className="hidden rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 md:inline-flex">
              Call Now
            </a>
            <a href="https://wa.me/254715825819" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-slate-950/95">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <h2 className="text-xl font-semibold text-white">PowerWave AV</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              Premium audio visual systems for businesses, hospitality venues, schools, churches, and public institutions across Kenya.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <a href="tel:+254715825819" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 hover:bg-white/5"><Phone size={16} /> 0715 825 819</a>
              <a href="mailto:info@powerwaveav.com" className="rounded-full border border-white/10 px-3 py-2 hover:bg-white/5">info@powerwaveav.com</a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Services</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {services.slice(0, 4).map((item) => (
                <li key={item.title}><Link href={item.href} className="hover:text-white">{item.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Industries</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {industries.slice(0, 4).map((item) => (
                <li key={item.name}><Link href={item.href} className="hover:text-white">{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li><Link href="/blog" className="hover:text-white">Insights & guides</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-6 text-sm text-slate-500 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>© 2026 PowerWave AV. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
              <a href="https://www.instagram.com/pow.e_r/" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
