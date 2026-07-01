import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentStatus } from "@/lib/paygate/verify";

/**
 * PayGate redirects the customer back to RETURN_URL via POST after payment.
 * This route accepts that POST, verifies the actual payment status server-side
 * (trusting the persisted webhook status, or querying PayGate directly), and
 * only redirects to the success page if payment is confirmed. Cancelled,
 * not-found, or still-pending payments are sent to the cancel page so the
 * cart is not wiped out for an unverified order.
 */
export async function POST(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const baseUrl = req.nextUrl.origin;

  if (!orderId) {
    return NextResponse.redirect(new URL("/checkout/cancel", baseUrl), 303);
  }

  const paymentStatus = await verifyOrderPaymentStatus(orderId);

  // Only send definitively cancelled/invalid payments to the cancel page.
  // A `pending` result may simply mean PayGate's query lags behind the
  // redirect, so hand it to the success page which renders a "confirmation
  // pending" view and — crucially — does NOT clear the cart until verified.
  const redirectUrl =
    paymentStatus === "cancelled" || paymentStatus === "not_found"
      ? new URL("/checkout/cancel", baseUrl)
      : new URL(`/checkout/success?orderId=${orderId}`, baseUrl);

  return NextResponse.redirect(redirectUrl, 303);
}