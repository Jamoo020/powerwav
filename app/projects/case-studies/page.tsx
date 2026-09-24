"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, X } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: Array<{ label: string; value: string }>;
  image: string;
  videoUrl?: string;
  testimonial?: {
    quote: string;
    name: string;
    role: string;
  };
}

const caseStudies: CaseStudy[] = [
  {
    id: "executive-boardroom-upgrade",
    title: "Executive Boardroom Upgrade",
    category: "Boardrooms",
    industry: "Corporate",
    summary: "A premium boardroom deployment with seamless conferencing, elegant presentation, and reliable automation.",
    challenge:
      "The client needed a workspace that could support modern hybrid meetings without visual clutter or technical complexity. Previous systems had confusing controls and frequent connectivity issues.",
    solution:
      "PowerWave AV designed a refined room with ceiling speakers, wireless presentation, professional PTZ camera, and one-touch automation. All controls integrated into a simple tablet interface, with failover redundancy.",
    results: [
      "Meeting start-up time reduced from 5+ minutes to under 1 minute",
      "99.5% system uptime over 12 months",
      "Executives report higher meeting quality and confidence",
      "System pays for itself through productivity gains within 18 months",
    ],
    metrics: [
      { label: "Meeting Start Time", value: "-80%" },
      { label: "Technical Issues", value: "-95%" },
      { label: "Executive Satisfaction", value: "9.2/10" },
      { label: "ROI Timeline", value: "18 months" },
    ],
    image: "/images/case-boardroom.jpeg",
    videoUrl: "https://www.youtube.com/embed/xOEDwECR2t0",
    testimonial: {
      quote:
        "PowerWave AV delivered exactly what we needed—a professional boardroom that works effortlessly. The team was responsive from planning through training, and ongoing support has been fantastic.",
      name: "Nadia K.",
      role: "Operations Director, Premium Financial Services",
    },
  },
  {
    id: "hotel-guest-experience-upgrade",
    title: "Hotel Guest Experience Upgrade",
    category: "Hospitality",
    industry: "Hotels",
    summary: "A multi-zone audio and digital display system that improved guest communication and event readiness.",
    challenge:
      "The hotel had outdated audio systems with dead zones, LED signage that was hard to manage, and conference rooms that couldn't support events professionally. Guests complained about sound quality.",
    solution:
      "We deployed distributed audio across public spaces and guest floors, modern LED displays for wayfinding and promotions, and conference room AV with video conferencing. Centralized control lets staff manage everything from one dashboard.",
    results: [
      "Guest satisfaction scores increased by 23% in 6 months",
      "Event bookings increased 18% due to professional AV capabilities",
      "Staff training time reduced from 3 days to 2 hours per person",
      "Annual operating costs decreased despite system improvements",
    ],
    metrics: [
      { label: "Guest Satisfaction +", value: "+23%" },
      { label: "Event Bookings +", value: "+18%" },
      { label: "Staff Training Time", value: "-93%" },
      { label: "Operating Cost Savings", value: "+12%" },
    ],
    image: "/images/case-hotel.jpeg",
    videoUrl: "https://www.youtube.com/embed/W2rH8y6rHO8",
    testimonial: {
      quote:
        "The hotel's guest experience has been transformed. Our teams love how easy the new systems are to use, and guests consistently comment on the quality. This investment was exactly what our property needed.",
      name: "James M.",
      role: "General Manager, Luxury 5-Star Hotel",
    },
  },
  {
    id: "restaurant-sound-transformation",
    title: "Restaurant Sound System Transformation",
    category: "Hospitality",
    industry: "Restaurants",
    summary: "An integrated audio and announcement system that improved ambience and guest communication.",
    challenge:
      "The restaurant had uneven sound—quiet corners near the kitchen, overwhelming noise in the bar area. Background music felt dated, and announcements were tinny or inaudible.",
    solution:
      "We designed a zone-based audio system with calibrated speaker placement, modern amplification, and integration with a streaming music service. Multiple independent zones allow different audio levels and content per area.",
    results: [
      "Guest comfort scores improved 34% in first month",
      "Staff can easily adjust audio for different times of day and service styles",
      "Flexibility supports live events and DJ nights without additional hardware",
      "Music streaming integration provides unlimited content updates",
    ],
    metrics: [
      { label: "Guest Comfort +", value: "+34%" },
      { label: "Audio Zones", value: "7" },
      { label: "Independent Control Points", value: "12+" },
      { label: "Monthly Cost (Music Service)", value: "KES 5,000" },
    ],
    image: "/images/case-restaurant.jpeg",
    testimonial: {
      quote:
        "The new sound system transformed our dining experience. Guests now comment positively on the ambience, and our team loves the flexibility. This is a difference we notice every single shift.",
      name: "Asha T.",
      role: "Owner, Fine Dining Restaurant",
    },
  },
  {
    id: "church-worship-experience",
    title: "Church Worship Experience Enhancement",
    category: "Worship",
    industry: "Churches",
    summary: "A complete worship sound system with live streaming and visual display for congregation engagement.",
    challenge:
      "The church's 30-year-old sound system produced feedback, had inconsistent coverage (silent corners), and couldn't support the pastor's growing ministry. Live streaming requests were frequent but technically impossible.",
    solution:
      "We installed a modern house sound system with wireless microphones, ceiling speakers for even coverage, live streaming video with professional lighting and camera control, and a projection system for scripture and lyrics.",
    results: [
      "Congregation reports significantly improved message clarity",
      "Weekly online viewers grew to 2,500+ from livestreamed services",
      "Volunteer audio technicians now train in under 2 hours",
      "System supports full church events, weddings, and special services",
      "No technical issues during services in 8+ months of operation",
    ],
    metrics: [
      { label: "Speech Intelligibility", value: "95%+" },
      { label: "Weekly Online Viewers", value: "2,500+" },
      { label: "Service Uptime", value: "99.8%" },
      { label: "Audio Coverage", value: "Complete" },
    ],
    image: "/images/case-church.jpeg",
    videoUrl: "https://www.youtube.com/embed/jNgDq3UZ_Kc",
    testimonial: {
      quote:
        "This system has been a blessing to our ministry. Members can finally hear clearly, and our online community has grown tremendously. PowerWave AV's professionalism and ongoing support have been exceptional.",
      name: "Pastor David",
      role: "Lead Pastor, Community Church",
    },
  },
];

export default function CaseStudiesPage() {
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const active = caseStudies.find((s) => s.id === selectedStudy) ?? caseStudies[0];

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Case Studies"
          title="Proven Results Across Verticals"
          description="See how we've transformed spaces and strengthened client operations with professional AV solutions."
        />

        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          {caseStudies.map((study) => (
            <button
              key={study.id}
              onClick={() => {
                setSelectedStudy(study.id);
                setShowVideo(false);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedStudy === study.id || (!selectedStudy && study === caseStudies[0])
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-[var(--color-border)]"
              }`}
            >
              {study.title}
            </button>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: Image / Video */}
          <motion.div
            key={`${selectedStudy}-image`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-slate-900 shadow-sm"
          >
            {showVideo && active.videoUrl ? (
              <div className="relative h-96 w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src={active.videoUrl}
                  title={`${active.title} Video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-[2rem]"
                />
              </div>
            ) : (
              <>
                <div className="relative h-96 overflow-hidden">
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                </div>
                {active.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition"
                  >
                    <Play size={28} className="text-white fill-white" />
                  </button>
                )}
              </>
            )}
            <div className="p-6">
              <span className="inline-flex rounded-full bg-[var(--color-primary)]/20 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                {active.category}
              </span>
            </div>
          </motion.div>

          {/* Right: Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStudy}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-semibold text-slate-950">{active.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{active.industry}</p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
                <p className="font-semibold text-slate-950 mb-2">Challenge</p>
                <p className="text-sm leading-6 text-slate-700">{active.challenge}</p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-blue-50 p-6">
                <p className="font-semibold text-slate-950 mb-2">Our Solution</p>
                <p className="text-sm leading-6 text-slate-700">{active.solution}</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                {active.metrics.map((metric, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-4 text-center">
                    <p className="text-lg font-bold text-[var(--color-primary)]">{metric.value}</p>
                    <p className="text-xs text-slate-600 mt-1">{metric.label}</p>
                  </div>
                ))}
              </div>

              {/* Results */}
              <div className="space-y-2">
                <p className="font-semibold text-slate-950">Key Results</p>
                <ul className="space-y-2">
                  {active.results.map((result, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                      {result}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              {active.testimonial && (
                <div className="rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-slate-50 to-white p-6">
                  <p className="text-sm italic leading-6 text-slate-700 mb-3">"{active.testimonial.quote}"</p>
                  <p className="font-semibold text-slate-950 text-sm">{active.testimonial.name}</p>
                  <p className="text-xs text-slate-600">{active.testimonial.role}</p>
                </div>
              )}

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda] transition"
              >
                Request Similar Solution <ArrowRight size={16} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <div className="mt-20 rounded-[2rem] border border-[var(--color-border)] bg-gradient-to-r from-blue-50 to-indigo-50 p-12 text-center">
          <h3 className="text-2xl font-semibold text-slate-950">Ready to Transform Your Space?</h3>
          <p className="mt-3 text-slate-700">
            Let's discuss how we can deliver similar results for your organization.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-semibold text-white hover:bg-[#105cda]"
            >
              Request a Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
