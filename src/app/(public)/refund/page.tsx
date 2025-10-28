import { cacheLife } from "next/cache";
import React from "react";

const RefundPage = async () => {
  "use cache";
  cacheLife("weeks");
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Refund Policy</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-600 mb-8 text-center">
          At Exquisite Photography, we strive for your complete satisfaction
          with every custom print order.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quality Guarantee</h2>
          <p className="mb-4">
            We guarantee the quality of all our custom prints. If you receive a
            print that has defects in printing, color accuracy issues due to our
            processing, or damage that occurred during shipping, we will gladly
            provide a replacement or full refund at no additional cost to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Eligibility</h2>
          <h3 className="text-xl font-medium mb-3">
            Eligible for Full Refund or Replacement:
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Printing defects (streaks, spots, incorrect colors due to our
              error)
            </li>
            <li>
              Damage during shipping (bent corners, scratches, water damage)
            </li>
            <li>Wrong size or product delivered</li>
            <li>Manufacturing defects in frames or mounting</li>
            <li>
              Significant color variation from our proof (if proof was provided)
            </li>
          </ul>

          <h3 className="text-xl font-medium mb-3">Not Eligible for Refund:</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Normal color variations between different devices and print media
            </li>
            <li>
              Customer dissatisfaction with image quality due to low-resolution
              source files
            </li>
            <li>Changes of mind after order completion</li>
            <li>
              Custom sizing or framing mistakes based on incorrect measurements
              provided by customer
            </li>
            <li>Damage after delivery (unless due to defective packaging)</li>
            <li>Orders over 30 days from delivery date</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
          <div className="bg-blue-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3">Step 1: Contact Us</h3>
            <p className="mb-2">
              Contact us within <strong>30 days</strong> of receiving your order
              by:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email: {process.env.NEXT_PUBLIC_MAIN_EMAIL_ADDRESS}</li>
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
            </ul>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3">Step 3: Resolution</h3>
            <p>
              We will review your request within 2 business days and provide
              instructions for return (if needed) or issue your
              refund/replacement. Most issues are resolved within 5-7 business
              days.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Return Requirements</h2>
          <p className="mb-4">
            If a return is required, we will provide a prepaid return label.
            Please:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Package items carefully in original packaging if available</li>
            <li>Include all accessories (frames, mounting hardware, etc.)</li>
            <li>Use the provided return label</li>
            <li>Ship within 14 days of our return authorization</li>
          </ul>
          <p className="text-sm text-gray-600">
            <em>
              Note: You are not responsible for return shipping costs on
              defective or damaged items.
            </em>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Timeline</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium">Replacement Orders</h3>
              <p className="text-sm text-gray-600">
                Rush processed within 3-5 business days
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
            Refunds will be issued to the original payment method. Credit card
            refunds may take 5-10 business days to appear on your statement
            depending on your bank.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Custom Orders & Rush Processing
          </h2>
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="mb-2">
              <strong>Custom sized prints and rush orders:</strong> Due to the
              personalized nature of these orders, they can only be refunded if
              there is a printing defect or shipping damage. Please double-check
              all specifications before placing custom orders.
            </p>
            <p className="text-sm text-gray-600">
              We recommend ordering a proof for large or expensive custom orders
              to ensure satisfaction before final printing.
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
            <li>Consider ordering a smaller test print for color accuracy</li>
            <li>
              Contact us with questions about image quality or sizing before
              ordering
            </li>
            <li>Provide accurate shipping address and contact information</li>
          </ul>
        </section>

        <section className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Customer Service</h3>
              <p className="text-sm text-gray-600 mb-1">
                Email: support@exquisitephotography.com
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Phone: [Your phone number]
              </p>
              <p className="text-sm text-gray-600">
                Hours: Monday-Friday, 9AM-6PM
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Mailing Address</h3>
              <p className="text-sm text-gray-600">
                Exquisite Photography
                <br />
                [Your business address]
                <br />
                [City, State, ZIP]
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
            to reach out to us.
          </p>
          <p className="text-sm text-gray-500">
            This refund policy was last updated on 28 October 2025.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPage;
