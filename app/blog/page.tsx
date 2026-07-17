import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { blogPosts } from "@/lib/content";

export default function BlogPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Blog" title="Practical insights for modern AV planning" description="Explore guides and ideas that help businesses make better decisions around rooms, sound, security, and experience design." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.slug} className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm">
              <div className="relative h-44 bg-[radial-gradient(circle_at_top_left,_rgba(20,110,245,0.16),_transparent_40%),#0B1F3A] p-6">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">{post.category}</span>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-slate-950">{post.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{post.excerpt}</p>
                <div className="mt-8 flex items-center justify-between text-sm text-slate-500">
                  <span>{post.readTime}</span>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 font-semibold text-[var(--color-primary)] hover:text-[#105cda]">Read more <ArrowRight size={16} /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
