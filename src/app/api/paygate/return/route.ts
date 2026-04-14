import { NextRequest, NextResponse } from "next/server";

/**
 * PayGate redirects the customer back to RETURN_URL via POST after payment.
 * This route accepts that POST and redirects to the success page via GET.
 */
export async function POST(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const baseUrl = req.nextUrl.origin;
  const redirectUrl = new URL(
    `/checkout/success${orderId ? `?orderId=${orderId}` : ""}`,
    baseUrl
  );
  return NextResponse.redirect(redirectUrl, 303);
}
