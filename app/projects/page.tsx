import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/lib/content";

export default function ProjectsPage() {
  return (
    <div className="bg-slate-950">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Projects" title="Selected work that reflects our approach" description="Each project is designed to solve a real operational challenge with flexibility, style, and dependable performance." />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-lg shadow-slate-950/30">
              <div className="h-40 bg-gradient-to-br from-cyan-500/20 to-slate-800" />
              <div className="p-7">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">{project.category}</p>
                <h2 className="mt-3 text-xl font-semibold text-white">{project.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-400">{project.summary}</p>
                <p className="mt-5 text-sm leading-7 text-slate-400"><span className="font-semibold text-white">Challenge:</span> {project.challenge}</p>
                <p className="mt-2 text-sm leading-7 text-slate-400"><span className="font-semibold text-white">Solution:</span> {project.solution}</p>
                <p className="mt-2 text-sm leading-7 text-slate-400"><span className="font-semibold text-white">Result:</span> {project.results}</p>
                <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                  Discuss your project <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
