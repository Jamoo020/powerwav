import Link from "next/link";
import { ArrowRight, BadgeCheck, MessageCircle, Phone, Sparkles, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { services, industries, projects, testimonials, faqs } from "@/lib/content";

const trustPoints = ["Kenya-wide service", "Professional installations", "Warranty", "Certified technicians", "Fast response", "Reliable support"];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_38%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200">
              <Sparkles size={16} /> Premium AV systems for modern businesses
            </div>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Professional Audio Visual & Boardroom Solutions
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              PowerWave AV designs and installs high-performance sound, video, conferencing, security, and maintenance systems that help businesses communicate clearly and operate confidently.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Request Free Quote <ArrowRight size={18} />
              </Link>
              <a href="tel:+254715825819" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                <Phone size={18} /> Call Now
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {trustPoints.map((point) => (
                <span key={point} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  <BadgeCheck size={16} className="text-cyan-300" /> {point}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-cyan-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/40">
              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-950 p-8">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Project Delivery</span>
                  <span>24/7 Support</span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-3xl font-semibold text-white">200+</p>
                    <p className="mt-2 text-sm text-slate-400">Successful installations</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-3xl font-semibold text-white">98%</p>
                    <p className="mt-2 text-sm text-slate-400">Client retention</p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-cyan-400/25 bg-cyan-500/10 p-5 text-sm text-slate-300">
                  <p className="font-semibold text-cyan-200">Trusted by offices, hotels, restaurants, churches, schools, and property managers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading eyebrow="Who we are" title="A premium AV partner for ambitious teams" description="We combine technical expertise, elegant deployment, and responsive support to deliver systems that feel effortless and perform reliably." />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-lg shadow-slate-950/30">
            <p className="text-lg leading-8 text-slate-300">
              PowerWave AV exists to help businesses create clear communication experiences through carefully designed audio visual systems. From boardrooms to restaurants, our work bridges technology, design, and long-term support.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Mission</p>
                <p className="mt-2 text-slate-300">Deliver dependable AV that helps organisations communicate with confidence.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Vision</p>
                <p className="mt-2 text-slate-300">Be Kenya’s trusted partner for premium, future-ready audio visual solutions.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/10 p-8">
            <h3 className="text-2xl font-semibold text-white">Why clients choose us</h3>
            <ul className="mt-6 space-y-4 text-slate-300">
              {[
                "Professional installation standards",
                "Premium equipment and clean design",
                "Responsive maintenance and support",
                "Clear communication from consultation to handover",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3"><ShieldCheck className="mt-1 text-cyan-300" size={18} />{item}</li>
              ))}
            </ul>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
              Learn more about our approach <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-900/70 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Services" title="Solutions engineered for clarity, comfort, and control" description="From sound systems to meeting room automation, we design each solution around user experience and business outcomes." />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 transition hover:-translate-y-1 hover:border-cyan-400/40">
                <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">{service.title}</div>
                <p className="mt-5 text-lg leading-8 text-slate-300">{service.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-400">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2"><BadgeCheck size={16} className="text-cyan-300" /> {feature}</li>
                  ))}
                </ul>
                <p className="mt-5 text-sm leading-7 text-slate-400">{service.accent}</p>
                <Link href={service.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                  Explore service <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading eyebrow="Projects" title="Selected work shaped around real business needs" description="We create polished AV environments that elevate communication, security, and confidence." />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-lg shadow-slate-950/20">
              <div className="h-40 bg-gradient-to-br from-cyan-500/20 to-slate-800" />
              <div className="p-7">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">{project.category}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{project.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">{project.summary}</p>
                <Link href="/projects" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                  View case study <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/70 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow="Testimonials" title="Trusted by clients who value quality and consistency" description="Our work is measured not only by the systems we install, but by the confidence we create for every client." align="center" />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7">
                <p className="text-lg leading-8 text-slate-300">“{testimonial.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/15 to-slate-800/80 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <SectionHeading eyebrow="FAQ" title="Answers to the questions that matter most" description="We help clients evaluate the right systems, budget, and support strategy from the outset." />
          </div>
          <div className="space-y-4">
            {faqs.slice(0, 4).map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-white/10 bg-slate-950/80 px-5 py-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">{faq.question}</summary>
                <p className="mt-3 text-sm leading-7 text-slate-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="rounded-[2rem] border border-cyan-400/25 bg-cyan-500/10 p-8 text-center lg:p-12">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Ready to plan your next AV upgrade?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Let’s discuss your space, goals, and timeline. We’ll help you choose a system that supports your team, guests, and long-term operations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400">Request a quote <ArrowRight size={18} /></Link>
            <a href="https://wa.me/254715825819" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 px-6 py-3 font-semibold text-cyan-100 hover:bg-white/10">
              <MessageCircle size={18} /> Start WhatsApp chat
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
