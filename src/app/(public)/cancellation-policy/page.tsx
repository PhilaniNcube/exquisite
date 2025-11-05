import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancellation Policy | Exquisite Photography',
  description: 'Our cancellation and rescheduling policy for photography sessions and orders.',
}

const Cancellation = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cancellation Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          Last Updated: November 5, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Photography Session Cancellations</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">By Client</h3>
          <ul className="space-y-2 mb-4">
            <li>
              <strong>More than 72 hours before session:</strong> Full refund of any deposits or fees paid, or option to reschedule at no additional charge.
            </li>
            <li>
              <strong>48-72 hours before session:</strong> 50% refund of deposit, or option to reschedule with a $50 rescheduling fee.
            </li>
            <li>
              <strong>24-48 hours before session:</strong> 25% refund of deposit, or option to reschedule with a $100 rescheduling fee.
            </li>
            <li>
              <strong>Less than 24 hours before session:</strong> No refund. Rescheduling may be available for a $150 fee, subject to photographer availability.
            </li>
            <li>
              <strong>No-show:</strong> Full forfeiture of deposit and session fees. No rescheduling available.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">By Photographer</h3>
          <p className="mb-4">
            If we need to cancel or reschedule your session due to illness, emergency, or unforeseen circumstances:
          </p>
          <ul className="space-y-2 mb-4">
            <li>You will receive a full refund of any payments made, or</li>
            <li>We will work with you to reschedule at a mutually convenient time with no additional fees</li>
            <li>In cases of extreme weather or safety concerns, we will contact you as soon as possible to reschedule</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">School Photography Sessions</h2>
          <ul className="space-y-2 mb-4">
            <li>
              <strong>School-initiated cancellations:</strong> Will be rescheduled at no additional cost to the school or families
            </li>
            <li>
              <strong>Weather-related cancellations:</strong> Automatically rescheduled to the designated rain date or mutually agreed upon alternative date
            </li>
            <li>
              <strong>Individual student absences:</strong> Make-up day sessions are typically provided at no extra charge
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Order Cancellations</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Digital Products</h3>
          <ul className="space-y-2 mb-4">
            <li>
              <strong>Before download:</strong> Full refund available within 24 hours of purchase
            </li>
            <li>
              <strong>After download:</strong> No refunds available due to the nature of digital products
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Physical Products (Prints, Albums, etc.)</h3>
          <ul className="space-y-2 mb-4">
            <li>
              <strong>Before production:</strong> Full refund available if cancellation is requested before order enters production (typically within 24-48 hours of order placement)
            </li>
            <li>
              <strong>During production:</strong> 50% refund if production has begun but order has not shipped
            </li>
            <li>
              <strong>After shipment:</strong> No cancellation available. Please refer to our <a href="/returns" className="text-primary hover:underline">Returns Policy</a> for information about returns
            </li>
            <li>
              <strong>Custom or personalized items:</strong> Cannot be cancelled once production begins due to the custom nature of these products
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Rescheduling Policy</h2>
          <p className="mb-4">
            We understand that life happens and plans change. We will do our best to accommodate rescheduling requests:
          </p>
          <ul className="space-y-2 mb-4">
            <li>Rescheduling is subject to photographer availability</li>
            <li>Fees for rescheduling vary based on notice provided (see cancellation timeframes above)</li>
            <li>Sessions can typically only be rescheduled once without additional fees (with proper notice)</li>
            <li>Multiple reschedules may incur additional fees</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Force Majeure</h2>
          <p className="mb-4">
            In the event of circumstances beyond our control (including but not limited to natural disasters, 
            severe weather, public health emergencies, government restrictions, or other acts of God), both parties 
            agree to work together in good faith to reschedule or, if necessary, provide a full refund.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Processing</h2>
          <ul className="space-y-2 mb-4">
            <li>Approved refunds will be processed within 5-10 business days</li>
            <li>Refunds will be issued to the original payment method</li>
            <li>Please allow additional time for your financial institution to process the refund</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Cancel or Reschedule</h2>
          <p className="mb-4">
            To cancel or reschedule your session or order:
          </p>
          <ol className="space-y-2 mb-4">
            <li>Contact us as soon as possible via email or phone</li>
            <li>Provide your booking reference number or order number</li>
            <li>Clearly state whether you wish to cancel or reschedule</li>
            <li>If rescheduling, provide your preferred alternative dates/times</li>
          </ol>
          <p className="mb-4">
            We will respond to your request within 24 hours during business days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Exceptions</h2>
          <p className="mb-4">
            We reserve the right to make exceptions to this policy on a case-by-case basis for extenuating 
            circumstances such as medical emergencies, family emergencies, or other extraordinary situations. 
            Documentation may be required.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-4">
            For questions about this cancellation policy or to request a cancellation or reschedule, please contact us:
          </p>
          <ul className="space-y-2 mb-4">
            <li>Email: <a href="mailto:info@exquisitephotography.com" className="text-primary hover:underline">info@exquisitephotography.com</a></li>
            <li>Phone: Available on our <a href="/contact" className="text-primary hover:underline">Contact Page</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Policy Changes</h2>
          <p className="mb-4">
            We reserve the right to modify this cancellation policy at any time. Changes will be effective 
            immediately upon posting to our website. Your continued use of our services after changes are posted 
            constitutes acceptance of the modified policy. However, any bookings or orders made prior to policy 
            changes will be governed by the policy in effect at the time of booking.
          </p>
        </section>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            This cancellation policy is part of our service agreement. By booking a photography session or 
            placing an order with us, you acknowledge that you have read, understood, and agree to be bound 
            by this cancellation policy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Cancellation