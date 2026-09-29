"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

const fieldClassName = "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15";

export default function BookRepairPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-slate-50 text-slate-900">
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-7 sm:p-10">
            <CheckCircle size={32} className="text-[var(--color-primary)]" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">Demonstration confirmation</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Repair request form preview</h1>
            <p className="mt-4 leading-7 text-slate-600">This interface is a demonstration only. Your information has not been sent to PowerWave, saved, or used to create a repair ticket.</p>
            <div className="mt-7 rounded-xl border border-dashed border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Example ticket format · not a real ticket</p>
              <p className="mt-2 font-mono text-2xl font-semibold text-slate-950">PW-2026-0001</p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={() => setSubmitted(false)} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#105cda]">Submit another demo request</button>
              <Link href="/repairs/track" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">View demo tracking <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-14 lg:px-8 lg:py-18">
        <SectionHeading eyebrow="Book a Repair" title="Tell us about your equipment" description="Share a few details so the PowerWave team can review the equipment and issue. Service availability is confirmed separately." />
        <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="mt-10 space-y-8 rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:p-9">
          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-4 text-lg font-semibold text-slate-950">Customer details</legend>
            <label className="text-sm font-medium text-slate-700">Full name<input name="fullName" autoComplete="name" required className={fieldClassName} /></label>
            <label className="text-sm font-medium text-slate-700">Phone number<input name="phone" type="tel" autoComplete="tel" required className={fieldClassName} /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Email address<input name="email" type="email" autoComplete="email" required className={fieldClassName} /></label>
          </fieldset>

          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-4 text-lg font-semibold text-slate-950">Equipment details</legend>
            <label className="text-sm font-medium text-slate-700">Equipment category
              <select name="category" required defaultValue="" className={fieldClassName}>
                <option value="" disabled>Select a category</option>
                <option>TVs & Displays</option><option>Soundbars & Speakers</option><option>Home Theatre Systems</option><option>Projectors</option><option>Commercial AV Equipment</option><option>Other supported AV equipment</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">Brand<input name="brand" required placeholder="For example, Samsung, Sony, LG or JBL" className={fieldClassName} /></label>
            <label className="text-sm font-medium text-slate-700">Model<input name="model" required className={fieldClassName} /></label>
            <label className="text-sm font-medium text-slate-700">Serial number <span className="font-normal text-slate-500">(optional)</span><input name="serialNumber" className={fieldClassName} /></label>
          </fieldset>

          <fieldset className="grid gap-5">
            <legend className="mb-4 text-lg font-semibold text-slate-950">Describe the problem</legend>
            <label className="text-sm font-medium text-slate-700">Issue or problem<textarea name="problem" required rows={4} className={fieldClassName} placeholder="What is happening, and when did it start?" /></label>
            <label className="text-sm font-medium text-slate-700">Additional information <span className="font-normal text-slate-500">(optional)</span><textarea name="additionalInformation" rows={3} className={fieldClassName} placeholder="Anything else that may help us understand the issue" /></label>
          </fieldset>

          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-4 text-lg font-semibold text-slate-950">Service preferences</legend>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Preferred service option
              <select name="serviceOption" required defaultValue="" className={fieldClassName}>
                <option value="" disabled>Select a preference</option><option>Workshop assessment</option><option>On-site assessment, subject to availability</option><option>Not sure yet</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">Preferred date<input name="preferredDate" type="date" className={fieldClassName} /></label>
            <label className="text-sm font-medium text-slate-700">Preferred time<input name="preferredTime" type="time" className={fieldClassName} /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Additional notes <span className="font-normal text-slate-500">(optional)</span><textarea name="notes" rows={3} className={fieldClassName} /></label>
          </fieldset>

          <div className="rounded-xl border border-[var(--color-border)] bg-slate-50 p-5">
            <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
              <input name="confirmation" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]" />
              <span>I confirm these details are accurate and understand that this form is a demonstration. It does not contact PowerWave or create a saved repair ticket.</span>
            </label>
          </div>
          <p role="status" className="text-sm leading-6 text-slate-500">Demo only: form details stay in this page and are not sent or stored.</p>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda]">Submit Repair Request <ArrowRight size={17} /></button>
            <Link href="/repairs" className="text-sm font-semibold text-slate-600 hover:text-slate-950">Back to repair support</Link>
          </div>
        </form>
      </section>
    </div>
  );
}