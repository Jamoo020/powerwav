import { SectionHeading } from "@/components/section-heading";

const sectionClass = "space-y-4";
const headingClass = "text-xl font-semibold text-slate-900";
const subsectionClass = "text-base font-semibold text-slate-900";
const listClass = "list-disc space-y-2 pl-6";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Power Wave AV"
          title="Privacy Policy"
          description="How we collect, use, protect, and manage your personal information."
        />

        <article className="mt-10 space-y-10 text-base leading-7 text-[var(--color-muted)]">
          <div>
            <p className="font-semibold text-slate-900">Effective Date: 30 September 2026</p>
            <p className="mt-4">
              Power Wave AV respects your privacy and is committed to protecting the personal information you provide when using our services, visiting our website, contacting us, or doing business with us.
            </p>
            <p className="mt-3">
              This Privacy Policy explains what information we collect, how we use it, how we protect it, and the choices available to you.
            </p>
          </div>

          <section className={sectionClass}>
            <h2 className={headingClass}>1. Information We Collect</h2>
            <p>Depending on the services you request, we may collect the following information:</p>
            <div className="space-y-5">
              <div className="space-y-2">
                <h3 className={subsectionClass}>1.1 Personal Information</h3>
                <p>This may include:</p>
                <ul className={listClass}>
                  <li>Full name</li>
                  <li>Telephone number</li>
                  <li>Email address</li>
                  <li>Physical or business address</li>
                  <li>Company or organization name</li>
                  <li>Identification or other information where reasonably necessary for a service</li>
                  <li>Information contained in customer communications</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className={subsectionClass}>1.2 Service Information</h3>
                <p>When you request our services, we may collect information relating to:</p>
                <ul className={listClass}>
                  <li>Audio-visual equipment</li>
                  <li>CCTV installation and maintenance</li>
                  <li>Sound system installation</li>
                  <li>Event production</li>
                  <li>Equipment hire</li>
                  <li>Equipment purchases</li>
                  <li>Installation locations</li>
                  <li>Service quotations and invoices</li>
                  <li>Maintenance and repair requirements</li>
                  <li>Delivery and collection arrangements</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className={subsectionClass}>1.3 Payment Information</h3>
                <p>We may collect information necessary to process and confirm payments, including transaction references and payment records.</p>
                <p>Where payments are processed through third-party payment providers, their own privacy policies may also apply.</p>
              </div>
              <div className="space-y-2">
                <h3 className={subsectionClass}>1.4 Website and Technical Information</h3>
                <p>When you use our website, we may automatically receive certain technical information, such as:</p>
                <ul className={listClass}>
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Pages visited</li>
                  <li>Date and time of visits</li>
                  <li>Website interaction information</li>
                </ul>
                <p>This information may be used to maintain website security and improve our services.</p>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>2. How We Use Your Information</h2>
            <p>We may use your information to:</p>
            <ul className={listClass}>
              <li>Respond to enquiries and requests</li>
              <li>Prepare quotations and invoices</li>
              <li>Provide products and services</li>
              <li>Schedule installations and maintenance</li>
              <li>Deliver or collect equipment</li>
              <li>Process and confirm payments</li>
              <li>Communicate with customers</li>
              <li>Provide customer support</li>
              <li>Maintain records of services provided</li>
              <li>Improve our products and services</li>
              <li>Send information about our services and promotions where permitted</li>
              <li>Prevent fraud, misuse, or unauthorized activity</li>
              <li>Protect our business, customers, employees, and equipment</li>
              <li>Comply with applicable legal and regulatory requirements</li>
            </ul>
            <p>We will only use personal information for legitimate business purposes or other purposes permitted by applicable law.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>3. CCTV and Security Information</h2>
            <p>Where Power Wave AV installs CCTV systems for customers, the customer generally remains responsible for determining how the CCTV system is used and how recorded footage is managed.</p>
            <p>Power Wave AV may access CCTV systems or recorded footage when reasonably necessary to:</p>
            <ul className={listClass}>
              <li>Install or configure equipment</li>
              <li>Diagnose technical problems</li>
              <li>Perform maintenance</li>
              <li>Provide technical support</li>
              <li>Test system functionality</li>
              <li>Investigate a service-related issue where authorized</li>
            </ul>
            <p>We will not intentionally access or disclose customer CCTV footage for unrelated purposes.</p>
            <p>Customers using CCTV systems are responsible for ensuring that their use of the system complies with applicable privacy and data-protection requirements.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>4. Photographs, Videos and Project Content</h2>
            <p>With appropriate permission, Power Wave AV may take photographs or videos of completed installations, events, equipment, or projects for documentation, portfolio, marketing, or promotional purposes.</p>
            <p>We will seek appropriate consent before using identifiable customer images, private premises, or other material where consent is required.</p>
            <p>Customers may contact us if they have concerns about the use of project photographs or videos.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>5. Sharing of Personal Information</h2>
            <p>We may share information where reasonably necessary to provide our services or operate our business.</p>
            <p>This may include sharing relevant information with:</p>
            <ul className={listClass}>
              <li>Payment service providers</li>
              <li>Delivery and logistics providers</li>
              <li>Equipment suppliers</li>
              <li>Installation technicians or contractors</li>
              <li>Website and hosting providers</li>
              <li>Professional advisers</li>
              <li>IT and technical service providers</li>
              <li>Government authorities or law-enforcement agencies where legally required</li>
            </ul>
            <p>We do not sell customers&apos; personal information as a business practice.</p>
            <p>Where third parties process information on our behalf, we expect them to handle that information appropriately and securely.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>6. Data Security</h2>
            <p>Power Wave AV takes reasonable measures to protect personal information against:</p>
            <ul className={listClass}>
              <li>Unauthorized access</li>
              <li>Unauthorized disclosure</li>
              <li>Loss</li>
              <li>Misuse</li>
              <li>Alteration</li>
              <li>Destruction</li>
            </ul>
            <p>However, no electronic transmission or storage system can be guaranteed to be completely secure.</p>
            <p>Customers should also take reasonable precautions when providing sensitive information through the internet, email, messaging platforms, or other communication channels.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>7. Data Retention</h2>
            <p>We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, including:</p>
            <ul className={listClass}>
              <li>Providing ongoing services</li>
              <li>Maintaining business and transaction records</li>
              <li>Resolving disputes</li>
              <li>Meeting accounting and legal requirements</li>
              <li>Protecting our legitimate business interests</li>
            </ul>
            <p>When information is no longer reasonably required, we may securely delete, anonymize, or otherwise dispose of it where appropriate.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>8. Customer Rights</h2>
            <p>Subject to applicable law, you may have rights relating to your personal information, including the right to:</p>
            <ul className={listClass}>
              <li>Request access to personal information we hold about you</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Request deletion of information where legally applicable</li>
              <li>Object to or request restriction of certain processing</li>
              <li>Withdraw consent where processing is based on consent</li>
              <li>Raise a concern about how your personal information is being handled</li>
            </ul>
            <p>Requests should be submitted using the contact details provided below.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>9. Marketing Communications</h2>
            <p>Where permitted, Power Wave AV may communicate with customers about:</p>
            <ul className={listClass}>
              <li>New products</li>
              <li>Services</li>
              <li>Special offers</li>
              <li>Equipment</li>
              <li>Events</li>
              <li>Company updates</li>
            </ul>
            <p>Customers may request that we stop sending promotional communications.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>10. Third-Party Websites and Services</h2>
            <p>Our website or communications may contain links to third-party websites, social-media platforms, payment services, or other external services.</p>
            <p>Power Wave AV is not responsible for the privacy practices of third-party websites or services.</p>
            <p>We encourage customers to review the privacy policies of those third parties before providing personal information.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>11. Children&apos;s Information</h2>
            <p>Our services are primarily intended for businesses, organizations, event organizers, and adult customers.</p>
            <p>We do not intentionally collect personal information from children unless there is a legitimate reason to do so and appropriate legal requirements are satisfied.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>12. Changes to This Privacy Policy</h2>
            <p>Power Wave AV may update this Privacy Policy from time to time to reflect changes in our services, technology, business practices, or applicable legal requirements.</p>
            <p>The latest version will be made available through our website or other appropriate communication channels.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>13. Contact Us</h2>
            <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact Power Wave AV through:</p>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">Power Wave AV</p>
              <p><span className="font-medium text-slate-900">Email:</span> <a className="text-[var(--color-primary)] underline" href="mailto:info@powerwaveav.com">info@powerwaveav.com</a></p>
              <p><span className="font-medium text-slate-900">Phone:</span> <a className="text-[var(--color-primary)] underline" href="tel:0116882307">0116882307</a></p>
              <p><span className="font-medium text-slate-900">Website:</span> powerwaveav.com</p>
            </div>
            <p>We will make reasonable efforts to respond to privacy-related requests within the applicable legal timeframe.</p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>14. Acceptance</h2>
            <p>By using our website or engaging Power Wave AV for our services, you acknowledge that you have had an opportunity to review this Privacy Policy.</p>
            <p><span className="font-semibold text-slate-900">Power Wave AV</span> is committed to handling customer information responsibly, securely, and transparently.</p>
          </section>
        </article>
      </section>
    </div>
  );
}