"use client";

import { useRef, useState } from "react";
import {
  repairQuoteCurrencies,
  repairQuoteItemTypes,
  type RepairQuoteCurrency,
  type RepairQuoteItemType,
} from "@/lib/repairs/types";

type QuoteLine = {
  id: number;
  itemType: RepairQuoteItemType;
  description: string;
  quantity: string;
  unitAmount: string;
};

type DiagnosisQuoteFormProps = {
  ticketId: string;
  ticketNumber: string;
  diagnosis: { findings: string; recommendedAction: string | null } | null;
  onClose: () => void;
  onIssued: (message: string) => void;
};

function positiveNumber(value: string): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

function nonNegativeNumber(value: string): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : 0;
}

export default function DiagnosisQuoteForm({
  ticketId,
  ticketNumber,
  diagnosis,
  onClose,
  onIssued,
}: DiagnosisQuoteFormProps) {
  const nextLineId = useRef(2);
  const [findings, setFindings] = useState(diagnosis?.findings ?? "");
  const [recommendedAction, setRecommendedAction] = useState(diagnosis?.recommendedAction ?? "");
  const [currency, setCurrency] = useState<RepairQuoteCurrency>("KES");
  const [additionalCharges, setAdditionalCharges] = useState("0.00");
  const [items, setItems] = useState<QuoteLine[]>([
    { id: 1, itemType: "PART", description: "", quantity: "1", unitAmount: "0.00" },
  ]);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + Math.round(positiveNumber(item.quantity) * nonNegativeNumber(item.unitAmount) * 100) / 100,
    0,
  );
  const total = subtotal + nonNegativeNumber(additionalCharges);
  const money = new Intl.NumberFormat(undefined, { style: "currency", currency });

  function updateItem(id: number, updates: Partial<QuoteLine>) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...updates } : item));
  }

  function addItem() {
    if (items.length >= 50) return;
    const id = nextLineId.current++;
    setItems((current) => [...current, { id, itemType: "PART", description: "", quantity: "1", unitAmount: "0.00" }]);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed || loading) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/repairs/${encodeURIComponent(ticketId)}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ findings, recommendedAction, currency, additionalCharges, items }),
      });
      const result = (await response.json().catch(() => null)) as {
        message?: string;
        version?: number;
        total?: string;
        currency?: RepairQuoteCurrency;
      } | null;
      if (!response.ok) {
        throw new Error(result?.message ?? "The quote could not be issued.");
      }

      onIssued(`Quote version ${result?.version ?? 1} issued for ${ticketNumber}; total ${money.format(Number(result?.total ?? total))}. The ticket is awaiting customer approval.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The quote could not be issued.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="diagnosis-quote-title"
        className="my-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <header className="border-b border-slate-200 px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="diagnosis-quote-title" className="text-xl font-semibold text-slate-900">Diagnosis &amp; Quote</h2>
              <p className="mt-1 text-sm text-slate-600">{ticketNumber} · issuing the quote moves the ticket to Awaiting Customer Approval.</p>
            </div>
            <button type="button" onClick={onClose} disabled={loading} aria-label="Close dialog" className="rounded-lg px-2 py-1 text-xl leading-none text-slate-500 hover:bg-slate-100 disabled:opacity-50">×</button>
          </div>
        </header>

        <form onSubmit={submit} className="max-h-[calc(100vh-8rem)] space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
          <section className="space-y-4" aria-labelledby="diagnosis-heading">
            <div>
              <h3 id="diagnosis-heading" className="text-base font-semibold text-slate-900">Technician diagnosis</h3>
              <p className="mt-1 text-sm text-slate-600">{diagnosis ? "An existing diagnosis is read-only because diagnoses are not versioned." : "These details are recorded with the issued quote."}</p>
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-800">Findings</span>
              <textarea
                required
                maxLength={5000}
                rows={3}
                value={findings}
                onChange={(event) => setFindings(event.target.value)}
                disabled={loading}
                readOnly={Boolean(diagnosis)}
                className="w-full resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-800">Recommended action</span>
              <textarea
                required
                maxLength={3000}
                rows={3}
                value={recommendedAction}
                onChange={(event) => setRecommendedAction(event.target.value)}
                disabled={loading}
                readOnly={Boolean(diagnosis)}
                className="w-full resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>
          </section>

          <section className="space-y-4 border-t border-slate-200 pt-6" aria-labelledby="quote-heading">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 id="quote-heading" className="text-base font-semibold text-slate-900">Quote items</h3>
                <p className="mt-1 text-sm text-slate-600">Enter amounts to two decimal places or fewer.</p>
              </div>
              <label className="w-full space-y-1 sm:w-40">
                <span className="text-xs font-medium text-slate-600">Currency</span>
                <select value={currency} onChange={(event) => setCurrency(event.target.value as RepairQuoteCurrency)} disabled={loading} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
                  {repairQuoteCurrencies.map((code) => <option key={code} value={code}>{code}</option>)}
                </select>
              </label>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <fieldset key={item.id} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-[150px_minmax(180px,1fr)_110px_140px_auto]">
                  <legend className="sr-only">Quote line {index + 1}</legend>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-600">Type</span>
                    <select value={item.itemType} onChange={(event) => updateItem(item.id, { itemType: event.target.value as RepairQuoteItemType })} disabled={loading} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900">
                      {repairQuoteItemTypes.map((type) => <option key={type} value={type}>{type === "LABOUR" ? "Labour" : type === "PART" ? "Part" : "Other"}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1 sm:col-span-2 xl:col-span-1">
                    <span className="text-xs font-medium text-slate-600">Description</span>
                    <input required maxLength={300} value={item.description} onChange={(event) => updateItem(item.id, { description: event.target.value })} disabled={loading} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-600">Quantity</span>
                    <input required type="number" min="0.01" max="99999999.99" step="0.01" value={item.quantity} onChange={(event) => updateItem(item.id, { quantity: event.target.value })} disabled={loading} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-600">Unit amount</span>
                    <input required type="number" min="0" max="9999999999.99" step="0.01" value={item.unitAmount} onChange={(event) => updateItem(item.id, { unitAmount: event.target.value })} disabled={loading} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900" />
                  </label>
                  <div className="flex items-end xl:justify-end">
                    <button type="button" onClick={() => setItems((current) => current.filter((line) => line.id !== item.id))} disabled={loading || items.length === 1} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
                      Remove
                    </button>
                  </div>
                </fieldset>
              ))}
            </div>

            <button type="button" onClick={addItem} disabled={loading || items.length >= 50} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              Add line item
            </button>

            <div className="ml-auto max-w-md space-y-3 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between gap-4 text-sm text-slate-700">
                <span>Subtotal</span><span className="font-medium tabular-nums">{money.format(subtotal)}</span>
              </div>
              <label className="flex items-center justify-between gap-4 text-sm text-slate-700">
                <span>Additional charges</span>
                <input required type="number" min="0" max="9999999999.99" step="0.01" value={additionalCharges} onChange={(event) => setAdditionalCharges(event.target.value)} disabled={loading} className="w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-right text-sm tabular-nums text-slate-900" />
              </label>
              <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                <span>Total</span><span className="tabular-nums">{money.format(total)}</span>
              </div>
            </div>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <label className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <input type="checkbox" required checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} disabled={loading} className="mt-1 h-4 w-4 accent-sky-700" />
              <span>Issue this quote and move the repair to <strong>Awaiting Customer Approval</strong>? The customer has not approved the quote yet.</span>
            </label>
            {error ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">{error}</p> : null}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={!confirmed || loading || items.length === 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Issuing quote...</> : "Issue Quote"}
              </button>
            </div>
          </section>
        </form>
      </section>
    </div>
  );
}