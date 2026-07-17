import { SectionHeading } from "@/components/section-heading";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Privacy Policy" title="How we handle your information" description="We take data privacy seriously and want your experience with our website to feel clear and secure." />
        <div className="mt-10 space-y-6 rounded-[2rem] border border-[var(--color-border)] bg-white p-10 text-[var(--color-muted)] shadow-sm">
          <p>We collect contact information you provide through our website forms or direct communications so we can respond to enquiries, provide quotes, and keep you updated on relevant services.</p>
          <p>We may use your data to respond to your request, improve our website experience, and ensure we provide the right support for your project needs.</p>
          <p>We do not sell personal data. Information may be shared with trusted service providers who support our operations, such as email delivery or analytics tools, subject to appropriate safeguards.</p>
          <p>If you have questions about your data, please contact us at info@powerwaveav.com.</p>
        </div>
      </section>
    </div>
  );
}
