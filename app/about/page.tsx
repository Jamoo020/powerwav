import Link from "next/link";
import { ArrowRight, ShieldCheck } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="About PowerWave AV" title="A trusted AV partner for premium spaces and reliable performance" description="We design and deliver systems that support communication, operations, and customer experience with clarity and confidence." />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
            <p className="text-lg leading-8 text-[var(--color-muted)]">
              PowerWave AV brings together technical depth, elegant design, and practical support to create AV experiences that feel professional from the first consultation to the final handover.
            </p>
            <div className="mt-10 space-y-6">
              <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-primary)]">Our approach</p>
                <p className="mt-3 text-slate-700">We start with your goals and space, then design systems that deliver clarity, control, and an intuitive user experience. Every solution is purpose-built for the client’s operational needs.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Mission", "Deliver dependable AV that helps organisations communicate with clarity and confidence."],
                  ["Vision", "Be Kenya’s trusted partner for premium, future-ready AV solutions."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-[1.75rem] border border-[var(--color-border)] bg-slate-50 p-6">
                    <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-primary)]">{title}</p>
                    <p className="mt-3 text-slate-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-[var(--color-primary)] bg-[#F7FAFF] p-10">
            <h3 className="text-2xl font-semibold text-slate-950">What sets us apart</h3>
            <ul className="mt-8 space-y-4 text-slate-700">
              {[
                "Detailed site surveys and thoughtful system designs",
                "Clean installations with minimal disruption",
                "Training and documentation for every handover",
                "Responsive local support for service continuity",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 text-[var(--color-primary)]" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">Our commitment</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              ["Design Excellence", "We ensure every system is designed for your space, your people, and your workflows."],
              ["Operational Reliability", "Our installations are built to perform with consistency over time."],
              ["Future Ready", "We recommend upgrades and scalable systems that evolve with your business."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[1.75rem] border border-[var(--color-border)] bg-slate-50 p-8">
                <p className="text-lg font-semibold text-slate-950">{title}</p>
                <p className="mt-4 text-[var(--color-muted)]">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#105cda]">Contact our team <ArrowRight size={18} /></Link>
            <Link href="/services" className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">Explore services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
