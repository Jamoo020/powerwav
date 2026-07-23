"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/lib/content";

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState(projects[0]?.title ?? "");

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Projects" title="Selected work that reflects our approach" description="Each project is designed to solve a real operational challenge with flexibility, style, and dependable performance." />

        <div className="mt-10 flex flex-wrap gap-3">
          {projects.map((project) => (
            <button
              key={project.title}
              onClick={() => setActiveProject(project.title)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeProject === project.title ? "bg-[var(--color-primary)] text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
            >
              {project.category}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
            <div className="relative h-72 overflow-hidden">
              <Image
                src={projects.find((project) => project.title === activeProject)?.image ?? "/images/hero-graphic.svg"}
                alt={activeProject}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />
              <span className="absolute left-6 top-6 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white backdrop-blur">
                {projects.find((project) => project.title === activeProject)?.category}
              </span>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-slate-950">{activeProject}</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {projects.find((project) => project.title === activeProject)?.summary}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-[2rem] border border-[var(--color-border)] bg-white p-8 shadow-sm"
            >
              {projects.filter((project) => project.title === activeProject).map((project) => (
                <div key={project.title}>
                  <p><span className="font-semibold text-slate-950">Challenge:</span> {project.challenge}</p>
                  <p className="mt-4"><span className="font-semibold text-slate-950">Solution:</span> {project.solution}</p>
                  <p className="mt-4"><span className="font-semibold text-slate-950">Result:</span> {project.results}</p>
                  <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
                    Discuss your project <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
