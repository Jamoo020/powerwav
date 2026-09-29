"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { RepairWorkflow } from "@/components/repair-workflow";
import { SectionHeading } from "@/components/section-heading";
import { repairStatusOrder, type RepairTrackingTicket } from "@/lib/repairs/types";

const fieldClassName = "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15";

export default function TrackRepairPage() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [ticket, setTicket] = useState<RepairTrackingTicket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTicket(null);
    setError("");
    setIsLoading(true);

    try {
      const query = new URLSearchParams({ ticket: ticketNumber.trim(), phone: phone.trim() });
      const response = await fetch(`/api/repairs/track?${query.toString()}`, { cache: "no-store" });
      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success !== true || !result.ticket) {
        setError(typeof result?.error === "string" ? result.error : "Ticket not found or verification failed.");
        return;
      }

      setTicket(result.ticket as RepairTrackingTicket);
    } catch {
      setError("Repair tracking is temporarily unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8 lg:py-18">
        <SectionHeading eyebrow="Track a Repair" title="Check a repair status" description="Enter your repair ticket number and the phone number provided with your request. Both are required to view ticket details." />

        <form onSubmit={handleTrack} className="mt-6 grid gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:grid-cols-2 sm:items-end sm:p-6">
          <label className="text-sm font-medium text-slate-700">Ticket number
            <input value={ticketNumber} onChange={(event) => setTicketNumber(event.target.value)} required autoComplete="off" className={fieldClassName} placeholder="PW-YYYY-0001" />
          </label>
          <label className="text-sm font-medium text-slate-700">Phone number
            <input value={phone} onChange={(event) => setPhone(event.target.value)} required autoComplete="tel" inputMode="tel" className={fieldClassName} placeholder="Phone used for the request" />
          </label>
          <button type="submit" disabled={isLoading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda] disabled:cursor-wait disabled:opacity-70 sm:col-span-2">{isLoading ? "Checking..." : "Track Repair"} <ArrowRight size={16} /></button>
          {error ? <p role="alert" className="text-sm leading-6 text-red-700 sm:col-span-2">{error}</p> : null}
        </form>

        {ticket ? (
          <section aria-labelledby="repair-ticket-heading" className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
            <div className="flex flex-col gap-3 border-b border-[var(--color-border)] bg-slate-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Repair ticket</p>
                <h2 id="repair-ticket-heading" className="mt-2 text-xl font-semibold">Ticket: {ticket.ticketNumber}</h2>
              </div>
              <span className="w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold">{ticket.statusLabel}</span>
            </div>
            <div className="grid gap-8 p-6 sm:p-7 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Equipment details</h3>
                <dl className="mt-4 divide-y divide-[var(--color-border)] text-sm">
                  <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Category</dt><dd className="text-right font-medium text-slate-800">{ticket.equipment.category}</dd></div>
                  <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Equipment</dt><dd className="text-right font-medium text-slate-800">{ticket.equipment.brand}</dd></div>
                  <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Model</dt><dd className="text-right font-medium text-slate-800">{ticket.equipment.model}</dd></div>
                  <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Current status</dt><dd className="text-right font-semibold text-[var(--color-primary)]">{ticket.statusLabel}</dd></div>
                  <div className="flex justify-between gap-4 py-3"><dt className="text-slate-500">Request received</dt><dd className="text-right font-medium text-slate-800">{new Date(ticket.createdAt).toLocaleString()}</dd></div>
                </dl>
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Issue described</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{ticket.issueDescription}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Repair progress</h3>
                <p className="mt-1 text-sm text-slate-600">Last status update: {new Date(ticket.statusUpdatedAt).toLocaleString()}</p>
                <div className="mt-5"><RepairWorkflow currentStage={repairStatusOrder.indexOf(ticket.status)} /></div>
              </div>
            </div>
            <div className="border-t border-[var(--color-border)] p-6 sm:p-7">
              <h3 className="text-lg font-semibold text-slate-950">Customer updates</h3>
              {ticket.timeline.length ? (
                <ol className="mt-5 space-y-4">
                  {ticket.timeline.map((event, index) => (
                    <li key={`${event.createdAt}-${event.eventType}-${index}`} className="flex gap-3 border-l-2 border-[var(--color-primary)]/30 pl-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{event.statusLabel ?? "Update"}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{event.customerUpdate}</p>
                        <time dateTime={event.createdAt} className="mt-2 block text-xs text-slate-500">{new Date(event.createdAt).toLocaleString()}</time>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-slate-600">There are no customer-visible updates yet.</p>
              )}
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