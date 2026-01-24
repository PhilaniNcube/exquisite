import { cacheLife } from "next/cache";
import React from "react";

const Returns = async () => {
  "use cache";
  cacheLife("hours");
  return (
    <div className="container mx-auto px-4 py-36 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Returns Policy</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-600 mb-8 text-center">
          At Exquisite Photography, we want you to be completely satisfied with
          your purchase. This returns policy is in line with the Consumer
          Protection Act 68 of 2008.
        </p>

        <section className="mb-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Consumer Rights</h2>
          <p className="mb-4">
            Under the Consumer Protection Act 68 of 2008, you have the right to
            return goods that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Are defective or not of merchantable quality</li>
            <li>Do not match the description provided</li>
            <li>Are not fit for the purpose they were intended</li>
            <li>Were delivered damaged or in incorrect specifications</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            You have up to 7 day from the date of delivery to return
            defective goods.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Returns Eligibility</h2>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3 text-green-700">
              ✓ Eligible for Returns:
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Defective Prints:</strong> Printing defects, incorrect
                colours, streaks, or spots caused by our production process
              </li>
              <li>
                <strong>Damaged Goods:</strong> Items damaged during delivery
                (bent, scratched, or broken)
              </li>
              <li>
                <strong>Wrong Items:</strong> Incorrect size, product, or
                specifications delivered
              </li>
              <li>
                <strong>Quality Issues:</strong> Poor print quality due to our
                processing errors
              </li>
              <li>
                <strong>Manufacturing Defects:</strong> Defects in frames,
                mounting, or finishing
              </li>
              <li>
                <strong>Description Mismatch:</strong> Products that don&apos;t
                match our description
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3 text-red-700">
              ✗ Not Eligible for Returns:
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Custom Orders:</strong> Made-to-order items with your
                specifications (unless defective)
              </li>
              <li>
                <strong>Change of Mind:</strong> Returns due to customer
                preference after order completion
              </li>
              <li>
                <strong>Low Resolution Images:</strong> Poor print quality due
                to low-resolution source files provided by the customer
              </li>
              <li>
                <strong>Colour Variations:</strong> Normal colour differences
                between screens and prints
              </li>
              <li>
                <strong>Customer Error:</strong> Incorrect measurements or
                specifications provided by the customer
              </li>
              <li>
                <strong>Damage After Delivery:</strong> Damage occurring after
                successful delivery (unless due to defective packaging)
              </li>
              <li>
                <strong>Used or Altered Items:</strong> Products that have been
                modified, installed, or used
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Return an Item</h2>

          <div className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Step 1: Contact Us</h3>
              <p className="mb-3">
                Contact our customer service team within{" "}
                <strong>7 days</strong> of receiving your order (or up to 7
                days for defective goods):
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email: {process.env.NEXT_PUBLIC_MAIN_EMAIL_ADDRESS}</li>
                <li>WhatsApp: [Your WhatsApp number]</li>
                <li>Phone: [Your phone number]</li>
                <li>Contact form on our website</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">
                Step 2: Return Authorisation
              </h3>
              <p className="mb-3">Provide the following information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your order number</li>
                <li>Item(s) you wish to return</li>
                <li>Reason for return with detailed description</li>
                <li>Clear photos of the item and any defects or damage</li>
                <li>Proof of purchase (order confirmation email)</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                We will review your request and issue a Return Authorisation
                Number (RAN) if approved.
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">
                Step 3: Package & Send
              </h3>
              <p className="mb-3">
                Once you receive your Return Authorisation Number:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Package the item securely in original packaging (if available)
                </li>
                <li>
                  Include all accessories, documentation, and packaging
                  materials
                </li>
                <li>Write your RAN clearly on the outside of the package</li>
                <li>
                  We will arrange collection or provide return
                  instructions
                </li>
                <li>Keep your tracking number for reference</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">
                Step 4: Inspection & Resolution
              </h3>
              <p className="mb-3">After we receive your return:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Items are inspected within 2-3 business days</li>
                <li>We verify the return meets our returns criteria</li>
                <li>You receive notification of approval or rejection</li>
                <li>
                  Approved returns are processed for refund or replacement
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Return Shipping</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded">
              <h3 className="font-medium mb-2">Defective or Incorrect Items</h3>
              <p className="text-sm text-gray-700">
                We cover all return shipping costs for returns of defective, damaged, or
                incorrect items. We will arrange collection at no cost
                to you.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded">
              <h3 className="font-medium mb-2">Change of Mind (If Accepted)</h3>
              <p className="text-sm text-gray-700">
                Customer is responsible for return shipping costs. Items must be
                returned in original, unused condition with all packaging
                intact.
              </p>
            </div>
          </div>


        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>

          <div className="bg-gray-50 p-6 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3">Refund Timeline</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-32 font-medium text-sm">
                  Processing:
                </span>
                <span className="text-sm text-gray-700">
                  3-5 business days after inspection
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-32 font-medium text-sm">
                  EFT Refunds:
                </span>
                <span className="text-sm text-gray-700">
                  1-3 business days to reflect in your account
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-32 font-medium text-sm">
                  Credit Card:
                </span>
                <span className="text-sm text-gray-700">
                  5-10 business days depending on your bank
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-32 font-medium text-sm">
                  Cash/Deposit:
                </span>
                <span className="text-sm text-gray-700">
                  Refunded via EFT to your nominated account
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Refund Options</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Full Refund:</strong> Return of the purchase price to
                your original payment method
              </li>
              <li>
                <strong>Replacement:</strong> We send you a new item at no
                additional cost
              </li>
              <li>
                <strong>Store Credit:</strong> Credit towards future purchases
                (if preferred)
              </li>
              <li>
                <strong>Repair:</strong> We repair the item if possible and
                feasible
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Return Conditions</h2>

          <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-lg">
            <p className="mb-3 font-medium">Items must be returned:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>In original condition (unless defective)</li>
              <li>With all original packaging materials</li>
              <li>With all accessories and documentation included</li>
              <li>Unused and unaltered (unless returning due to defect)</li>
              <li>
                Within 7 days of delivery (or 7 days for defective items)
              </li>
              <li>With Return Authorisation Number (RAN)</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              <em>
                Returns that do not meet these conditions may be rejected or
                subject to a restocking fee.
              </em>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Special Circumstances</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium mb-2">Custom & Personalised Orders</h3>
              <p className="text-sm text-gray-700">
                Custom-made items cannot be returned unless they are defective,
                damaged, or not as described. We strongly recommend reviewing
                all specifications carefully before placing custom orders.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium mb-2">Damaged in Transit</h3>
              <p className="text-sm text-gray-700">
                If your item arrives damaged, please refuse delivery or note the
                damage upon receipt. Contact us immediately with photos. We
                will arrange a replacement or refund promptly.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium mb-2">Non-Delivery</h3>
              <p className="text-sm text-gray-700">
                If your order does not arrive within the expected timeframe,
                contact us immediately. We will investigate and
                arrange a replacement or refund if the item is lost.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-medium mb-2">Partial Orders</h3>
              <p className="text-sm text-gray-700">
                If you only want to return part of your order, each item will be
                assessed individually based on our returns criteria. Contact us
                with details of which items you wish to return.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Exchange Policy</h2>

          <div className="bg-indigo-50 p-6 rounded-lg">
            <p className="mb-4">We offer exchanges for items that are:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>The wrong size (if applicable)</li>
              <li>Defective or damaged</li>
              <li>Different from what was ordered</li>
            </ul>
            <p className="text-sm text-gray-700">
              To request an exchange, follow the same returns process. Once we
              receive and inspect the returned item, we will send you the
              replacement item with priority processing.
            </p>
          </div>
        </section>

        <section className="mb-8 bg-red-50 border border-red-200 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Important Notes</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span className="text-sm">
                All returns must be authorised before sending items back
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span className="text-sm">
                Unauthorised returns may be rejected or returned to sender
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span className="text-sm">
                We are not responsible for items lost or damaged during return
                shipping (keep tracking number)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span className="text-sm">
                Refunds do not include original shipping costs unless the return
                is due to our error
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span className="text-sm">
                Promotional items or gifts must be returned with the main
                product
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
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
              <h3 className="font-medium mb-3">Returns Address</h3>
              <p className="text-sm text-gray-600">
                Exquisite Photography Returns Department
                <br />
                Montgomery Road, Lorraine
                <br />
                Port Elizabeth, 6070
                <br />
                South Africa
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 bg-purple-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
          <p className="mb-4">
            If you are not satisfied with how we handle your return, you have
            the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact the Consumer Goods and Services Ombud</li>
            <li>Lodge a complaint with the National Consumer Commission</li>
            <li>Approach your provincial Consumer Protection Authority</li>
            <li>
              Seek advice from the Consumer Protection Helpline: 0860 003 600
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            We are committed to fair treatment and resolving all returns in
            accordance with South African consumer law.
          </p>
        </section>

        <section className="text-center bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">
            We&apos;re Here to Help
          </h2>
          <p className="text-gray-600 mb-4">
            Our goal is to ensure you&apos;re delighted with your purchase. If
            you have any questions about returns, refunds, or exchanges, please
            don&apos;t hesitate to contact our friendly customer service team.
          </p>
          <p className="text-sm text-gray-500">
            This returns policy was last updated on 5 November 2025 and complies
            with the Consumer Protection Act 68 of 2008.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Returns;
