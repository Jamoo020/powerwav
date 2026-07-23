"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { Tabs } from "@/components/tabs";
import { AnimatedCard } from "@/components/animated-card";
import { services } from "@/lib/content";

const serviceCategories = [
  { id: "all", label: "All Services" },
  { id: "audio", label: "Audio" },
  { id: "video", label: "Video & Display" },
  { id: "conferencing", label: "Conferencing" },
  { id: "security", label: "Security" },
  { id: "support", label: "Support" },
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter((service) => {
        const title = service.title.toLowerCase();
        if (activeCategory === "audio") return title.includes("sound");
        if (activeCategory === "video") return title.includes("video") || title.includes("display");
        if (activeCategory === "conferencing") return title.includes("boardroom") || title.includes("conference");
        if (activeCategory === "security") return title.includes("cctv") || title.includes("security");
        if (activeCategory === "support") return title.includes("maintenance");
        return true;
      });

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Services" title="Premium AV solutions for every operational need" description="Every service is planned around business outcomes, user experience, and long-term reliability." />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <Tabs tabs={serviceCategories} activeTab={activeCategory} onTabChange={setActiveCategory} className="justify-center mb-12" />
        </motion.div>

        <motion.div 
          layout
          className="grid gap-6 lg:grid-cols-2"
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <AnimatedCard delay={index * 0.1}>
                <div className="p-10">
                  <div className="inline-flex rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-3 py-1 text-sm font-semibold text-[var(--color-primary)]">{service.title}</div>
                  <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">{service.description}</p>
                  <ul className="mt-8 space-y-3 text-sm text-slate-600">
                    {service.features.map((feature) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3"
                      >
                        <BadgeCheck size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <p className="mt-8 text-sm leading-7 text-slate-500">{service.accent}</p>
                  <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda] transition-colors">
                    Request a tailored proposal <ArrowRight size={16} />
                  </Link>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
