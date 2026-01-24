import { cacheLife } from "next/cache";
import React from "react";

const RefundPage = async () => {
  "use cache";
  cacheLife("weeks");
  return (
    <div className="container mx-auto px-4 py-36 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Refund Policy</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-600 mb-8 text-center">
          At Exquisite Photography, we strive for your complete satisfaction
          with every custom print order. This refund policy complies with the Consumer Protection Act 68 of 2008.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quality Guarantee</h2>
          <p className="mb-4">
            We guarantee the quality of all our custom prints. If you receive a
            print that has defects in printing, colour accuracy issues due to our
            processing, or damage that occurred during delivery, we will gladly
            provide a replacement or full refund at no additional cost to you.
            This guarantee is in addition to your rights under the Consumer Protection Act.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Consumer Rights</h2>
          <div className="bg-blue-50 p-6 rounded-lg mb-4">
            <p className="mb-4">
              Under the Consumer Protection Act 68 of 2008, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Receive goods that are of good quality, in good working order, and free of defects</li>
              <li>Return goods within 7 days if they fail to satisfy these requirements</li>
              <li>A refund, replacement, or repair if goods are defective</li>
              <li>Clear and accurate information about the goods and services</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Eligibility</h2>
          <h3 className="text-xl font-medium mb-3">
            Eligible for Full Refund or Replacement:
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Printing defects (streaks, spots, incorrect colours due to our
              error)
            </li>
            <li>
              Damage during delivery (bent corners, scratches, water damage)
            </li>
            <li>Wrong size or product delivered</li>
            <li>Manufacturing defects in frames or mounting</li>
            <li>
              Significant colour variation from our proof (if proof was provided)
            </li>
            <li>
              Goods not fit for purpose or not of merchantable quality
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Not Eligible for Refund:</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Normal colour variations between different devices and print media
            </li>
            <li>
              Customer dissatisfaction with image quality due to low-resolution
              source files provided by the customer
            </li>
            <li>Change of mind after order completion (as these are custom goods made to your specifications)</li>
            <li>
              Custom sizing or framing mistakes based on incorrect measurements
              provided by customer
            </li>
            <li>Damage after delivery (unless due to defective packaging)</li>
            <li>Orders beyond the 6-month statutory period (unless otherwise agreed)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
          <div className="bg-blue-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3">Step 1: Contact Us</h3>
            <p className="mb-2">
              Contact us within <strong>7 days</strong> of receiving your order
              (you have up to 7 days for defective goods under the Consumer Protection Act) by:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email: {process.env.NEXT_PUBLIC_MAIN_EMAIL_ADDRESS}</li>
              <li>WhatsApp: [Your WhatsApp number]</li>
              <li>Phone: [Your phone number]</li>
              <li>Through our contact form on this website</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3">
              Step 2: Provide Information
            </h3>
            <p className="mb-2">Please include:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Order number</li>
              <li>Description of the issue</li>
              <li>Clear photos showing the problem (for defects or damage)</li>
              <li>Your preferred resolution (replacement or refund)</li>
              <li>Your banking details for refund (if applicable)</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3">Step 3: Resolution</h3>
            <p>
              We will review your request within 2 business days and provide
              instructions for return (if needed) or issue your
              refund/replacement. Most issues are resolved within 5-7 business
              days. Returns may take longer depending on your location and courier availability.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Return Requirements</h2>
          <p className="mb-4">
            If a return is required, we will arrange courier collection or provide return instructions.
            Please:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Package items carefully in original packaging if available</li>
            <li>Include all accessories (frames, mounting hardware, etc.)</li>
            <li>Use the provided courier waybill or return label</li>
            <li>Ship within 14 days of our return authorisation</li>
            <li>Obtain proof of return (tracking number or collection receipt)</li>
          </ul>
          <p className="text-sm text-gray-600 mb-2">
            <em>
              Note: You are not responsible for return courier costs on
              defective or damaged items.
            </em>
          </p>
          <p className="text-sm text-gray-600">
            <em>
              For local returns within South Africa, we use reputable courier services such as The Courier Guy, Dawn Wing, or Aramex.
            </em>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Timeline</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium">Replacement Orders</h3>
              <p className="text-sm text-gray-600">
                Rush processed within 5-7 business days (subject to courier availability)
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium">Refund Processing</h3>
              <p className="text-sm text-gray-600">
                3-5 business days after return receipt
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Refunds will be issued to the original payment method. EFT refunds typically reflect within 1-3 business days. 
            Credit card refunds may take 5-10 business days to appear on your statement depending on your bank.
            For cash deposits or other payment methods, refunds will be processed via EFT to your nominated bank account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Custom Orders & Rush Processing
          </h2>
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="mb-2">
              <strong>Custom sized prints and rush orders:</strong> Due to the
              personalised nature of these orders, they can only be refunded if
              there is a printing defect, the goods are not of merchantable quality, or delivery damage occurred. 
              Please double-check all specifications before placing custom orders.
            </p>
            <p className="text-sm text-gray-600">
              We recommend ordering a proof for large or expensive custom orders
              to ensure satisfaction before final printing. This is especially important for 
              custom framing and large format prints.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Prevention Tips</h2>
          <p className="mb-4">To ensure you love your prints:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Upload high-resolution images (at least 300 DPI at print size)
            </li>
            <li>Review size specifications carefully before ordering</li>
            <li>Consider ordering a smaller test print for colour accuracy</li>
            <li>
              Contact us with questions about image quality or sizing before
              ordering
            </li>
            <li>Provide accurate delivery address and contact information</li>
            <li>Ensure someone is available to receive and inspect the delivery</li>
          </ul>
        </section>

        <section className="mb-8 bg-purple-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
          <p className="mb-4">
            If you are not satisfied with our resolution of your complaint, you have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Refer your complaint to the Consumer Goods and Services Ombud</li>
            <li>Approach the National Consumer Commission</li>
            <li>Lodge a complaint with the Consumer Protection Authority in your province</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            We are committed to resolving all disputes fairly and in accordance with the Consumer Protection Act 68 of 2008.
          </p>
        </section>

        <section className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Customer Service</h3>
              <p className="text-sm text-gray-600 mb-1">
                Email: este@exquisitephoto.co.za
              </p>
              <p className="text-sm text-gray-600 mb-1">
                WhatsApp: 084 675 6959
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Phone: 084 675 6959
              </p>
              <p className="text-sm text-gray-600">
                Hours: Monday-Friday, 9:00-17:00 (SAST)
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Physical Address</h3>
              <p className="text-sm text-gray-600">
                Exquisite Photography
                <br />
                Montgomery Rd, Lorraine
                <br />
                Port Elizabeth, 6070
                <br />
                South Africa
              </p>
            </div>
          </div>
        </section>

        <section className="text-center bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">
            Your Satisfaction is Our Priority
          </h2>
          <p className="text-gray-600 mb-4">
            We want you to absolutely love your custom prints. If you have any
            concerns or questions about your order, please don&apos;t hesitate
            to reach out to us. We are committed to providing excellent service 
            in accordance with South African consumer protection laws.
          </p>
          <p className="text-sm text-gray-500">
            This refund policy was last updated on 5 November 2025 and complies with the Consumer Protection Act 68 of 2008.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPage;
