"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, Zap, Users } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { QuoteForm } from "@/components/quote-form";
import { verticalLandings } from "@/lib/content";

interface VerticalSolutionPageProps {
  slug: string;
}

export function VerticalSolutionPage({ slug }: VerticalSolutionPageProps) {
  const vertical = verticalLandings.find((v) => v.slug === slug);

  if (!vertical) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] mb-6">
              {vertical.vertical}
            </div>
            <h1 className="mt-4 text-5xl font-bold text-slate-950 lg:text-6xl">
              {vertical.heroHeading}
            </h1>
            <p className="mt-6 text-xl leading-8 text-[var(--color-muted)]">
              {vertical.heroSubheading}
            </p>
            <div className="mt-10 flex gap-4 justify-center flex-wrap">
              <Link
                href="#assessment"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-semibold text-white hover:bg-[#105cda]"
              >
                Get Assessment <ArrowRight size={16} />
              </Link>
              <Link
                href="#quote"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-8 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Request Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 lg:py-12">
        <SectionHeading
          eyebrow="Common Challenges"
          title="What We Hear From Your Industry"
          description="Understanding these pain points helps us deliver solutions that truly matter."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {vertical.challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-8 hover:shadow-lg transition"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-950">{challenge.title}</h3>
              <p className="mt-2 text-slate-600">{challenge.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Our Solutions"
          title="Purpose-Built for Your Needs"
          description="Each solution is designed to address specific challenges in your industry."
        />

        <div className="mt-12 space-y-8">
          {vertical.solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-8 lg:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
                <div>
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                    <Zap size={28} className="text-blue-600" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-slate-950">{solution.title}</h3>
                  <p className="mt-2 text-slate-600">{solution.description}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">Key Features</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="mt-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24 bg-white rounded-[3rem] lg:mx-6">
        <SectionHeading
          eyebrow="Key Benefits"
          title="Why This Matters to Your Bottom Line"
          description="Professional AV systems deliver measurable business value."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {vertical.keyBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-slate-50 p-6"
            >
              <Users size={24} className="text-[var(--color-primary)] flex-shrink-0 mt-1" />
              <p className="text-slate-700">{benefit}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">{vertical.ctaHeading}</h2>
            <p className="mt-4 text-slate-600 leading-7">{vertical.ctaSubheading}</p>
            <div className="mt-8 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-950 mb-2">What&apos;s included in your consultation:</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-primary)]">✓</span> Site assessment and needs analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-primary)]">✓</span> Tailored system recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-primary)]">✓</span> Transparent pricing and timeline
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-primary)]">✓</span> Free ongoing support planning
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <QuoteForm vertical={vertical.vertical} />
        </div>
      </section>

      {/* CTA Footer */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to get started?</h2>
          <p className="mt-3 text-blue-100">Connect with us for a no-pressure consultation.</p>
          <div className="mt-8">
            <a href="tel:+254715825819" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50">
              Call 0715 825 819 <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
