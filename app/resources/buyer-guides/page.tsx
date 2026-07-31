"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, BookOpen, Download } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { buyerGuides } from "@/lib/content";

export default function BuyerGuidesPage() {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Buyer Guides"
          title="Make Confident AV Decisions"
          description="Comprehensive guides to help you plan, budget, and choose the right solutions for your organization."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {buyerGuides.map((guide, index) => (
            <motion.div
              key={guide.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group rounded-2xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
                  <BookOpen size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{guide.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{guide.description}</p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
                  {guide.category}
                </div>

                <button
                  onClick={() => setExpandedGuide(expandedGuide === guide.slug ? null : guide.slug)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]"
                >
                  View Guide <ArrowRight size={16} />
                </button>
              </div>

              {expandedGuide === guide.slug && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-[var(--color-border)] bg-slate-50 p-8"
                >
                  <div className="space-y-6">
                    {guide.sections.map((section, i) => (
                      <div key={i}>
                        <h4 className="font-semibold text-slate-950">{section.heading}</h4>
                        <p className="mt-2 text-sm text-slate-600 leading-6">{section.content}</p>
                      </div>
                    ))}

                    <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-white p-4">
                      <p className="text-sm font-semibold text-slate-950 mb-3">Quick Checklist</p>
                      <ul className="space-y-2">
                        {guide.checklist.slice(0, 5).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-[var(--color-primary)]">☑</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      {guide.checklist.length > 5 && (
                        <p className="mt-2 text-xs text-slate-500">+ {guide.checklist.length - 5} more items</p>
                      )}
                    </div>

                    <Link
                      href="/contact"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[#105cda]"
                    >
                      {guide.cta} <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Full Guides Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-slate-950">Download Full Guides</h2>
          <p className="mt-2 text-slate-600">Get comprehensive PDFs delivered to your email.</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {buyerGuides.map((guide) => (
              <div key={guide.slug} className="flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-white p-6">
                <Download size={24} className="text-[var(--color-primary)] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-950">{guide.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{guide.sections.length} sections • {guide.checklist.length} checklist items</p>
                  <a
                    href={`/api/guides/${guide.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]"
                  >
                    Download PDF <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 rounded-[2rem] bg-gradient-to-r from-blue-50 to-indigo-50 p-12 text-center border border-[var(--color-border)]">
          <h3 className="text-2xl font-bold text-slate-950">Need personalized guidance?</h3>
          <p className="mt-3 text-slate-600">Our team is ready to discuss your specific needs and create a custom plan.</p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-semibold text-white hover:bg-[#105cda]"
            >
              Schedule Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
