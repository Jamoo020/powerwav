import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/icons";
import { blogPosts } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

const blogDetails: Record<string, { heading: string; points: string[]; takeaway: string }> = {
  "choosing-the-right-boardroom-technology": {
    heading: "Key decisions for a reliable boardroom",
    points: [
      "Choose audio and display systems that are sized for the room and the people who will use it.",
      "Plan camera placement, lighting, and microphone coverage with both in-person and remote attendees in mind.",
      "Build simple controls so meetings start quickly and everyone can present without friction.",
      "Use a clean, professional layout that keeps cables hidden and the room feeling uncluttered.",
    ],
    takeaway: "A successful boardroom removes distractions and helps teams stay focused on the meeting, not the technology.",
  },
  "how-led-displays-improve-customer-experience": {
    heading: "Why modern displays matter",
    points: [
      "Choose brightness and contrast that work in busy, guest-facing spaces.",
      "Use content management tools to keep messaging fresh and relevant.",
      "Position screens where they support wayfinding, promotions, and guest comfort.",
      "Pair displays with sound and lighting so every element feels cohesive.",
    ],
    takeaway: "The right display system makes spaces feel more modern, informative, and welcoming.",
  },
  "restaurant-sound-system-guide": {
    heading: "What makes restaurant audio work",
    points: [
      "Balance speaker placement for even coverage that supports conversation everywhere in the room.",
      "Give staff easy control over volume zones so dining and service areas stay comfortable.",
      "Choose systems that deliver clear speech without overpowering background music.",
      "Plan for durable, easy-to-maintain equipment that performs consistently evening after evening.",
    ],
    takeaway: "Well-designed restaurant audio helps guests feel relaxed and keeps staff from fighting the system.",
  },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  const detail = blogDetails[slug] || {
    heading: "Practical AV guidance",
    points: ["Focus on people-first systems, not just technology."],
    takeaway: "The best AV projects support user experience, reliability, and future flexibility.",
  };

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
          <div className="mt-8 rounded-[1.75rem] border border-[var(--color-border)] bg-slate-50 p-8">
            <h2 className="text-2xl font-semibold text-slate-950">{detail.heading}</h2>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              {detail.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-medium text-slate-700">{detail.takeaway}</p>
          </div>
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
