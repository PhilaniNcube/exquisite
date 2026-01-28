import { cacheLife } from "next/cache";
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | Exquisite Photography",
  description:
    "Terms and conditions for using Exquisite Photography services and website.",
};

const Terms = async () => {
  "use cache";
  cacheLife("weeks");
  return (
    <div className="container mx-auto px-4 py-36 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Terms and Conditions
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-600 mb-8 text-center">
          Please read these terms and conditions carefully before using our
          services or website.
        </p>

        <section className="mb-8 bg-blue-50 p-6 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Last Updated:</strong> 5 November 2025
          </p>
          <p className="text-sm text-gray-600">
            These Terms and Conditions govern your use of Exquisite
            Photography's services and website. By accessing our website or
            using our services, you agree to be bound by these terms and all
            applicable laws and regulations in South Africa, including the
            Consumer Protection Act 68 of 2008 and the Protection of Personal
            Information Act, 2013 (POPIA).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By booking a photography session, placing an order, or using our
            website, you acknowledge that you have read, understood, and agree
            to be bound by these Terms and Conditions, along with our:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refund" className="text-blue-600 hover:underline">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/returns" className="text-blue-600 hover:underline">
                Returns Policy
              </Link>
            </li>
            <li>
              <Link
                href="/cancellation-policy"
                className="text-blue-600 hover:underline"
              >
                Cancellation Policy
              </Link>
            </li>
          </ul>
          <p className="mt-4">
            If you do not agree with any part of these terms, you must not use
            our services or website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. About Exquisite Photography
          </h2>
          <p className="mb-4">
            Exquisite Photography is a professional photography business based
            in South Africa, providing:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Professional photography services (portraits, events, commercial)
            </li>
            <li>School photography programmes</li>
            <li>Custom print products and digital downloads</li>
            <li>Photo editing and retouching services</li>
            <li>Online gallery and ordering services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. Booking and Appointments
          </h2>

          <h3 className="text-xl font-medium mb-3">3.1 Session Bookings</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              All photography session bookings must be confirmed in writing
              (email or written confirmation)
            </li>
            <li>A deposit may be required to secure your booking date</li>
            <li>
              Deposits are non-refundable except as outlined in our{" "}
              <Link
                href="/cancellation-policy"
                className="text-blue-600 hover:underline"
              >
                Cancellation Policy
              </Link>
            </li>
            <li>
              Session times are estimates and may vary based on conditions and
              circumstances
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            3.2 Client Responsibilities
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Arrive on time for scheduled sessions</li>
            <li>Provide accurate contact information and delivery addresses</li>
            <li>
              Inform us of any special requirements or accessibility needs in
              advance
            </li>
            <li>
              For school photography, ensure necessary permissions and consents
              are obtained
            </li>
            <li>
              Ensure children are supervised and cooperative during sessions
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            3.3 Cancellations and Rescheduling
          </h3>
          <p className="mb-4">
            All cancellations and rescheduling requests are governed by our{" "}
            <Link
              href="/cancellation-policy"
              className="text-blue-600 hover:underline"
            >
              Cancellation Policy
            </Link>
            , which includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Timeframes for cancellation with full, partial, or no refund
            </li>
            <li>Rescheduling fees based on notice provided</li>
            <li>Force majeure circumstances</li>
            <li>Photographer-initiated cancellations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Payments and Pricing
          </h2>

          <h3 className="text-xl font-medium mb-3">4.1 Payment Terms</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              All prices are in South African Rand (ZAR) unless otherwise stated
            </li>
            <li>
              Prices are subject to change without notice but confirmed bookings
              honour quoted prices
            </li>
            <li>
              Payment can be made via EFT, credit card, or other approved
              payment methods
            </li>
            <li>
              Full payment is required before delivery of products or digital
              files
            </li>
            <li>We reserve the right to charge interest on overdue accounts</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">4.2 Deposits</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Deposits secure your booking date and are applied to the final
              balance
            </li>
            <li>
              Deposit refunds are subject to our{" "}
              <Link
                href="/cancellation-policy"
                className="text-blue-600 hover:underline"
              >
                Cancellation Policy
              </Link>
            </li>
            <li>Deposits are typically 30-50% of the total estimated cost</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">4.3 Additional Fees</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Travel fees may apply for locations beyond our standard service
              area
            </li>
            <li>Rush processing fees for expedited delivery</li>
            <li>Late payment fees as permitted by law</li>
            <li>Rescheduling fees as outlined in our Cancellation Policy</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Copyright and Intellectual Property
          </h2>

          <h3 className="text-xl font-medium mb-3">5.1 Copyright Ownership</h3>
          <p className="mb-4">
            Exquisite Photography retains full copyright and intellectual
            property rights to all photographs, images, and creative works
            produced during photography services. This includes:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Original photographs and images</li>
            <li>Edited and retouched versions</li>
            <li>Digital files and negatives</li>
            <li>Proofs and previews</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            5.2 Usage Rights Granted to Clients
          </h3>
          <p className="mb-4">
            Upon full payment, clients receive a limited, non-exclusive license
            to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Display images for personal, non-commercial use</li>
            <li>
              Share on personal social media accounts (with photographer credit
              appreciated)
            </li>
            <li>Print additional copies for personal use</li>
            <li>Use for personal website or blog (non-commercial)</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            5.3 Restrictions on Usage
          </h3>
          <p className="mb-4">Without written permission, clients may not:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use images for commercial purposes or advertising</li>
            <li>Sell, license, or sublicense images to third parties</li>
            <li>Remove watermarks or copyright notices</li>
            <li>Alter images and present them as the photographer's work</li>
            <li>Enter images into competitions without photographer consent</li>
            <li>Claim copyright or ownership of the photographs</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            5.4 Photographer's Rights to Use Images
          </h3>
          <p className="mb-4">
            Unless specifically restricted in writing, we reserve the right to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use images for portfolio and promotional purposes</li>
            <li>Display images on our website and social media</li>
            <li>Submit images to photography competitions and publications</li>
            <li>Use images for marketing and advertising our services</li>
          </ul>
          <p className="text-sm text-gray-600">
            Clients may request that their images not be used publicly by
            notifying us in writing. This is handled in accordance with our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Privacy and Data Protection
          </h2>
          <p className="mb-4">
            We are committed to protecting your personal information in
            accordance with POPIA (Protection of Personal Information Act,
            2013). Our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            explains:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>What personal information we collect and how we use it</li>
            <li>How we protect and store your data</li>
            <li>
              Your rights under POPIA (access, correction, deletion, objection)
            </li>
            <li>How we handle children's personal information</li>
            <li>Our use of cookies and tracking technologies</li>
            <li>How to exercise your data protection rights</li>
          </ul>
          <p className="mb-4">Key points include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We never sell your personal information to third parties</li>
            <li>
              We require explicit consent before using images for marketing
              purposes
            </li>
            <li>
              Special protections apply to children's images and information
            </li>
            <li>
              You have the right to request deletion of your images and personal
              data
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Product Orders, Delivery, and Quality
          </h2>

          <h3 className="text-xl font-medium mb-3">7.1 Ordering Process</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              All orders must be placed through our website or confirmed in
              writing
            </li>
            <li>Orders are subject to availability and acceptance</li>
            <li>
              We reserve the right to refuse or cancel orders for any reason
            </li>
            <li>Order confirmation will be sent via email</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">7.2 Delivery</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Estimated delivery times are provided but not guaranteed</li>
            
            <li>
              Customers must inspect items upon delivery and report damage
              immediately
            </li>
            <li>
              Delivery delays due to courier or force majeure are beyond our
              control
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-3">7.3 Quality Standards</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>We guarantee prints are free from manufacturing defects</li>
            <li>Colour variations between screens and prints are normal</li>
            <li>
              Print quality depends on the resolution of source images provided
            </li>
            <li>We recommend minimum 300 DPI for optimal print quality</li>
            <li>Custom orders are final once approved by the customer</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Refunds and Returns
          </h2>
          <p className="mb-4">
            Our{" "}
            <Link href="/refund" className="text-blue-600 hover:underline">
              Refund Policy
            </Link>{" "}
            and{" "}
            <Link href="/returns" className="text-blue-600 hover:underline">
              Returns Policy
            </Link>
            comply with the Consumer Protection Act 68 of 2008 and outline:
          </p>

          <h3 className="text-xl font-medium mb-3">8.1 Refund Eligibility</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Defective products or printing errors</li>
            <li>Damage during delivery</li>
            <li>Wrong items delivered</li>
            <li>Goods not matching description</li>
            <li>Items not fit for purpose</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">8.2 Returns Process</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Returns must be authorised within 7 days of delivery for eligible items
            </li>
            <li>
              Return Authorisation Number (RAN) required before returning items
            </li>
            <li>Items must be returned in original condition with packaging</li>
           
          </ul>

          <h3 className="text-xl font-medium mb-3">8.3 Non-Returnable Items</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Custom-made products (unless defective)</li>
            <li>Digital downloads after delivery</li>
            <li>Change of mind on personalised items</li>
            <li>Items damaged after delivery (unless due to defect)</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">8.4 Refund Timeline</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Refunds processed within 3-5 business days after inspection</li>
            <li>EFT refunds reflect in 1-3 business days</li>
            <li>Credit card refunds take 5-10 business days</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. Liability and Limitations
          </h2>

          <h3 className="text-xl font-medium mb-3">
            9.1 Limitation of Liability
          </h3>
          <p className="mb-4">
            To the fullest extent permitted by law, Exquisite Photography's
            liability is limited to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              The total amount paid by the client for the specific service or
              product
            </li>
            <li>Refund or replacement of defective products</li>
            <li>
              Re-shoot of photography session (subject to photographer
              availability)
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            9.2 Circumstances Beyond Our Control
          </h3>
          <p className="mb-4">
            We are not liable for failure to perform due to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Acts of God (floods, fires, natural disasters)</li>
            <li>Government restrictions or regulations</li>
            <li>Public health emergencies</li>
            <li>Equipment failure or theft</li>

            <li>Power outages or internet failures</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">9.3 Data Loss</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              We maintain backups of images but are not liable for data loss due
              to equipment failure, theft, or disaster
            </li>
            <li>
              Clients are encouraged to order and backup their images promptly
            </li>
            <li>
              We typically retain images for 1-2 years but this is not
              guaranteed
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-3">9.4 Third-Party Services</h3>
          <ul className="list-disc pl-6 space-y-2">
           
            <li>
              We will assist in resolving issues with third parties but are not
              liable for their actions
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            10. Consumer Protection Rights
          </h2>
          <p className="mb-4">
            Under the Consumer Protection Act 68 of 2008, you have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Receive goods and services of good quality</li>
            <li>Fair and honest dealings</li>
            <li>Fair and responsible marketing</li>
            <li>Protection from unfair contract terms</li>
            <li>Return defective goods within 7 days</li>
            <li>Clear and accurate information about products and services</li>
          </ul>
          <p className="mb-4">
            If you are not satisfied with our resolution of your complaint, you
            may:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact the Consumer Goods and Services Ombud</li>
            <li>Lodge a complaint with the National Consumer Commission</li>
            <li>Approach your provincial Consumer Protection Authority</li>
            <li>Call the Consumer Protection Helpline: 0860 003 600</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            11. Website Use and Online Gallery
          </h2>

          <h3 className="text-xl font-medium mb-3">11.1 Account Security</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              You are responsible for maintaining the confidentiality of your
              account credentials
            </li>
            <li>Notify us immediately of any unauthorised account use</li>
            <li>
              Do not share your gallery access codes with unauthorised persons
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            11.2 Prohibited Activities
          </h3>
          <p className="mb-4">You may not:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Download images without proper authorisation or payment</li>
            <li>Attempt to bypass watermarks or security measures</li>
            <li>
              Share gallery passwords publicly or with unauthorised persons
            </li>
            <li>Use automated tools to download or scrape images</li>
            <li>Upload malicious code or engage in hacking activities</li>
            <li>Misuse or abuse our website or services</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">11.3 Gallery Access</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Online galleries are password-protected and available for limited
              time periods
            </li>
            <li>Gallery access typically expires after 30 days</li>
            <li>
              Extended gallery hosting may be available for an additional fee
            </li>
            <li>Deleted galleries cannot be recovered</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            12. School Photography Programmes
          </h2>

          <h3 className="text-xl font-medium mb-3">12.1 School Arrangements</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              School photography is conducted per agreement with the educational
              institution
            </li>
            <li>
              Schools must obtain necessary parental consents for photography
            </li>
           
            <li>Weather-related cancellations will be rescheduled</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            12.2 Parent/Guardian Rights
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Parents have the right to opt out of school photography</li>
            <li>No obligation to purchase photos</li>
            <li>Preview images before ordering (where applicable)</li>
            <li>Request that images not be used for marketing purposes</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">
            12.3 POPIA Compliance for Children
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Parental consent required before photographing children</li>
            <li>Special protections for children under 12</li>
            <li>
              Images of minors not used for marketing without explicit consent
            </li>
            <li>Parents may request deletion of children's images</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            13. Dispute Resolution
          </h2>

          <h3 className="text-xl font-medium mb-3">13.1 Complaint Process</h3>
          <p className="mb-4">If you have a complaint or dispute:</p>
          <ol className="list-decimal pl-6 mb-4 space-y-2">
            <li>Contact us directly via email or phone</li>
            <li>Provide detailed information about your concern</li>
            <li>We will respond within 2 business days</li>
            <li>We aim to resolve complaints within 5-7 business days</li>
          </ol>

          <h3 className="text-xl font-medium mb-3">13.2 Escalation</h3>
          <p className="mb-4">
            If internal resolution is unsuccessful, disputes may be referred to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Consumer Goods and Services Ombud</li>
            <li>National Consumer Commission</li>
            <li>Provincial Consumer Protection Authority</li>
            <li>Mediation or arbitration (if mutually agreed)</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">13.3 Jurisdiction</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>These terms are governed by South African law</li>
            <li>
              Disputes are subject to the jurisdiction of South African courts
            </li>
            <li>
              Consumer Protection Act 68 of 2008 takes precedence over
              conflicting terms
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            14. Amendments to Terms
          </h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>We reserve the right to modify these terms at any time</li>
            <li>
              Changes become effective immediately upon posting on our website
            </li>
            <li>
              Continued use of our services constitutes acceptance of modified
              terms
            </li>
            <li>
              Bookings made prior to changes are governed by the terms in effect
              at booking time
            </li>
            <li>
              Material changes will be communicated via email to registered
              users
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Severability</h2>
          <p className="mb-4">
            If any provision of these terms is found to be invalid or
            unenforceable by a court of law, the remaining provisions shall
            remain in full force and effect. Invalid provisions will be replaced
            with valid provisions that most closely match the intent of the
            original.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">16. Entire Agreement</h2>
          <p className="mb-4">
            These Terms and Conditions, together with our Privacy Policy, Refund
            Policy, Returns Policy, and Cancellation Policy, constitute the
            entire agreement between you and Exquisite Photography and supersede
            all prior agreements, understandings, and representations.
          </p>
        </section>

        <section className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            17. Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Customer Service</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Email:</strong> este@exquisitephoto.co.za
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>WhatsApp:</strong> 084 675 6959
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Phone:</strong> 084 675 6959
              </p>
              <p className="text-sm text-gray-600">
                <strong>Hours:</strong> Monday-Friday, 9:00-17:00 (SAST)
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-3">Business Address</h3>
              <p className="text-sm text-gray-600">
                Exquisite Photography
                <br />
                Montmedy rd, Lorraine, Port Elizabeth
                <br />
                South Africa
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Important Related Policies
          </h2>
          <p className="mb-4">
            Please review these important policies that form part of your
            agreement with us:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/privacy"
              className="block p-4 bg-white rounded hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-blue-600 mb-2">Privacy Policy</h3>
              <p className="text-sm text-gray-600">
                How we protect and use your personal information under POPIA
              </p>
            </Link>
            <Link
              href="/refund"
              className="block p-4 bg-white rounded hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-blue-600 mb-2">Refund Policy</h3>
              <p className="text-sm text-gray-600">
                Our quality guarantee and refund process for products
              </p>
            </Link>
            <Link
              href="/returns"
              className="block p-4 bg-white rounded hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-blue-600 mb-2">Returns Policy</h3>
              <p className="text-sm text-gray-600">
                How to return items and your consumer rights
              </p>
            </Link>
            <Link
              href="/cancellation-policy"
              className="block p-4 bg-white rounded hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-blue-600 mb-2">
                Cancellation Policy
              </h3>
              <p className="text-sm text-gray-600">
                Session cancellations, rescheduling, and order cancellations
              </p>
            </Link>
          </div>
        </section>

        <section className="text-center bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">
            Questions About These Terms?
          </h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms and Conditions or need
            clarification on any point, please don't hesitate to contact our
            customer service team. We're here to help ensure you have a positive
            experience with Exquisite Photography.
          </p>
          <p className="text-sm text-gray-500">Last Updated: 5 November 2025</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
