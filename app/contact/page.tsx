import Link from "next/link";
import { ArrowRight, MessageCircle, Phone, Mail, MapPin } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

export default function ContactPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Contact" title="Let’s plan your next AV installation" description="Whether you need a boardroom upgrade, a new restaurant sound system, or a full-site security deployment, our team is ready to help." />
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
            <h2 className="text-3xl font-semibold text-slate-950">Speak with our team</h2>
            <div className="mt-8 space-y-5 text-slate-700">
              <p className="flex items-center gap-3 text-base"><Phone size={18} className="text-[var(--color-primary)]" /> 0116 882 307</p>
              <p className="flex items-center gap-3 text-base"><Mail size={18} className="text-[var(--color-primary)]" /> info@powerwaveav.com</p>
              <p className="flex items-center gap-3 text-base"><MapPin size={18} className="text-[var(--color-primary)]" /> Nairobi, Kenya</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="https://wa.me/254116882307" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#105cda]">
                <MessageCircle size={18} /> WhatsApp us
              </a>
              <Link href="/faq" className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">View FAQ</Link>
            </div>
          </div>
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
              <iframe
                title="PowerWave AV Nairobi location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.26699512992!2d36.821946315333874!3d-1.292065699999992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10a0d6536fee%3A0xa5879d5b8f8c5ef1!2sNairobi%20City%20Centre!5e0!3m2!1sen!2ske!4v0000000000000"
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <form className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block text-sm text-slate-700"><span className="mb-2 block font-semibold">Name</span><input className="w-full rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900" placeholder="Your name" /></label>
                <label className="block text-sm text-slate-700"><span className="mb-2 block font-semibold">Company</span><input className="w-full rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900" placeholder="Company name" /></label>
                <label className="block text-sm text-slate-700"><span className="mb-2 block font-semibold">Phone</span><input className="w-full rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900" placeholder="Phone number" /></label>
                <label className="block text-sm text-slate-700"><span className="mb-2 block font-semibold">Email</span><input className="w-full rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900" placeholder="you@company.com" /></label>
              </div>
              <label className="mt-5 block text-sm text-slate-700"><span className="mb-2 block font-semibold">Service interested</span><input className="w-full rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900" placeholder="Boardroom, sound, CCTV, maintenance..." /></label>
              <label className="mt-5 block text-sm text-slate-700"><span className="mb-2 block font-semibold">Budget</span><input className="w-full rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900" placeholder="Estimated budget" /></label>
              <label className="mt-5 block text-sm text-slate-700"><span className="mb-2 block font-semibold">Message</span><textarea className="min-h-36 w-full rounded-2xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900" placeholder="Tell us about your project" /></label>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#105cda]">Send enquiry <ArrowRight size={18} /></button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
