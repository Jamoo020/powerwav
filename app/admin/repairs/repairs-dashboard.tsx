"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import { repairStatusLabels, repairStatusOrder, type AdminRepairTicket, type RepairStatus } from "@/lib/repairs/types";

type RepairsResponse = {
  tickets: AdminRepairTicket[];
  statusCounts: Partial<Record<RepairStatus, number>>;
};

const summaryCards = [
  { label: "New Requests", statuses: ["REQUEST_RECEIVED"] as RepairStatus[], color: "sky" },
  { label: "Scheduled / Received", statuses: ["APPOINTMENT_SCHEDULED", "DEVICE_RECEIVED"] as RepairStatus[], color: "blue" },
  { label: "Diagnosis / Approval", statuses: ["DIAGNOSIS_AND_QUOTE", "AWAITING_CUSTOMER_APPROVAL", "AWAITING_PARTS"] as RepairStatus[], color: "amber" },
  { label: "In Repair / Testing", statuses: ["REPAIR_IN_PROGRESS", "TESTING_QC"] as RepairStatus[], color: "indigo" },
  { label: "Ready for Collection", statuses: ["READY_FOR_COLLECTION"] as RepairStatus[], color: "emerald" },
  { label: "Completed / Cancelled", statuses: ["COMPLETED", "CANCELLED"] as RepairStatus[], color: "blue" },
] as const;

const summaryColors: Record<(typeof summaryCards)[number]["color"], string> = {
  sky: "border-sky-200 bg-sky-50 text-sky-800",
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-800",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

function getStatusStyle(status: RepairStatus): string {
  if (["COMPLETED", "READY_FOR_COLLECTION"].includes(status)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (["CANCELLED"].includes(status)) {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }
  if (["AWAITING_CUSTOMER_APPROVAL", "AWAITING_PARTS", "DIAGNOSIS_AND_QUOTE"].includes(status)) {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }
  return "border-sky-200 bg-sky-50 text-sky-800";
}

function formatDate(value: string | null, includeTime = false): string {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    ...(includeTime ? { timeStyle: "short" as const } : {}),
  }).format(date);
}

function StatusBadge({ status }: { status: RepairStatus }) {
  return (
    <span className={`inline-flex max-w-full rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(status)}`}>
      {repairStatusLabels[status]}
    </span>
  );
}

function TicketDetails({ ticket }: { ticket: AdminRepairTicket }) {
  return (
    <div className="grid gap-5 border-t border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Issue description</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{ticket.issueDescription}</p>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer contact</h3>
        <p className="mt-2 text-sm font-medium text-slate-900">{ticket.customer.name}</p>
        <a className="mt-1 block text-sm text-sky-700 hover:underline" href={`tel:${ticket.customer.phone}`}>{ticket.customer.phone}</a>
        <a className="mt-1 block break-all text-sm text-sky-700 hover:underline" href={`mailto:${ticket.customer.email}`}>{ticket.customer.email}</a>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Equipment and dates</h3>
        <p className="mt-2 text-sm text-slate-800">{ticket.equipment.category} · {ticket.equipment.brand} {ticket.equipment.model}</p>
        <p className="mt-1 text-sm text-slate-600">Serial: {ticket.equipment.serialNumber || "Not provided"}</p>
        <p className="mt-3 text-sm text-slate-600">Created {formatDate(ticket.createdAt, true)}</p>
        <p className="mt-1 text-sm text-slate-600">Updated {formatDate(ticket.updatedAt, true)}</p>
      </div>
    </div>
  );
}

export default function AdminRepairsDashboard({ adminEmail }: { adminEmail: string }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState<RepairsResponse>({ tickets: [], statusCounts: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);

      try {
        const response = await fetch(`/api/admin/repairs?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json().catch(() => null)) as RepairsResponse | { message?: string } | null;
        if (!response.ok) {
          throw new Error(result && "message" in result ? result.message : "Unable to load repair tickets.");
        }
        if (isActive) {
          setData(result as RepairsResponse);
          setExpandedTicketId(null);
        }
      } catch (requestError) {
        if (isActive && !(requestError instanceof DOMException && requestError.name === "AbortError")) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load repair tickets.");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }, search ? 250 : 0);

    return () => {
      isActive = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [reloadKey, search, status]);

  const visibleTickets = data.tickets;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                  PowerWave AV
                </div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Repair Management</h1>
                <p className="mt-2 text-sm text-slate-300">View and manage customer repair requests.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/admin" className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800">
                  Admin dashboard
                </Link>
                <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200">
                  Signed in as <span className="font-medium text-white">{adminEmail}</span>
                </div>
              </div>
            </div>
          </header>

          <section className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-6">
              {summaryCards.map((card) => (
                <div key={card.label} className={`rounded-xl border p-4 ${summaryColors[card.color]}`}>
                  <p className="text-xs font-semibold leading-5">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums" aria-live="polite">
                    {card.statuses.reduce((total, item) => total + (data.statusCounts[item] ?? 0), 0)}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[minmax(0,1fr)_260px]">
              <label className="relative block">
                <span className="sr-only">Search repair tickets</span>
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ticket, customer, phone, brand, or model"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </label>
              <label className="block">
                <span className="sr-only">Filter by status</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                >
                  <option value="">All statuses</option>
                  {repairStatusOrder.map((item) => <option key={item} value={item}>{repairStatusLabels[item]}</option>)}
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">Repair tickets</h2>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" aria-live="polite">
                {visibleTickets.length} {visibleTickets.length === 1 ? "ticket" : "tickets"}
              </span>
            </div>

            {loading ? (
              <div className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-600" role="status">
                <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
                Loading repair tickets...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800" role="alert">
                <p className="font-semibold">Repair tickets could not be loaded.</p>
                <p className="mt-1">{error}</p>
                <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-4 rounded-lg bg-rose-800 px-3 py-2 font-semibold text-white hover:bg-rose-700">
                  Try again
                </button>
              </div>
            ) : visibleTickets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <h3 className="font-semibold text-slate-900">{search || status ? "No matching repair tickets" : "No repair requests yet"}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {search || status ? "Try changing the search or status filter." : "New customer repair requests will appear here."}
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 bg-white text-left text-sm">
                      <thead className="bg-slate-50 text-slate-700">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Ticket</th>
                          <th className="px-4 py-3 font-semibold">Customer</th>
                          <th className="px-4 py-3 font-semibold">Equipment</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold">Service Option</th>
                          <th className="px-4 py-3 font-semibold">Preferred Date</th>
                          <th className="px-4 py-3 font-semibold">Updated</th>
                          <th className="px-4 py-3 text-right font-semibold">View</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {visibleTickets.map((ticket) => {
                          const isExpanded = expandedTicketId === ticket.id;
                          return (
                            <Fragment key={ticket.id}>
                              <tr className="align-top">
                                <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">{ticket.ticketNumber}</td>
                                <td className="px-4 py-4">
                                  <p className="font-medium text-slate-900">{ticket.customer.name}</p>
                                  <p className="mt-1 text-xs text-slate-500">{ticket.customer.phone}</p>
                                </td>
                                <td className="px-4 py-4">
                                  <p className="font-medium text-slate-900">{ticket.equipment.brand} {ticket.equipment.model}</p>
                                  <p className="mt-1 text-xs text-slate-500">{ticket.equipment.category}</p>
                                </td>
                                <td className="px-4 py-4"><StatusBadge status={ticket.status} /></td>
                                <td className="px-4 py-4 text-slate-700">{ticket.preferredServiceOption || "Not specified"}</td>
                                <td className="whitespace-nowrap px-4 py-4 text-slate-700">{formatDate(ticket.preferredAt)}</td>
                                <td className="whitespace-nowrap px-4 py-4 text-slate-700">{formatDate(ticket.updatedAt)}</td>
                                <td className="px-4 py-4 text-right">
                                  <button type="button" aria-expanded={isExpanded} onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800">
                                    <Eye aria-hidden="true" className="h-4 w-4" /> {isExpanded ? "Close" : "View"}
                                  </button>
                                </td>
                              </tr>
                              {isExpanded ? <tr key={`${ticket.id}-details`}><td colSpan={8} className="p-0"><TicketDetails ticket={ticket} /></td></tr> : null}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3 lg:hidden">
                  {visibleTickets.map((ticket) => {
                    const isExpanded = expandedTicketId === ticket.id;
                    return (
                      <article key={ticket.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="space-y-4 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{ticket.ticketNumber}</p>
                              <p className="mt-1 text-sm text-slate-600">{ticket.customer.name}</p>
                            </div>
                            <StatusBadge status={ticket.status} />
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><p className="text-xs font-medium text-slate-500">Equipment</p><p className="mt-1 text-slate-800">{ticket.equipment.brand} {ticket.equipment.model}</p></div>
                            <div><p className="text-xs font-medium text-slate-500">Service option</p><p className="mt-1 text-slate-800">{ticket.preferredServiceOption || "Not specified"}</p></div>
                            <div><p className="text-xs font-medium text-slate-500">Preferred date</p><p className="mt-1 text-slate-800">{formatDate(ticket.preferredAt)}</p></div>
                            <div><p className="text-xs font-medium text-slate-500">Updated</p><p className="mt-1 text-slate-800">{formatDate(ticket.updatedAt)}</p></div>
                          </div>
                          <button type="button" aria-expanded={isExpanded} onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800">
                            <Eye aria-hidden="true" className="h-4 w-4" /> {isExpanded ? "Close details" : "View details"}
                          </button>
                        </div>
                        {isExpanded ? <TicketDetails ticket={ticket} /> : null}
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}