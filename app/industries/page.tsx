import Link from "next/link";
import { ArrowRight, BadgeCheck } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { industries } from "@/lib/content";

export default function IndustriesPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Industries" title="AV systems tailored to the realities of each sector" description="We adapt each installation to the environment, audience, and operational goals of the client." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {industries.map((industry) => (
            <article key={industry.name} className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-950">{industry.name}</h2>
                <span className="rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-primary)]">Sector</span>
              </div>
              <p className="mt-4 text-[var(--color-muted)]">{industry.description}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-primary)]">Challenges</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    {industry.challenges.map((item) => (
                      <li key={item} className="flex items-center gap-3"><BadgeCheck size={16} className="text-[var(--color-primary)]" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-primary)]">Recommended systems</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    {industry.systems.map((item) => (
                      <li key={item} className="flex items-center gap-3"><BadgeCheck size={16} className="text-[var(--color-primary)]" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
                Book a consultation <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
