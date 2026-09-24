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
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-3xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <BadgeCheck size={18} className="text-[var(--color-primary)]" /> {point}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-[2rem] opacity-20 blur-xl"></div>
            <div className="relative rounded-[2rem] bg-slate-900 p-8 text-white">
              <h3 className="text-2xl font-semibold">Professional Audio Visual Solutions</h3>
              <p className="mt-4 text-slate-300">Elevate your space with systems designed for clarity, reliability, and impact.</p>
              <div className="mt-6 flex gap-4">
                <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-2 text-sm font-semibold text-white hover:bg-[#105cda]">
                  Explore all services <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading eyebrow="Services" title="Complete solutions for every need" description="From boardrooms to security systems, we deliver integrated AV that works." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <motion.article key={service.title} whileHover={{ y: -4 }} className="rounded-[2rem] border border-[var(--color-border)] bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-[rgba(20,110,245,0.1)]">
                  <ShieldCheck size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{service.title}</h3>
              </div>
              <p className="text-sm leading-7 text-slate-600">{service.description}</p>
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
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-slate-50 p-8 text-center lg:p-10">
          <SectionHeading
            eyebrow="Industries"
            title="AV solutions shaped around your industry"
            description="From corporate boardrooms and hotels to restaurants, churches, and schools, we adapt each installation to the environment, audience, and operational goals."
            align="center"
          />
          <Link href="/industries" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white shadow-lg shadow-[rgba(20,110,245,0.15)] hover:bg-[#105cda]">
            Explore industries <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading eyebrow="Projects" title="Selected work shaped around real business needs" description="We create polished AV environments that elevate communication, security, and confidence." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <motion.article key={project.title} whileHover={{ scale: 1.02 }} className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white backdrop-blur">
                  {project.category}
                </span>
              </div>
              <div className="p-7">
                <h3 className="text-xl font-semibold text-slate-950">{project.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{project.summary}</p>
                <Link href="/projects" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
                  View project <ArrowRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
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
            <SectionHeading eyebrow="FAQ" title="Answers to the questions that matter most" description="We help clients evaluate the right systems and support strategy from the outset." />
          </div>
          <div className="space-y-4">
            {faqs.slice(0, 4).map((faq) => (
              <details key={faq.question} className="rounded-3xl border border-[var(--color-border)] bg-slate-50 px-6 py-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-950">{faq.question}</summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
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
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white shadow-lg shadow-[rgba(20,110,245,0.15)] hover:bg-[#105cda]">Start a project <ArrowRight size={18} /></Link>
            <a href="https://wa.me/254715825819" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">
              <MessageCircle size={18} /> Start WhatsApp chat
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
