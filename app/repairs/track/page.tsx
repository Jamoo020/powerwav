"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { RepairWorkflow } from "@/components/repair-workflow";
import { SectionHeading } from "@/components/section-heading";
import {
  customerRepairPaymentCommitments,
  repairPaymentMethods,
  repairStatusOrder,
  type CustomerRepairPaymentCommitment,
  type RepairPaymentMethod,
  type RepairTrackingTicket,
} from "@/lib/repairs/types";

const fieldClassName = "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15";

function getClaimableBalance(ticket: RepairTrackingTicket): number {
  if (!ticket.paymentPlan) return 0;
  const pendingAmount = ticket.paymentPlan.paymentHistory
    .filter((payment) => payment.status === "PENDING_ADMIN_CONFIRMATION")
    .reduce((total, payment) => total + Number(payment.amount), 0);
  return Math.max(Number(ticket.paymentPlan.outstandingBalance) - pendingAmount, 0);
}

function getSuggestedPaymentAmount(ticket: RepairTrackingTicket): string {
  const required = Number(ticket.paymentPlan?.amountRequiredForCurrentPayment ?? 0);
  const claimable = getClaimableBalance(ticket);
  return Math.min(required > 0 ? required : claimable, claimable).toFixed(2);
}

export default function TrackRepairPage() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [ticket, setTicket] = useState<RepairTrackingTicket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [decisionAction, setDecisionAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [decisionMessage, setDecisionMessage] = useState("");
  const [decisionError, setDecisionError] = useState("");
  const [paymentRequirementChoice, setPaymentRequirementChoice] = useState<CustomerRepairPaymentCommitment>("FULL_PAYMENT");
  const [proposedPaymentAmount, setProposedPaymentAmount] = useState("");
  const [paymentChoiceLoading, setPaymentChoiceLoading] = useState(false);
  const [paymentChoiceMessage, setPaymentChoiceMessage] = useState("");
  const [paymentChoiceError, setPaymentChoiceError] = useState("");
  const [paymentClaimAmount, setPaymentClaimAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<RepairPaymentMethod>("MPESA");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentClaimLoading, setPaymentClaimLoading] = useState(false);
  const [paymentClaimSuccess, setPaymentClaimSuccess] = useState("");
  const [paymentClaimError, setPaymentClaimError] = useState("");

  async function fetchTicketDetails(): Promise<RepairTrackingTicket> {
    const query = new URLSearchParams({ ticket: ticketNumber.trim(), phone: phone.trim() });
    const response = await fetch(`/api/repairs/track?${query.toString()}`, { cache: "no-store" });
    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success !== true || !result.ticket) {
      throw new Error(typeof result?.error === "string" ? result.error : "Ticket not found or verification failed.");
    }

    return result.ticket as RepairTrackingTicket;
  }

  async function handleTrack(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTicket(null);
    setError("");
    setDecisionMessage("");
    setDecisionError("");
    setPaymentChoiceMessage("");
    setPaymentChoiceError("");
    setPaymentRequirementChoice("FULL_PAYMENT");
    setProposedPaymentAmount("");
    setPaymentClaimAmount("");
    setPaymentReference("");
    setPaymentMessage("");
    setPaymentClaimSuccess("");
    setPaymentClaimError("");
    setIsLoading(true);

    try {
      const trackedTicket = await fetchTicketDetails();
      setTicket(trackedTicket);
      if (trackedTicket.paymentPlan) {
        setPaymentRequirementChoice(
          trackedTicket.paymentPlan.paymentRequirement === "DEPOSIT" ? "DEPOSIT" : "FULL_PAYMENT",
        );
        setPaymentClaimAmount(getSuggestedPaymentAmount(trackedTicket));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Repair tracking is temporarily unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleQuoteDecision() {
    if (!ticket || !decisionAction || decisionLoading || !ticket.quoteReview) return;

    setDecisionLoading(true);
    setDecisionError("");
    setDecisionMessage("");
    try {
      const response = await fetch("/api/repairs/quote-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          ticketNumber: ticket.ticketNumber,
          phone,
          action: decisionAction,
        }),
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        throw new Error(result?.message ?? "The quote decision could not be saved.");
      }

      const message = decisionAction === "APPROVE"
        ? "Your quote was approved. The ticket is now awaiting parts."
        : "Your quote was declined and the repair request is closed.";
      setDecisionMessage(message);
      setDecisionAction(null);
      try {
        setTicket(await fetchTicketDetails());
      } catch {
        setDecisionError("Your decision was saved, but the updated ticket could not be refreshed. Please track the ticket again.");
      }
    } catch (requestError) {
      setDecisionError(requestError instanceof Error ? requestError.message : "The quote decision could not be saved.");
    } finally {
      setDecisionLoading(false);
    }
  }

  async function handlePaymentChoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ticket?.paymentPlan || paymentChoiceLoading) return;

    setPaymentChoiceLoading(true);
    setPaymentChoiceError("");
    setPaymentChoiceMessage("");
    try {
      const body: Record<string, unknown> = {
        ticketNumber: ticket.ticketNumber,
        phone,
        paymentRequirement: paymentRequirementChoice,
      };
      if (paymentRequirementChoice === "DEPOSIT") {
        body.depositAmount = proposedPaymentAmount;
      }

      const response = await fetch("/api/repairs/payment-choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(body),
      });
      const result = (await response.json().catch(() => null)) as { message?: string; paymentRequirementStatus?: string } | null;
      if (!response.ok) {
        throw new Error(result?.message ?? "The payment choice could not be saved.");
      }

      setPaymentChoiceMessage(result?.paymentRequirementStatus === "PENDING_ADMIN_REVIEW"
        ? "Your payment option request is pending admin review. It is not accepted until approved."
        : "Your payment option has been updated.");
      setProposedPaymentAmount("");
      setTicket(await fetchTicketDetails());
    } catch (requestError) {
      setPaymentChoiceError(requestError instanceof Error ? requestError.message : "The payment choice could not be saved.");
    } finally {
      setPaymentChoiceLoading(false);
    }
  }

  async function handlePaymentSubmission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ticket?.paymentPlan || paymentClaimLoading) return;

    setPaymentClaimLoading(true);
    setPaymentClaimError("");
    setPaymentClaimSuccess("");
    try {
      const response = await fetch("/api/repairs/payment-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          ticketNumber: ticket.ticketNumber,
          phone,
          amount: paymentClaimAmount,
          paymentMethod,
          referenceNumber: paymentReference,
          customerMessage: paymentMessage,
        }),
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        throw new Error(result?.message ?? "Payment submission could not be sent.");
      }
      setPaymentClaimSuccess("Payment submitted — awaiting confirmation.");
      setPaymentReference("");
      setPaymentMessage("");
      const updatedTicket = await fetchTicketDetails();
      setTicket(updatedTicket);
      setPaymentClaimAmount(getSuggestedPaymentAmount(updatedTicket));
    } catch (requestError) {
      setPaymentClaimError(requestError instanceof Error ? requestError.message : "Payment submission could not be sent.");
    } finally {
      setPaymentClaimLoading(false);
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

        {ticket && !decisionAction && decisionMessage ? (
          <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{decisionMessage}</p>
        ) : null}
        {ticket && !decisionAction && decisionError ? (
          <p role="alert" className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{decisionError}</p>
        ) : null}

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
            {ticket.status === "AWAITING_CUSTOMER_APPROVAL" ? (
              <section className="border-t border-[var(--color-border)] bg-sky-50/60 p-6 sm:p-7" aria-labelledby="repair-quote-heading">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">Customer decision required</p>
                    <h3 id="repair-quote-heading" className="mt-1 text-xl font-semibold text-slate-950">Repair Quote</h3>
                  </div>
                  {ticket.quoteReview ? (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
                      {ticket.quoteReview.quote.status === "ISSUED" ? "Issued" : ticket.quoteReview.quote.status}
                    </span>
                  ) : null}
                </div>

                {ticket.quoteReview ? (
                  <>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
                        <h4 className="text-sm font-semibold text-slate-900">Diagnosis</h4>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{ticket.quoteReview.diagnosis.findings}</p>
                      </div>
                      <div className="rounded-xl border border-[var(--color-border)] bg-white p-4">
                        <h4 className="text-sm font-semibold text-slate-900">Recommended action</h4>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{ticket.quoteReview.diagnosis.recommendedAction}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                      <span>Quote version <strong className="text-slate-900">{ticket.quoteReview.quote.version}</strong></span>
                      <span>Issued <time dateTime={ticket.quoteReview.quote.issuedAt} className="font-medium text-slate-900">{new Date(ticket.quoteReview.quote.issuedAt).toLocaleString()}</time></span>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
                      <div className="divide-y divide-[var(--color-border)]">
                        {ticket.quoteReview.quote.items.map((item, index) => (
                          <div key={`${item.itemType}-${index}`} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{item.description}</p>
                              <p className="mt-1 text-xs text-slate-500">{item.itemType === "LABOUR" ? "Labour" : item.itemType === "PART" ? "Part" : "Other"} · Quantity {item.quantity}</p>
                            </div>
                            <div className="text-sm text-slate-700 sm:text-right">
                              <span className="text-xs text-slate-500">Unit price </span>
                              {new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.quoteReview!.quote.currency }).format(Number(item.unitAmount))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2 border-t border-[var(--color-border)] bg-slate-50 p-4 text-sm">
                        <div className="flex justify-between gap-4 text-slate-600"><span>Subtotal</span><span>{new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.quoteReview.quote.currency }).format(Number(ticket.quoteReview.quote.subtotal))}</span></div>
                        {Number(ticket.quoteReview.quote.additionalCharges) > 0 ? <div className="flex justify-between gap-4 text-slate-600"><span>Additional charges</span><span>{new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.quoteReview.quote.currency }).format(Number(ticket.quoteReview.quote.additionalCharges))}</span></div> : null}
                        <div className="flex justify-between gap-4 border-t border-[var(--color-border)] pt-3 text-base font-semibold text-slate-950"><span>Total</span><span>{new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.quoteReview.quote.currency }).format(Number(ticket.quoteReview.quote.total))}</span></div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button type="button" onClick={() => { setDecisionError(""); setDecisionAction("APPROVE"); }} disabled={decisionLoading} className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#105cda] disabled:cursor-not-allowed disabled:opacity-60">Approve Repair</button>
                      <button type="button" onClick={() => { setDecisionError(""); setDecisionAction("REJECT"); }} disabled={decisionLoading} className="rounded-full border border-rose-300 bg-white px-5 py-3 text-sm font-semibold text-rose-800 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60">Decline Quote</button>
                    </div>
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-slate-600">The issued quote is not available for review right now. Please contact support.</p>
                )}
              </section>
            ) : null}
            {ticket.paymentPlan ? (
              <section className="border-t border-[var(--color-border)] bg-slate-50 p-6 sm:p-7" aria-labelledby="payment-plan-heading">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">Repair finances</p>
                    <h3 id="payment-plan-heading" className="mt-1 text-xl font-semibold text-slate-950">Payment Plan</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Number(ticket.paymentPlan.outstandingBalance) === 0 ? (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">PAID IN FULL</span>
                    ) : null}
                    {ticket.paymentPlan.paymentRequirementStatus !== "ACCEPTED" ? (
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${ticket.paymentPlan.paymentRequirementStatus === "PENDING_ADMIN_REVIEW" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
                        Payment option {ticket.paymentPlan.paymentRequirementStatus === "PENDING_ADMIN_REVIEW" ? "pending review" : "request declined"}
                      </span>
                    ) : null}
                  </div>
                </div>

                {paymentChoiceMessage ? <p role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{paymentChoiceMessage}</p> : null}
                {paymentChoiceError ? <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{paymentChoiceError}</p> : null}

                <dl className="mt-5 grid gap-x-8 gap-y-4 rounded-xl border border-[var(--color-border)] bg-white p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <div><dt className="text-slate-500">Approved amount</dt><dd className="mt-1 font-semibold text-slate-900">{new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.paymentPlan.currency }).format(Number(ticket.paymentPlan.approvedAmount))}</dd></div>
                  <div><dt className="text-slate-500">Amount paid</dt><dd className="mt-1 font-semibold text-slate-900">{new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.paymentPlan.currency }).format(Number(ticket.paymentPlan.amountPaid))}</dd></div>
                  <div><dt className="text-slate-500">Outstanding balance</dt><dd className="mt-1 font-semibold text-slate-900">{new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.paymentPlan.currency }).format(Number(ticket.paymentPlan.outstandingBalance))}</dd></div>
                  <div><dt className="text-slate-500">Payment requirement</dt><dd className="mt-1 font-medium text-slate-900">{ticket.paymentPlan.paymentRequirement.replaceAll("_", " ")}</dd></div>
                  <div><dt className="text-slate-500">Amount required for current payment</dt><dd className="mt-1 font-medium text-slate-900">{new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.paymentPlan.currency }).format(Number(ticket.paymentPlan.amountRequiredForCurrentPayment))}</dd></div>
                  <div><dt className="text-slate-500">Payment option status</dt><dd className="mt-1 font-medium text-slate-900">{ticket.paymentPlan.paymentRequirementStatus.replaceAll("_", " ")}</dd></div>
                  <div><dt className="text-slate-500">Arrangement status</dt><dd className="mt-1 font-medium text-slate-900">{ticket.paymentPlan.arrangementStatus.replaceAll("_", " ")}</dd></div>
                  <div><dt className="text-slate-500">Collection status</dt><dd className="mt-1 font-medium text-slate-900">{ticket.paymentPlan.collectionStatus.replaceAll("_", " ")}</dd></div>
                  {Number(ticket.paymentPlan.requiredDepositAmount) > 0 ? <div><dt className="text-slate-500">Required deposit</dt><dd className="mt-1 font-medium text-slate-900">{new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.paymentPlan.currency }).format(Number(ticket.paymentPlan.requiredDepositAmount))}</dd></div> : null}
                  {ticket.paymentPlan.collectionDeadline ? <div><dt className="text-slate-500">Collection deadline</dt><dd className="mt-1 font-medium text-slate-900">{new Date(ticket.paymentPlan.collectionDeadline).toLocaleString()}</dd></div> : null}
                </dl>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-slate-900">Payment history</h4>
                  {ticket.paymentPlan.paymentHistory.length > 0 ? (
                    <ul className="mt-3 divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-white">
                      {ticket.paymentPlan.paymentHistory.map((payment, index) => (
                        <li key={`${payment.paymentDate}-${index}`} className="p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-slate-900">{new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.paymentPlan!.currency }).format(Number(payment.amount))} · {payment.paymentMethod.replaceAll("_", " ")}</span>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${payment.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-800" : payment.status === "PENDING_ADMIN_CONFIRMATION" ? "bg-amber-50 text-amber-900" : "bg-rose-50 text-rose-800"}`}>
                              {payment.status === "PENDING_ADMIN_CONFIRMATION" ? "Payment submitted — awaiting confirmation" : payment.status === "CONFIRMED" ? "Confirmed" : "Not confirmed"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{new Date(payment.paymentDate).toLocaleString()}{payment.referenceNumber ? ` · Reference ${payment.referenceNumber}` : ""}</p>
                          {payment.customerMessage ? <p className="mt-2 text-sm leading-5 text-slate-600">{payment.customerMessage}</p> : null}
                        </li>
                      ))}
                    </ul>
                  ) : <p className="mt-2 text-sm text-slate-600">No payments submitted.</p>}
                </div>

                {ticket.paymentPlan.paymentRequirementStatus === "ACCEPTED" && ticket.status !== "COMPLETED" && ticket.status !== "CANCELLED" && ticket.paymentPlan.collectionStatus !== "COLLECTED" && getClaimableBalance(ticket) > 0 ? (
                  <form onSubmit={handlePaymentSubmission} className="mt-5 grid gap-4 rounded-xl border border-[var(--color-border)] bg-white p-4 sm:grid-cols-2 sm:items-end">
                    <h4 className="text-sm font-semibold text-slate-900 sm:col-span-2">Submit Payment Information</h4>
                    <label className="text-sm font-medium text-slate-700">Amount paid
                      <input type="number" min="0.01" max={getClaimableBalance(ticket).toFixed(2)} step="0.01" required value={paymentClaimAmount} onChange={(event) => setPaymentClaimAmount(event.target.value)} disabled={paymentClaimLoading} className={fieldClassName} />
                    </label>
                    <label className="text-sm font-medium text-slate-700">Payment method
                      <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as RepairPaymentMethod)} disabled={paymentClaimLoading} className={fieldClassName}>
                        {repairPaymentMethods.map((method) => <option key={method} value={method}>{method.replaceAll("_", " ")}</option>)}
                      </select>
                    </label>
                    <label className="text-sm font-medium text-slate-700">Payment reference
                      <input required maxLength={160} value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} disabled={paymentClaimLoading} className={fieldClassName} placeholder="M-PESA or receipt reference" />
                    </label>
                    <label className="text-sm font-medium text-slate-700">Message (optional)
                      <input maxLength={2000} value={paymentMessage} onChange={(event) => setPaymentMessage(event.target.value)} disabled={paymentClaimLoading} className={fieldClassName} />
                    </label>
                    {paymentClaimSuccess ? <p role="status" className="text-sm text-emerald-800 sm:col-span-2">{paymentClaimSuccess}</p> : null}
                    {paymentClaimError ? <p role="alert" className="text-sm text-rose-700 sm:col-span-2">{paymentClaimError}</p> : null}
                    <p className="text-xs leading-5 text-slate-500 sm:col-span-2">Submitting this information does not mark payment as received. An administrator must confirm it.</p>
                    <button type="submit" disabled={paymentClaimLoading} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#105cda] disabled:cursor-wait disabled:opacity-60 sm:col-span-2">
                      {paymentClaimLoading ? "Submitting..." : "Submit Payment Information"}
                    </button>
                  </form>
                ) : null}

                {ticket.paymentPlan.paymentRequirementStatus === "PENDING_ADMIN_REVIEW" ? (
                  <p className="mt-4 text-sm leading-6 text-slate-600">Your requested payment option has not been accepted yet. The current payment terms remain subject to review.</p>
                ) : null}

                {ticket.status !== "CANCELLED" && ticket.paymentPlan.collectionStatus !== "COLLECTED" && Number(ticket.paymentPlan.outstandingBalance) > 0 ? (
                  <form onSubmit={handlePaymentChoice} className="mt-5 grid gap-4 rounded-xl border border-[var(--color-border)] bg-white p-4 sm:grid-cols-2 sm:items-end">
                    <label className="text-sm font-medium text-slate-700">
                      Choose a payment option
                      <select value={paymentRequirementChoice} onChange={(event) => setPaymentRequirementChoice(event.target.value as CustomerRepairPaymentCommitment)} disabled={paymentChoiceLoading} className={fieldClassName}>
                        {customerRepairPaymentCommitments.map((requirement) => (
                          <option key={requirement} value={requirement}>{requirement === "FULL_PAYMENT" ? "Pay Full Amount Now" : "Pay Deposit"}</option>
                        ))}
                      </select>
                    </label>
                    {paymentRequirementChoice === "DEPOSIT" ? (
                      <label className="text-sm font-medium text-slate-700">
                        Deposit amount to pay now ({ticket.paymentPlan.currency})
                        <input type="number" min="0.01" max={ticket.paymentPlan.outstandingBalance} step="0.01" required value={proposedPaymentAmount} onChange={(event) => setProposedPaymentAmount(event.target.value)} disabled={paymentChoiceLoading} className={fieldClassName} />
                      </label>
                    ) : null}
                    {paymentChoiceError ? <p role="alert" className="text-sm text-rose-700 sm:col-span-2">{paymentChoiceError}</p> : null}
                    <button type="submit" disabled={paymentChoiceLoading} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#105cda] disabled:cursor-wait disabled:opacity-60 sm:col-span-2">
                      {paymentChoiceLoading ? "Saving choice..." : paymentRequirementChoice === "FULL_PAYMENT" || paymentRequirementChoice === "DEPOSIT" ? "Select payment option" : "Request payment option"}
                    </button>
                  </form>
                ) : null}
              </section>
            ) : null}
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

        {decisionAction && ticket?.quoteReview ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
            <section role="dialog" aria-modal="true" aria-labelledby="quote-decision-title" className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
              <h2 id="quote-decision-title" className="text-lg font-semibold text-slate-950">Confirm quote decision</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {decisionAction === "APPROVE"
                  ? `Approve this repair quote for ${new Intl.NumberFormat(undefined, { style: "currency", currency: ticket.quoteReview.quote.currency }).format(Number(ticket.quoteReview.quote.total))}?`
                  : "Decline this repair quote? This will close the current repair request."}
              </p>
              {decisionError ? <p role="alert" className="mt-4 text-sm text-rose-700">{decisionError}</p> : null}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setDecisionAction(null)} disabled={decisionLoading} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                <button type="button" onClick={() => void handleQuoteDecision()} disabled={decisionLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#105cda] disabled:cursor-wait disabled:opacity-60">
                  {decisionLoading ? "Submitting..." : decisionAction === "APPROVE" ? "Confirm approval" : "Confirm decline"}
                </button>
              </div>
            </section>
          </div>
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