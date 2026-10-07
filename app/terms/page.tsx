import { SectionHeading } from "@/components/section-heading";

const sections = [
  {
    title: "1. General",
    body: (
      <>
        <p>
          These Terms &amp; Conditions apply to all quotations, sales, installations,
          repairs, maintenance services, and audio-visual projects provided by Power
          Wave AV (&ldquo;Power Wave AV&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;) to the customer (&ldquo;client&rdquo;, &ldquo;you&rdquo;, or
          &ldquo;your&rdquo;).
        </p>
        <p>
          By accepting a quotation, making a payment, approving a project, or instructing
          Power Wave AV to commence work, the client confirms acceptance of these Terms &amp;
          Conditions.
        </p>
      </>
    ),
  },
  {
    title: "2. Quotations",
    body: (
      <>
        <p>All quotations are based on the equipment, materials, specifications, and services stated in the quotation.</p>
        <p>Unless otherwise stated, quotations are valid for 14 days from the date of issue.</p>
        <p>Prices may change after the quotation validity period due to changes in supplier pricing, exchange rates, availability, taxes, or other market conditions.</p>
        <p>Any additional work, equipment, materials, or services not included in the original quotation will be quoted separately and must be approved by the client before commencement.</p>
        <p>A quotation does not constitute a confirmed order until it has been accepted by the client and the required deposit or payment has been received.</p>
      </>
    ),
  },
  {
    title: "3. Payment Terms",
    body: (
      <>
        <p>Unless otherwise agreed in writing, Power Wave AV may require a deposit before procurement, preparation, or commencement of a project.</p>
        <p>The balance shall be paid according to the payment schedule stated on the quotation or invoice.</p>
        <p>Equipment or materials specifically ordered for a client may require full or substantial payment before procurement.</p>
        <p>Power Wave AV reserves the right to suspend work or withhold delivery/handover where payment is overdue.</p>
        <p>Any additional costs resulting from work being delayed because of outstanding payment may be charged to the client.</p>
        <p>All payments should be made through the payment methods specified by Power Wave AV.</p>
      </>
    ),
  },
  {
    title: "4. Equipment and Materials",
    body: (
      <>
        <p>Equipment supplied will generally be as specified in the approved quotation.</p>
        <p>Where a specified product becomes unavailable, Power Wave AV may propose an equivalent or alternative product subject to the client&apos;s approval.</p>
        <p>Product images, illustrations, colours, and specifications shown in catalogues or promotional material may differ slightly from the actual product supplied.</p>
        <p>Equipment remains the property of Power Wave AV until full payment has been received, where applicable.</p>
        <p>Manufacturer specifications, warranties, and limitations may apply to individual products.</p>
      </>
    ),
  },
  {
    title: "5. Installation Services",
    body: (
      <>
        <p>Installation work will be carried out according to the agreed scope of work.</p>
        <p>The client is responsible for ensuring reasonable access to the installation site and providing necessary permissions where required.</p>
        <p>The client shall disclose any known site conditions that may affect installation, including concealed electrical wiring, plumbing, structural limitations, restricted access, or other hazards.</p>
        <p>Any additional work caused by previously undisclosed site conditions may result in additional charges.</p>
        <p>Where wall, ceiling, structural, electrical, or other building modifications are required beyond the agreed scope, these shall be quoted separately.</p>
        <p>Power Wave AV will take reasonable care during installation but cannot be held responsible for concealed infrastructure or pre-existing defects that were not reasonably identifiable before work commenced.</p>
      </>
    ),
  },
  {
    title: "6. Electrical Power and Site Requirements",
    body: (
      <>
        <p>The client is responsible for providing a suitable and safe power supply unless electrical works are specifically included in the quotation.</p>
        <p>Power Wave AV is not responsible for damage caused by unstable power, electrical surges, lightning, incorrect electrical connections, or other external electrical faults unless such damage results from Power Wave AV&apos;s proven negligence.</p>
        <p>Where necessary, Power Wave AV may recommend surge protection, UPS systems, voltage regulation, earthing, or other protective equipment.</p>
      </>
    ),
  },
  {
    title: "7. Delivery and Transport",
    body: (
      <>
        <p>Delivery charges, where applicable, will be stated separately in the quotation or invoice.</p>
        <p>Delivery dates are estimates unless a specific delivery date has been agreed in writing.</p>
        <p>Delays caused by suppliers, manufacturers, transport providers, customs, weather, or circumstances outside Power Wave AV&apos;s reasonable control may affect delivery timelines.</p>
        <p>The client shall inspect delivered equipment and notify Power Wave AV of any visible damage or discrepancy as soon as reasonably possible.</p>
      </>
    ),
  },
  {
    title: "8. Testing and Handover",
    body: (
      <>
        <p>Upon completion of an installation, Power Wave AV will test the system to confirm that the equipment operates substantially according to the agreed specifications.</p>
        <p>The client or an authorised representative may be required to inspect and approve the completed installation.</p>
        <p>Once the system has been tested and handed over, any additional modifications or changes requested by the client may attract additional charges.</p>
        <p>Where the client begins using the system after testing and handover, such use may constitute acceptance of the completed work, subject to any applicable warranty rights.</p>
      </>
    ),
  },
  {
    title: "9. Warranty",
    body: (
      <>
        <p>Warranty coverage will depend on the individual product manufacturer and/or the warranty stated on the quotation or invoice.</p>
        <p>Unless expressly stated otherwise, Power Wave AV&apos;s workmanship warranty applies only to work performed by Power Wave AV.</p>
        <p>Warranty does not normally cover damage caused by:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Misuse or negligence</li>
          <li>Accidental damage</li>
          <li>Water or liquid damage</li>
          <li>Power surges or electrical faults</li>
          <li>Lightning</li>
          <li>Unauthorised modification or repair</li>
          <li>Physical damage</li>
          <li>Incorrect operation</li>
          <li>Normal wear and tear</li>
          <li>Use outside the manufacturer&apos;s specifications</li>
        </ul>
        <p className="pt-3">Third-party equipment supplied by Power Wave AV may remain subject to the original manufacturer&apos;s warranty terms.</p>
        <p>The client may be required to provide proof of purchase or the relevant invoice when making a warranty claim.</p>
      </>
    ),
  },
  {
    title: "10. Repairs and Maintenance",
    body: (
      <>
        <p>Equipment submitted for repair may require inspection or diagnosis before the final repair cost can be determined.</p>
        <p>Where a diagnosis fee applies, the client will be informed before the work proceeds.</p>
        <p>Repairs requiring replacement parts will be subject to parts availability and applicable charges.</p>
        <p>Power Wave AV will seek client approval where the estimated repair cost differs materially from the initial estimate.</p>
        <p>Power Wave AV is not responsible for loss of data, recordings, configurations, or user settings during repair unless expressly agreed otherwise.</p>
        <p>Equipment left for repair or collection should be collected within the period communicated by Power Wave AV. Storage charges may apply to equipment left for an extended period where such charges have been communicated to the client.</p>
      </>
    ),
  },
  {
    title: "11. Changes to Projects",
    body: (
      <>
        <p>Any change to the agreed design, equipment, quantities, installation locations, or scope of work may affect the project cost and completion time.</p>
        <p>Additional work will be communicated to the client for approval before commencement wherever reasonably possible.</p>
        <p>Verbal requests for additional work should be confirmed through an appropriate written communication where practical.</p>
      </>
    ),
  },
  {
    title: "12. Cancellation",
    body: (
      <>
        <p>A client may request cancellation of an order or project before completion.</p>
        <p>Cancellation charges may apply where Power Wave AV has already purchased equipment, ordered special materials, commenced installation, paid third-party costs, or incurred other non-refundable expenses on behalf of the client.</p>
        <p>Custom-ordered, specially configured, or non-returnable equipment may not be eligible for cancellation or refund once procurement has commenced.</p>
        <p>Any refund will be assessed based on amounts already incurred and the terms applicable to the specific order.</p>
      </>
    ),
  },
  {
    title: "13. Client Responsibilities",
    body: (
      <>
        <p>The client shall:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Provide accurate information about the project requirements.</li>
          <li>Provide reasonable access to the installation site.</li>
          <li>Obtain necessary permissions where required.</li>
          <li>Provide suitable working conditions and access to required facilities.</li>
          <li>Protect valuable personal or business property at the installation site.</li>
          <li>Inform Power Wave AV of known hazards or site restrictions.</li>
          <li>Make payments according to the agreed terms.</li>
          <li>Operate equipment according to supplied instructions and recommendations.</li>
        </ul>
      </>
    ),
  },
  {
    title: "14. Network, Internet and Third-Party Services",
    body: (
      <>
        <p>Where an AV system depends on internet connectivity, Wi-Fi, streaming services, cloud services, or third-party platforms, Power Wave AV cannot guarantee the continuous availability of those third-party services.</p>
        <p>The client is responsible for maintaining an appropriate internet connection unless internet services are specifically included in the agreement.</p>
        <p>Changes made by third-party service providers may affect the operation of systems that depend on those services.</p>
      </>
    ),
  },
  {
    title: "15. Event and Live Production Services",
    body: (
      <>
        <p>Where Power Wave AV provides equipment or technical services for events:</p>
        <p>15.1. The client shall provide accurate event dates, times, venue details, equipment requirements, and access information.</p>
        <p>15.2. Additional charges may apply for extended working hours, overtime, additional equipment, venue changes, additional setup requirements, or delays caused by circumstances outside Power Wave AV&apos;s control.</p>
        <p>15.3. The client is responsible for obtaining necessary venue permissions and ensuring that the venue permits the proposed equipment and installation.</p>
      </>
    ),
  },
  {
    title: "16. Damage or Loss of Hired Equipment",
    body: (
      <>
        <p>Where Power Wave AV equipment is hired or rented:</p>
        <p>16.1. The client is responsible for the equipment while it is in their possession or under their control.</p>
        <p>16.2. The client may be charged for repair or replacement of equipment damaged, lost, stolen, or destroyed during the hire period, except where otherwise agreed in writing.</p>
        <p>16.3. Equipment must be returned in the same general condition in which it was provided, allowing for reasonable wear and tear.</p>
        <p>16.4. The client must not modify, dismantle, transfer, or sub-hire Power Wave AV equipment without prior authorization.</p>
      </>
    ),
  },
  {
    title: "17. Liability",
    body: (
      <>
        <p>Power Wave AV will provide its services with reasonable care and professional skill.</p>
        <p>Power Wave AV shall not be responsible for losses resulting from circumstances outside its reasonable control, including third-party service failures, power interruptions, natural events, supplier delays, venue restrictions, or unauthorized modification of equipment.</p>
        <p>Nothing in these Terms &amp; Conditions excludes liability that cannot legally be excluded under applicable law.</p>
      </>
    ),
  },
  {
    title: "18. Force Majeure",
    body: (
      <>
        <p>Power Wave AV shall not be liable for delays or failure to perform obligations caused by circumstances beyond its reasonable control, including but not limited to natural disasters, fire, flooding, strikes, civil disturbances, government restrictions, supplier failures, transport disruptions, power failures, or other unforeseen circumstances.</p>
      </>
    ),
  },
  {
    title: "19. Confidentiality",
    body: (
      <>
        <p>Both parties shall use reasonable efforts to protect confidential business, technical, financial, and operational information obtained during the course of a project, except where disclosure is required by law or necessary for the performance of the agreed services.</p>
      </>
    ),
  },
  {
    title: "20. Dispute Resolution",
    body: (
      <>
        <p>20.1. The parties shall first attempt to resolve any dispute through good-faith communication and negotiation.</p>
        <p>20.2. Where a dispute cannot be resolved through negotiation, the parties may pursue mediation, arbitration, or other lawful dispute-resolution procedures as appropriate.</p>
        <p>20.3. These Terms &amp; Conditions shall be interpreted in accordance with the applicable laws of Kenya.</p>
      </>
    ),
  },
  {
    title: "21. Acceptance of Terms",
    body: (
      <>
        <p>Acceptance of a Power Wave AV quotation, payment of a deposit or invoice, commencement of work, receipt of equipment, or instruction to proceed shall constitute acceptance of these Terms &amp; Conditions unless otherwise agreed in writing.</p>
        <p>Where a separate written agreement has been signed between Power Wave AV and the client, the terms of that agreement shall take precedence over these general Terms &amp; Conditions where there is a conflict.</p>
      </>
    ),
  },
  {
    title: "22. Contact and Customer Details",
    body: (
      <div className="space-y-4 text-sm text-slate-700">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-900">Power Wave AV</p>
            <p>Phone: ______________________________</p>
            <p>Email: ______________________________</p>
            <p>Physical Address: ____________________</p>
            <p>Website: _____________________________</p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Terms & Conditions"
          title="Power Wave AV Terms & Conditions"
          description="These terms govern quotations, project delivery, installation, repair, maintenance, and customer responsibilities for Power Wave AV services."
        />

        <div className="mt-10 rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-10">
          <div className="mb-8 grid gap-4 border-b border-slate-200 pb-6 text-sm text-slate-700 md:grid-cols-2">
            <div>
              <span className="font-semibold text-slate-900">Effective Date:</span> ____________________
            </div>
            <div>
              <span className="font-semibold text-slate-900">Quotation/Invoice No.:</span> ____________________
            </div>
          </div>

          <div className="space-y-8 text-[var(--color-muted)]">
            {sections.map(({ title, body }) => (
              <section key={title} className="scroll-mt-24">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
                <div className="space-y-3">{body}</div>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Client Acceptance</h3>
            <p className="mb-4">
              I/We confirm that I/we have read, understood, and accepted the above Terms &amp; Conditions.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-800">Client/Company Name:</p>
                <div className="border-b border-slate-300 pb-2">__________________________________</div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-800">Name of Authorized Representative:</p>
                <div className="border-b border-slate-300 pb-2">__________________________________</div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-800">Signature:</p>
                <div className="border-b border-slate-300 pb-2">__________________________________</div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-800">Date:</p>
                <div className="border-b border-slate-300 pb-2">__________________________________</div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-800">Power Wave AV Representative:</p>
                <div className="border-b border-slate-300 pb-2">__________________________________</div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-800">Signature:</p>
                <div className="border-b border-slate-300 pb-2">__________________________________</div>
              </div>
            </div>
            <div className="mt-6 text-center text-lg font-semibold italic text-slate-900">Powering Every Experience.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
