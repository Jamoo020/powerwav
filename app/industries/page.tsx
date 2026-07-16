import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { industries } from "@/lib/content";

export default function IndustriesPage() {
  return (
    <div className="bg-slate-950">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Industries" title="AV systems tailored to the realities of each sector" description="We adapt each installation to the environment, audience, and operational goals of the client." />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {industries.map((industry) => (
            <article key={industry.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold text-white">{industry.name}</h2>
              <p className="mt-4 text-slate-300">{industry.description}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Challenges</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-400">
                    {industry.challenges.map((item) => <li key={item} className="flex items-center gap-2"><BadgeCheck size={16} className="text-cyan-300" />{item}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Recommended systems</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-400">
                    {industry.systems.map((item) => <li key={item} className="flex items-center gap-2"><BadgeCheck size={16} className="text-cyan-300" />{item}</li>)}
                  </ul>
                </div>
              </div>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                Book a consultation <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
