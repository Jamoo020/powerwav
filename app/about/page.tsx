import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

export default function AboutPage() {
  return (
    <div className="bg-slate-950">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="About PowerWave AV" title="A trusted AV partner for premium spaces and reliable performance" description="We design and deliver systems that support communication, operations, and customer experience with clarity and confidence." />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-lg leading-8 text-slate-300">
              PowerWave AV brings together technical depth, elegant design, and practical support to create AV experiences that feel professional from the first consultation to the final handover.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Mission", "Deliver dependable AV that helps organisations communicate with clarity and confidence."],
                ["Vision", "Be Kenya’s trusted partner for premium, future-ready AV solutions."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">{title}</p>
                  <p className="mt-2 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/10 p-8">
            <h3 className="text-2xl font-semibold text-white">What sets us apart</h3>
            <ul className="mt-6 space-y-4 text-slate-300">
              {[
                "Professional installation standards",
                "Thoughtful design for hospitality, corporate, and education spaces",
                "Responsive maintenance and after-sales care",
                "Clear communication and project transparency",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3"><ShieldCheck className="mt-1 text-cyan-300" size={18} />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 lg:p-10">
          <h2 className="text-2xl font-semibold text-white">Our commitment</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {[
              ["Quality", "Every deployment is designed to look polished, perform reliably, and remain easy to maintain."],
              ["Support", "We stay involved after installation with maintenance, repairs, and technical assistance."],
              ["Partnership", "We work closely with clients to create systems that grow with their business."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
                <p className="text-lg font-semibold text-white">{title}</p>
                <p className="mt-3 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400">Contact our team <ArrowRight size={18} /></Link>
            <Link href="/services" className="rounded-full border border-white/10 px-6 py-3 font-semibold text-white hover:bg-white/10">Explore services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
