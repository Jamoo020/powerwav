import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/lib/content";

export default function FaqPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="FAQ" title="Common questions about AV projects in Kenya" description="We help clients make informed decisions around scope, installation, support, and long-term value." />
        <div className="mt-12 grid gap-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-[2rem] border border-[var(--color-border)] bg-white p-6 transition hover:border-[var(--color-primary)]">
              <summary className="cursor-pointer list-none text-lg font-semibold text-slate-950">{faq.question}</summary>
              <p className="mt-4 text-[var(--color-muted)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
