import Link from "next/link";
import { ArrowRight, BadgeCheck } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/lib/content";

export default function ServicesPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Services" title="Premium AV solutions for every operational need" description="Every service is planned around business outcomes, user experience, and long-term reliability." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
              <div className="inline-flex rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-primary)]">{service.title}</div>
              <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">{service.description}</p>
              <ul className="mt-8 space-y-3 text-sm text-slate-600">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3"><BadgeCheck size={16} className="text-[var(--color-primary)]" />{feature}</li>
                ))}
              </ul>
              <p className="mt-8 text-sm leading-7 text-slate-500">{service.accent}</p>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
                Request a tailored proposal <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
