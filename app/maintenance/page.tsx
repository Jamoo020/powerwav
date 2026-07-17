import Link from "next/link";
import { ArrowRight, BadgeCheck } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

export default function MaintenancePage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Maintenance" title="Protect your AV investment with proactive support" description="Reliable systems require consistent care, clear communication, and fast response when issues arise." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {[
            ["Preventive maintenance", "Scheduled checks, software updates, performance reviews, and long-term reliability planning."],
            ["Repairs & calibration", "Fast resolution for faults, signal issues, speaker tuning, camera alignment, and system drift."],
            ["Technical support", "Responsive assistance for users, facility teams, and business operations that depend on AV daily."],
            ["Upgrades", "Modernisation support for older systems, new integrations, and evolving business requirements."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
              <p className="text-xl font-semibold text-slate-950">{title}</p>
              <p className="mt-4 text-[var(--color-muted)]">{text}</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-slate-50 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
                <BadgeCheck size={16} /> Scheduled support available
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-[2rem] border border-[var(--color-primary)]/20 bg-[rgba(20,110,245,0.08)] p-10 text-center">
          <h2 className="text-2xl font-semibold text-slate-950">Keep your systems reliable year-round</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--color-muted)]">We help organisations avoid downtime, maintain user confidence, and maximise the value of every installation.</p>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#105cda]">Book maintenance support <ArrowRight size={18} /></Link>
        </div>
      </section>
    </div>
  );
}
