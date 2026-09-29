import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageCircle } from "@/components/icons";
import { RepairWorkflow } from "@/components/repair-workflow";
import { SectionHeading } from "@/components/section-heading";

const equipmentTypes = [
  "TVs & Displays",
  "Soundbars & Speakers",
  "Home Theatre Systems",
  "Projectors",
  "Commercial AV Equipment",
  "Other supported AV equipment",
];

const processSteps = [
  ["1", "Tell us what is wrong", "Share your equipment details and describe the issue."],
  ["2", "Arrange an appointment", "Our team can confirm the next suitable service step."],
  ["3", "Diagnosis and quotation", "After assessment, a repair quote is prepared for your approval."],
  ["4", "Repair and testing", "Once approved and parts are available, work proceeds to testing."],
];

export default function RepairsPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">Repair & Technical Support</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-slate-950 sm:text-5xl heading-hero">Care and repair for supported AV equipment</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              PowerWave provides equipment diagnosis, repair, maintenance and technical support for selected home and commercial AV products. Service availability depends on the equipment, condition and parts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/repairs/book" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda]">
                Book a Repair <ArrowRight size={17} />
              </Link>
              <Link href="/repairs/track" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                Track a Repair
              </Link>
            </div>
          </div>
          <aside className="rounded-2xl border border-[var(--color-border)] bg-slate-50 p-6 sm:p-8">
            <p className="text-sm font-semibold text-slate-950">Equipment examples</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">We can confirm whether a product is supported after reviewing its details.</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {equipmentTypes.map((type) => (
                <li key={type} className="flex items-start gap-2 text-sm text-slate-700">
                  <BadgeCheck size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" /> {type}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-[var(--color-border)] pt-4 text-xs leading-5 text-slate-500">
              Samsung, Sony, LG and JBL are examples of equipment brands that may be supported for selected models. PowerWave does not claim manufacturer-authorised service-centre status.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading eyebrow="How it works" title="A clear process, from request to return" description="Your equipment is assessed first. A quotation is prepared for your approval before any quoted repair work proceeds." />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map(([number, title, description]) => (
            <li key={number} className="rounded-xl border border-[var(--color-border)] bg-white p-6">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">Step {number}</span>
              <h2 className="mt-3 text-lg font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-[var(--color-border)] bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Repair workflow" title="Follow each service stage" description="After diagnosis and quotation, the next stage is customer approval. Parts ordering and repair begin only after approval." />
          <div className="mt-10">
            <RepairWorkflow />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-white p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Need help with an equipment issue?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Send a repair request or contact our team to discuss support for your equipment.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/repairs/book" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#105cda]">Book a Repair <ArrowRight size={16} /></Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"><MessageCircle size={16} /> Contact Support</Link>
          </div>
        </div>
      </section>
    </div>
  );
}