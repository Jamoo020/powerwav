import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/lib/content";

export default function ServicesPage() {
  return (
    <div className="bg-slate-950">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Services" title="Premium AV solutions for every operational need" description="Every service is planned around business outcomes, user experience, and long-term reliability." />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">{service.title}</div>
              <p className="mt-5 text-lg leading-8 text-slate-300">{service.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-400">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2"><BadgeCheck size={16} className="text-cyan-300" />{feature}</li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-7 text-slate-400">{service.accent}</p>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                Request a tailored proposal <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
