"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MessageCircle, Phone, Sparkles, ShieldCheck } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { services, projects, testimonials, faqs } from "@/lib/content";

const trustPoints = ["Kenya-wide service", "Professional installations", "Warranty", "Certified technicians", "Fast response", "Reliable support"];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-primary)] bg-[rgba(20,110,245,0.08)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
              <Sparkles size={16} /> Premium AV systems for modern businesses
            </div>
            <h1 className="mt-10 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl heading-hero">
              Professional Audio Visual & Boardroom Solutions
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              PowerWave AV designs and installs high-performance sound, video, conferencing, security, and maintenance systems that help businesses communicate clearly and operate confidently.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(20,110,245,0.18)] transition hover:bg-[#105cda]">
                Request Free Quote <ArrowRight size={18} />
              </Link>
              <a href="tel:+254715825819" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                <Phone size={18} /> Call Now
              </a>
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Browse the Shop <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-3xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <BadgeCheck size={18} className="text-[var(--color-primary)]" /> {point}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="relative flex items-center justify-center">
            <div className="pointer-events-none absolute -right-16 top-12 h-64 w-64 rounded-full bg-[var(--color-accent)]/15 blur-3xl" />
            <div className="pointer-events-none absolute left-12 bottom-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-white shadow-glow">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,194,255,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(20,110,245,0.16),_transparent_25%)]" />
              <div className="relative p-8 sm:p-10">
                  <Image src="/images/hero-graphic.jpeg" alt="AV installation showcase" width={960} height={480} className="h-[480px] w-full rounded-[2rem] object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading eyebrow="Who we are" title="A premium AV partner for ambitious teams" description="We combine technical expertise, elegant deployment, and responsive support to deliver systems that feel effortless and perform reliably." />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm">
            <p className="text-lg leading-8 text-[var(--color-muted)]">
              PowerWave AV exists to help businesses create clear communication experiences through carefully designed audio visual systems. From boardrooms to restaurants, our work bridges technology, design, and long-term support.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-primary)]">Mission</p>
                <p className="mt-3 text-slate-700">Deliver dependable AV that helps organisations communicate with confidence.</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-primary)]">Vision</p>
                <p className="mt-3 text-slate-700">Be Kenya’s trusted partner for premium, future-ready audio visual solutions.</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="rounded-[2rem] border border-[var(--color-primary)] bg-[#F7FAFF] p-10">
            <h3 className="text-2xl font-semibold text-slate-950">Why clients choose us</h3>
            <ul className="mt-8 space-y-4 text-slate-700">
              {[
                "Professional installation standards",
                "Premium equipment and clean design",
                "Responsive maintenance and support",
                "Clear communication from consultation to handover",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 text-[var(--color-primary)]" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
              Learn more about our approach <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Services" title="Solutions engineered for clarity, comfort, and control" description="From sound systems to meeting room automation, we design each solution around user experience and business outcomes." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <motion.article whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} key={service.title} className="group overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
                <div className="relative overflow-hidden px-8 pt-8">
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[var(--color-primary)]/10 blur-2xl" />
                  <div className="relative inline-flex rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
                    {service.title}
                  </div>
                </div>
                <div className="px-8 pb-8 pt-6">
                  <p className="text-lg leading-8 text-slate-700">{service.description}</p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <BadgeCheck size={16} className="text-[var(--color-primary)]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm leading-7 text-slate-500">{service.accent}</p>
                  <Link href={service.href} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
                    Explore service <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading eyebrow="Projects" title="Selected work shaped around real business needs" description="We create polished AV environments that elevate communication, security, and confidence." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <motion.article key={project.title} whileHover={{ scale: 1.02 }} className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
              <div className="h-44 bg-[radial-gradient(circle_at_top_left,_rgba(20,110,245,0.18),_transparent_30%),#0B1F3A]" />
              <div className="p-7">
                <p className="text-sm uppercase tracking-[0.32em] text-[var(--color-primary)]">{project.category}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">{project.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{project.summary}</p>
                <Link href="/projects" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
                  View case study <ArrowRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Link href="/projects/case-studies" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
            Explore all case studies <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Testimonials" title="Trusted by clients who value quality and consistency" description="Our work is measured not only by the systems we install, but by the confidence we create for every client." align="center" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} whileHover={{ y: -4 }} className="rounded-[2rem] border border-[var(--color-border)] bg-white p-8 shadow-sm">
                <p className="text-lg leading-8 text-slate-700">“{testimonial.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold text-slate-950">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-[var(--color-border)] bg-white p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <SectionHeading eyebrow="FAQ" title="Answers to the questions that matter most" description="We help clients evaluate the right systems, budget, and support strategy from the outset." />
          </div>
          <div className="space-y-4">
            {faqs.slice(0, 4).map((faq) => (
              <details key={faq.question} className="rounded-3xl border border-[var(--color-border)] bg-slate-50 px-6 py-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950">{faq.question}</summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm font-semibold">
              <Link href="/faq" className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[#105cda]">
                View all FAQs <ArrowRight size={16} />
              </Link>
              <Link href="/resources/buyer-guides" className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[#105cda]">
                Browse buyer guides <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="rounded-[2rem] border border-[var(--color-primary)]/20 bg-[rgba(20,110,245,0.08)] p-8 text-center lg:p-12">
          <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Ready to plan your next AV upgrade?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Let’s discuss your space, goals, and timeline. We’ll help you choose a system that supports your team, guests, and long-term operations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white shadow-lg shadow-[rgba(20,110,245,0.15)] hover:bg-[#105cda]">Request a quote <ArrowRight size={18} /></Link>
            <Link href="/repairs" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Repair support <ArrowRight size={18} /></Link>
            <a href="https://wa.me/254715825819" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">
              <MessageCircle size={18} /> Start WhatsApp chat
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
