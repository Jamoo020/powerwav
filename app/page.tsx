"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MessageCircle, Phone, Sparkles, ShieldCheck } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { services, projects, testimonials, faqs } from "@/lib/content";
import { fetchPublishedProducts, type Product } from "@/lib/catalogue/client";

const trustPoints = ["Kenya-wide service", "Professional installations", "Warranty", "Certified technicians", "Fast response", "Reliable support"];

const solutionAreas = [
  {
    title: "Home Entertainment",
    description: "Explore the current AV and electronics catalogue and ask our team about equipment for your space.",
    href: "/shop",
    link: "Explore products",
  },
  {
    title: "Commercial AV",
    description: "Sound, displays and conferencing systems for boardrooms, offices, hospitality and events.",
    href: "/services",
    link: "View AV services",
  },
  {
    title: "CCTV & Security",
    description: "Scalable surveillance and security systems designed around the needs of each site.",
    href: "/services",
    link: "Explore security",
  },
  {
    title: "Networking",
    description: "Discuss the connectivity needs that accompany an integrated AV setup with our team.",
    href: "/contact",
    link: "Discuss your requirements",
  },
  {
    title: "Other AV Solutions",
    description: "Discover audio, video and conferencing systems for schools, churches, restaurants and more.",
    href: "/industries",
    link: "Explore solutions by industry",
  },
];

const deliveryStages = [
  { title: "Installation", description: "Thoughtful system design, site surveys and clean installations." },
  { title: "Configuration", description: "Controls and integrations set up for straightforward daily use." },
  { title: "Maintenance", description: "Preventive checks, calibration and upgrades to support reliability." },
  { title: "Repairs & technical support", description: "Responsive help with faults and issues affecting AV systems." },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;

    fetchPublishedProducts({ featured: true })
      .then((products) => {
        if (active) setFeaturedProducts(products.slice(0, 3));
      })
      .catch(() => {
        if (active) setFeaturedProducts([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-primary)] bg-[rgba(20,110,245,0.08)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
              <Sparkles size={16} /> Premium AV systems for modern businesses
            </div>
            <h1 className="mt-10 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl heading-hero">
              Professional AV products, solutions, installation and support
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              PowerWave AV supplies professional equipment and designs, installs and supports sound, video, conferencing and security systems for homes and organisations.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(20,110,245,0.18)] transition hover:bg-[#105cda]">
                Discuss an AV solution <ArrowRight size={18} />
              </Link>
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Explore the Shop <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-[2rem] opacity-20 blur-xl"></div>
            <div className="relative rounded-[2rem] bg-slate-900 p-8 text-white">
              <h3 className="text-2xl font-semibold">From equipment to ongoing support</h3>
              <p className="mt-4 text-slate-300">Explore AV products, plan a tailored system, and get practical support from consultation through handover.</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/services" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-2 text-sm font-semibold text-white hover:bg-[#105cda]">
                  Explore all services <ArrowRight size={16} />
                </Link>
                <a href="tel:+254715825819" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10">
                  <Phone size={16} /> Call Now
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-8 border-b border-[var(--color-border)] pb-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:pb-20">
          <SectionHeading eyebrow="About PowerWave" title="A practical AV partner, from planning to handover" description="Technical depth, considered design and practical support from consultation through handover." />
          <div>
            <p className="text-lg leading-8 text-[var(--color-muted)]">
              PowerWave AV brings together technical depth, considered design and practical support to create professional AV experiences. We start with your goals and space, then plan systems that support communication, operations and customer experience.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
              Meet PowerWave <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="pt-16 lg:pt-20">
          <SectionHeading eyebrow="Solutions" title="AV for homes, workspaces and public-facing environments" description="Explore the areas PowerWave supports, then follow through to the relevant product, service or industry information." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {solutionAreas.map((solution) => (
              <article key={solution.title} className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">{solution.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{solution.description}</p>
                <Link href={solution.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
                  {solution.link} <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-950">Solutions shaped around your industry</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">From boardrooms and hotels to restaurants, churches and schools, each installation is adapted to its environment and audience.</p>
            </div>
            <Link href="/industries" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
              Explore industries <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading eyebrow="Services" title="From installation to ongoing technical support" description="PowerWave supports AV systems through installation, configuration, preventive maintenance, repairs and technical support." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {deliveryStages.map((stage) => (
            <div key={stage.title} className="border-l-2 border-[var(--color-primary)] pl-4 py-1">
              <h3 className="text-sm font-semibold text-slate-950">{stage.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{stage.description}</p>
            </div>
          ))}
        </div>
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

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Featured Projects" title="Solutions delivered for real business needs" description="Explore a selection of PowerWave projects across boardrooms, hospitality and security." />
          <Link href="/projects" className="mb-1 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
            View All Projects <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <article key={project.title} className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  {project.category}
                </span>
                <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{project.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{project.summary}</p>
              <Link href="/projects" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
                View project <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 rounded-2xl border border-[var(--color-border)] bg-white p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:p-10">
            <div>
              <SectionHeading eyebrow="Shop" title="Explore AV equipment for your space" description="Browse the PowerWave catalogue for available sound, display, conferencing and security equipment." />
              <Link href="/shop" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda]">
                Explore the Shop <ArrowRight size={18} />
              </Link>
            </div>
            {featuredProducts.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {featuredProducts.map((product) => (
                  <Link key={product.id} href={`/shop/${product.slug}`} className="rounded-xl border border-[var(--color-border)] bg-slate-50 p-5 transition hover:border-[var(--color-primary)]/40 hover:bg-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">Featured product</p>
                    <h3 className="mt-3 font-semibold text-slate-950">{product.name}</h3>
                    {product.manufacturer || product.model ? (
                      <p className="mt-2 text-sm text-slate-600">{[product.manufacturer, product.model].filter(Boolean).join(" · ")}</p>
                    ) : null}
                    {product.short_description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{product.short_description}</p> : null}
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">View product <ArrowRight size={14} /></span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-7">
                <p className="text-lg font-semibold text-slate-950">Browse the current catalogue</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">See available products, categories and product details in the Shop.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Why PowerWave" title="A considered approach, backed by practical support" description="Our work is measured not only by the systems we install, but by the confidence we create for every client." align="center" />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white px-5 py-4 text-sm text-slate-700">
                <BadgeCheck size={18} className="shrink-0 text-[var(--color-primary)]" /> {point}
              </div>
            ))}
          </div>
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

      <section className="bg-slate-900 py-16 text-white lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Repair & technical support</p>
            <h2 className="mt-4 text-3xl font-semibold">Support for selected AV equipment</h2>
            <p className="mt-4 leading-7 text-slate-300">
              PowerWave can assist with selected AV products and equipment, including supported Samsung, Sony, LG, JBL and similar models. Contact the team to confirm service availability for your product.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/maintenance" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#105cda]">
              Book a Repair <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Track a Repair <ArrowRight size={16} />
            </Link>
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
            <Link href="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
              View all FAQs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="rounded-[2rem] border border-[var(--color-primary)]/20 bg-[rgba(20,110,245,0.08)] p-8 text-center lg:p-12">
          <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Let’s plan your next AV solution</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Contact PowerWave about an AV solution, service, project or product. We’ll discuss your space, goals and next steps.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white shadow-lg shadow-[rgba(20,110,245,0.15)] hover:bg-[#105cda]">Contact PowerWave <ArrowRight size={18} /></Link>
            <Link href="/shop" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">Explore the Shop</Link>
            <a href="https://wa.me/254715825819" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100">
              <MessageCircle size={18} /> Start WhatsApp chat
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
