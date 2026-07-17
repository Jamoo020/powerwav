import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/icons";
import { blogPosts } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">{post.category}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
        <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">{post.excerpt}</p>
        <div className="mt-10 rounded-[2rem] border border-[var(--color-border)] bg-white p-10 text-[var(--color-muted)] shadow-sm">
          <p>Modern AV planning begins with understanding the environment, audience, and business objectives. For boardrooms, the right technology should support clarity, collaboration, and a polished first impression. For restaurants and hospitality venues, audio should add warmth and comfort without overpowering conversation. For schools and public spaces, reliability and ease of use matter just as much as visual impact.</p>
          <p className="mt-6">The most effective systems are designed around the people using them, not simply the devices on the shelf. That is why PowerWave AV approaches every installation with careful consultation, site understanding, and a strong focus on long-term support.</p>
          <p className="mt-6">A thoughtful implementation can improve guest experience, staff efficiency, and confidence in every room. Whether the goal is better meetings, improved customer engagement, or stronger security, the right AV strategy creates lasting value.</p>
        </div>
        <div className="mt-10 rounded-[2rem] border border-[var(--color-primary)]/20 bg-[rgba(20,110,245,0.08)] p-10">
          <h2 className="text-2xl font-semibold text-slate-950">Why it matters</h2>
          <p className="mt-4 text-[var(--color-muted)]">A well-designed AV system improves communication, supports operations, and helps teams look prepared and professional. It also reduces frustration by making rooms easier to use and maintain.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda]">Discuss your project <ArrowRight size={18} /></Link>
          <Link href="/services" className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">Explore services</Link>
        </div>
      </section>
    </div>
  );
}
