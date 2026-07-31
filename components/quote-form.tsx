"use client";

import React, { useState } from "react";
import { ArrowRight } from "@/components/icons";

interface QuoteFormProps {
  vertical?: string;
  onSubmit?: (data: QuoteFormData) => void;
}

export interface QuoteFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  vertical: string;
  projectType: string;
  roomSize: string;
  budget: string;
  timeline: string;
  details: string;
}

export function QuoteForm({ vertical, onSubmit }: QuoteFormProps) {
  const [form, setForm] = useState<QuoteFormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    vertical: vertical || "",
    projectType: "",
    roomSize: "",
    budget: "",
    timeline: "",
    details: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; message: string }>(null);
  const [step, setStep] = useState(1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setStatus({ ok: data.ok, message: data.message });
      if (data.ok) {
        setForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          vertical: vertical || "",
          projectType: "",
          roomSize: "",
          budget: "",
          timeline: "",
          details: "",
        });
        setStep(1);
        onSubmit?.(form);
      }
    } catch (err) {
      console.error(err);
      setStatus({ ok: false, message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const verticals = [
    "Corporate / Boardrooms",
    "Hospitality (Hotels & Restaurants)",
    "Worship / Churches",
    "Education / Schools",
    "Retail / Commercial",
    "Other",
  ];

  const projectTypes = [
    "New installation",
    "System upgrade",
    "Repair / maintenance",
    "Site survey & consultation",
  ];

  const roomSizes = [
    "Small (up to 50 sqm)",
    "Medium (50–200 sqm)",
    "Large (200–500 sqm)",
    "Extra large (500+ sqm)",
  ];

  const budgets = [
    "Under KES 300,000",
    "KES 300k–600k",
    "KES 600k–1.5M",
    "KES 1.5M–3M",
    "Above KES 3M",
    "Not sure yet",
  ];

  const timelines = [
    "Within 2 weeks",
    "1–4 weeks",
    "1–3 months",
    "3–6 months",
    "Flexible / exploring options",
  ];

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-slate-950">Request a Free Quote</h3>
        <p className="mt-2 text-sm text-slate-600">Step {step} of 3: Let's understand your needs</p>
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-semibold">Your Name *</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400"
              placeholder="Full name"
            />
          </label>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-semibold">Company *</span>
            <input
              type="text"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400"
              placeholder="Company or venue name"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-semibold">Email *</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400"
                placeholder="you@company.com"
              />
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-semibold">Phone *</span>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400"
                placeholder="0700 000 000"
              />
            </label>
          </div>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-semibold">What vertical do you work in? *</span>
            <select
              required
              value={form.vertical}
              onChange={(e) => setForm({ ...form, vertical: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900"
            >
              <option value="">Select a vertical</option>
              {verticals.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda]"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-semibold">What type of project? *</span>
            <select
              required
              value={form.projectType}
              onChange={(e) => setForm({ ...form, projectType: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900"
            >
              <option value="">Select project type</option>
              {projectTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-semibold">Approximate room size *</span>
            <select
              required
              value={form.roomSize}
              onChange={(e) => setForm({ ...form, roomSize: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900"
            >
              <option value="">Select room size</option>
              {roomSizes.map((rs) => (
                <option key={rs} value={rs}>
                  {rs}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-semibold">Budget range *</span>
            <select
              required
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900"
            >
              <option value="">Select budget</option>
              {budgets.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-semibold">Timeline *</span>
            <select
              required
              value={form.timeline}
              onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900"
            >
              <option value="">Select timeline</option>
              {timelines.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda]"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-semibold">Tell us about your project</span>
            <textarea
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="min-h-32 w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400"
              placeholder="Describe any specific challenges, requirements, or areas you'd like us to address (optional but helpful)."
            />
          </label>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-semibold">What happens next?</p>
            <p className="mt-2">We'll review your request within 24 hours and reach out with a tailored proposal and timeline.</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda] disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send Request"} <ArrowRight size={16} />
            </button>
          </div>

          {status && (
            <div className={`text-sm ${status.ok ? "text-green-600" : "text-red-600"}`}>
              {status.message}
            </div>
          )}
        </div>
      )}
    </form>
  );
}
