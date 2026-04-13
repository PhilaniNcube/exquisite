import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPayFastService } from "@/lib/payfast";
import { sendOrderStatusNotifications } from "@/lib/email/order-notifications";

export async function POST(request: NextRequest) {
  try {
    // Return 200 header immediately to prevent retries
    const headers = new Headers();
    headers.set("Content-Type", "text/plain");

    const payload = await getPayload({ config });
    const payfastService = getPayFastService();

    // Parse the form data from PayFast
    const formData = await request.formData();
    const pfData: Record<string, string> = {};

    formData.forEach((value, key) => {
      pfData[key] = value.toString();
    });

    console.log("PayFast ITN received:", pfData);

    // Extract signature
    const receivedSignature = pfData.signature;
    if (!receivedSignature) {
      console.error("No signature provided in ITN");
      return new NextResponse("No signature", { status: 200, headers });
    }

    // Extract order ID
    const orderId = pfData.m_payment_id;
    if (!orderId) {
      console.error("No order ID in ITN");
      return new NextResponse("No order ID", { status: 200, headers });
    }

    // Security Check 1: Verify signature
    const isValidSignature = payfastService.verifyITNSignature(
      pfData,
      receivedSignature
    );
    if (!isValidSignature) {
      console.error("Invalid PayFast signature");
      return new NextResponse("Invalid signature", { status: 200, headers });
    }

    // Security Check 2: Verify PayFast IP (optional in sandbox)
    const clientIP =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    
    const isValidIP = payfastService.isValidPayFastIP(clientIP);
    if (!isValidIP && process.env.PAYFAST_MODE !== "sandbox") {
      console.error("Invalid PayFast IP:", clientIP);
      return new NextResponse("Invalid IP", { status: 200, headers });
    }

    // Fetch the order
    const order = await payload.findByID({
      collection: "orders",
      id: orderId,
      depth: 2,
    });

    if (!order) {
      console.error("Order not found:", orderId);
      return new NextResponse("Order not found", { status: 200, headers });
    }

    // Security Check 3: Verify payment amount
    const expectedAmount = order.productDetails.orderItems.reduce(
      (sum, item) => sum + item.linePrice,
      0
    );
    const receivedAmount = parseFloat(pfData.amount_gross);
    
    const isValidAmount = payfastService.verifyPaymentData(
      expectedAmount,
      receivedAmount
    );
    if (!isValidAmount) {
      console.error(
        `Amount mismatch: expected ${expectedAmount}, received ${receivedAmount}`
      );
      return new NextResponse("Amount mismatch", { status: 200, headers });
    }

    // Security Check 4: Server confirmation
    const paramString = payfastService.createITNValidationString(pfData);

    const isValidServer = await payfastService.verifyServerConfirmation(
      paramString
    );
    if (!isValidServer && process.env.PAYFAST_MODE !== "sandbox") {
      console.error("Server validation failed");
      return new NextResponse("Server validation failed", {
        status: 200,
        headers,
      });
    }

    // All checks passed - update order status based on payment status
    const paymentStatus = pfData.payment_status;
    let orderStatus: "pending" | "processing" | "completed" | "cancelled" =
      "pending";

    switch (paymentStatus) {
      case "COMPLETE":
        orderStatus = "completed";
        break;
      case "CANCELLED":
        orderStatus = "cancelled";
        break;
      default:
        orderStatus = "processing";
    }

    const shouldSendNotification =
      (orderStatus === "completed" || orderStatus === "cancelled") &&
      (order.orderStatus !== orderStatus ||
        order.paymentDetails?.pfPaymentId !== (pfData.pf_payment_id ?? null) ||
        order.paymentDetails?.paymentStatus !== (pfData.payment_status ?? null));

    // Update the order
    const updatedOrder = await payload.update({
      collection: "orders",
      id: orderId,
      depth: 2,
      data: {
        orderStatus,
        // Store PayFast transaction details
        paymentDetails: {
          pfPaymentId: pfData.pf_payment_id,
          paymentStatus: pfData.payment_status,
          amountGross: parseFloat(pfData.amount_gross || "0"),
          amountFee: parseFloat(pfData.amount_fee || "0"),
          amountNet: parseFloat(pfData.amount_net || "0"),
        },
      },
    });

    console.log(
      `Order ${orderId} updated to status: ${orderStatus}, PayFast ID: ${pfData.pf_payment_id}`
    );

    if (shouldSendNotification) {
      try {
        await sendOrderStatusNotifications(updatedOrder);
      } catch (emailError) {
        console.error(`Failed to send order notification emails for order ${orderId}:`, emailError);
      }
    }

    return new NextResponse("OK", { status: 200, headers });
  } catch (error) {
    console.error("Error processing PayFast ITN:", error);
    // Still return 200 to prevent retries
    return new NextResponse("Error processed", { status: 200 });
  }
}
