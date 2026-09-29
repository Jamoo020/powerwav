"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { RepairWorkflow } from "@/components/repair-workflow";
import { SectionHeading } from "@/components/section-heading";

const demoTicket = "PW-2026-0001";
const fieldClassName = "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15";

export default function TrackRepairPage() {
  const [ticketNumber, setTicketNumber] = useState(demoTicket);
  const [showDemo, setShowDemo] = useState(true);
  const [error, setError] = useState("");

  function handleTrack(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ticketNumber.trim().toUpperCase() === demoTicket) {
      setShowDemo(true);
      setError("");
      return;
    }
    setShowDemo(false);
    setError("This frontend demonstration only includes the clearly labelled example ticket shown above. No live repair records can be looked up yet.");
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8 lg:py-18">
        <SectionHeading eyebrow="Track a Repair" title="Check a repair status" description="The tracker below demonstrates how a customer status page may look. It is not connected to live repair records." />

        <div className="mt-8 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-5">
          <p className="text-sm font-semibold text-slate-950">Demo ticket only</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">Example: <span className="font-mono font-semibold text-slate-900">{demoTicket}</span>. This example is not a real customer record and no repair history is stored here.</p>
        </div>

        <form onSubmit={handleTrack} className="mt-6 grid gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
          <label className="text-sm font-medium text-slate-700">Ticket number
            <input value={ticketNumber} onChange={(event) => setTicketNumber(event.target.value)} required className={fieldClassName} placeholder="PW-2026-0001" />
          </label>
          <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda]">Track Repair <ArrowRight size={16} /></button>
          {error ? <p role="alert" className="text-sm leading-6 text-red-700 sm:col-span-2">{error}</p> : null}
        </form>

        {showDemo ? (
          <section aria-labelledby="demo-ticket-heading" className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
            <div className="flex flex-col gap-3 border-b border-[var(--color-border)] bg-slate-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Illustrative demo record</p>
                <h2 id="demo-ticket-heading" className="mt-2 text-xl font-semibold">Ticket: {demoTicket}</h2>
              </div>
              <span className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold">Diagnosis + Quote</span>
            </div>
            <div className="grid gap-8 p-6 sm:p-7 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Equipment details</h3>
                <dl className="mt-4 divide-y divide-[var(--color-border)] text-sm">
                  <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Equipment</dt><dd className="text-right font-medium text-slate-800">Samsung TV</dd></div>
                  <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Model</dt><dd className="text-right font-medium text-slate-800">Example model</dd></div>
                  <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Current status</dt><dd className="text-right font-semibold text-[var(--color-primary)]">Diagnosis + Quote</dd></div>
                </dl>
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Latest update</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">Demo status: equipment inspected and a repair quotation prepared.</p>
                </div>
                <div className="mt-3 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Next expected step</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-800">Awaiting Customer Approval. Parts and repair work proceed only after approval.</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Repair timeline</h3>
                <p className="mt-1 text-sm text-slate-600">Current stage: diagnosis and quotation are one step.</p>
                <div className="mt-5"><RepairWorkflow currentStage={3} /></div>
              </div>
            </div>
          </section>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-white p-5">
          <p className="text-sm leading-6 text-slate-600">Need help with a repair request? Contact the PowerWave support team.</p>
          <div className="flex gap-4">
            <Link href="/contact" className="text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">Contact Support</Link>
            <Link href="/repairs/book" className="text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">Book a Repair</Link>
          </div>
        </div>
      </section>
    </div>
  );
}