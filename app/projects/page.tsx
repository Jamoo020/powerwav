import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/lib/content";

export default function ProjectsPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Projects" title="Selected work that reflects our approach" description="Each project is designed to solve a real operational challenge with flexibility, style, and dependable performance." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
              <div className="relative h-48 bg-[radial-gradient(circle_at_top_left,_rgba(20,110,245,0.16),_transparent_40%),#0B1F3A] p-6">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">{project.category}</span>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-slate-950">{project.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{project.summary}</p>
                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-950">Challenge:</span> {project.challenge}</p>
                  <p><span className="font-semibold text-slate-950">Solution:</span> {project.solution}</p>
                  <p><span className="font-semibold text-slate-950">Result:</span> {project.results}</p>
                </div>
                <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[#105cda]">
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
