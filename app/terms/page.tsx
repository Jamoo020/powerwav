import { SectionHeading } from "@/components/section-heading";

export default function TermsPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Terms" title="Terms of use" description="These terms define the conditions for using our website and engaging with our services." />
        <div className="mt-10 space-y-6 rounded-[2rem] border border-[var(--color-border)] bg-white p-10 text-[var(--color-muted)] shadow-sm">
          <p>By using this website, you agree to use the information and services provided responsibly and for lawful business purposes.</p>
          <p>All content on this site is provided for informational and promotional purposes. Any project proposal, quotation, or service scope remains subject to formal review and agreement.</p>
          <p>We reserve the right to update or change the site content, policies, and service information at any time without prior notice.</p>
          <p>For any questions, please contact info@powerwaveav.com.</p>
        </div>
      </section>
    </div>
  );
}
