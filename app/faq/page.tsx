"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { Expandable } from "@/components/expandable";
import { faqs } from "@/lib/content";

export default function FaqPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="FAQ" title="Common questions about AV projects in Kenya" description="We help clients make informed decisions around scope, installation, support, and long-term value." />
        <div className="mt-12 max-w-3xl mx-auto grid gap-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Expandable title={faq.question}>
                <p className="leading-relaxed">{faq.answer}</p>
              </Expandable>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
