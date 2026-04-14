import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPayGateService } from "@/lib/paygate";
import { sendOrderStatusNotifications } from "@/lib/email/order-notifications";

export async function POST(request: NextRequest) {
  try {
    const headers = new Headers();
    headers.set("Content-Type", "text/plain");

    const payload = await getPayload({ config });
    const payGateService = getPayGateService();

    // Parse the form data from PayGate
    const formData = await request.formData();
    const pgData: Record<string, string> = {};

    formData.forEach((value, key) => {
      pgData[key] = value.toString();
    });

    console.log("PayGate notify received:", pgData);

    // Extract reference (order ID)
    const orderId = pgData.REFERENCE;
    if (!orderId) {
      console.error("No REFERENCE (order ID) in notify");
      return new NextResponse("OK", { status: 200, headers });
    }

    // Security Check: Verify checksum
    const isValidChecksum = payGateService.verifyChecksum(pgData);
    if (!isValidChecksum) {
      console.error("Invalid PayGate checksum");
      return new NextResponse("OK", { status: 200, headers });
    }

    // Fetch the order
    const order = await payload.findByID({
      collection: "orders",
      id: orderId,
      depth: 2,
    });

    if (!order) {
      console.error("Order not found:", orderId);
      return new NextResponse("OK", { status: 200, headers });
    }

    // Verify payment amount (PayGate sends amount in cents)
    const expectedAmountCents = Math.round(
      order.productDetails.orderItems.reduce(
        (sum, item) => sum + item.linePrice,
        0
      ) * 100
    );
    const receivedAmountCents = parseInt(pgData.AMOUNT || "0", 10);

    if (!payGateService.verifyPaymentAmount(expectedAmountCents, receivedAmountCents)) {
      console.error(
        `Amount mismatch: expected ${expectedAmountCents} cents, received ${receivedAmountCents} cents`
      );
      return new NextResponse("OK", { status: 200, headers });
    }

    // Map transaction status to order status
    const transactionStatus = pgData.TRANSACTION_STATUS;
    const orderStatus = payGateService.mapTransactionStatus(transactionStatus);

    const shouldSendNotification =
      (orderStatus === "completed" || orderStatus === "cancelled") &&
      (order.orderStatus !== orderStatus ||
        order.paymentDetails?.payRequestId !== (pgData.PAY_REQUEST_ID ?? null) ||
        order.paymentDetails?.transactionStatus !== (transactionStatus ?? null));

    // Update the order
    const updatedOrder = await payload.update({
      collection: "orders",
      id: orderId,
      depth: 2,
      data: {
        orderStatus,
        paymentDetails: {
          payRequestId: pgData.PAY_REQUEST_ID,
          transactionId: pgData.TRANSACTION_ID,
          transactionStatus: transactionStatus,
          resultCode: pgData.RESULT_CODE,
          resultDescription: pgData.RESULT_DESC,
          payMethod: pgData.PAY_METHOD,
          payMethodDetail: pgData.PAY_METHOD_DETAIL,
          amount: receivedAmountCents,
        },
      },
    });

    console.log(
      `Order ${orderId} updated to status: ${orderStatus}, PayGate Transaction ID: ${pgData.TRANSACTION_ID}`
    );

    if (shouldSendNotification) {
      try {
        await sendOrderStatusNotifications(updatedOrder);
      } catch (emailError) {
        console.error(`Failed to send order notification emails for order ${orderId}:`, emailError);
      }
    }

    // PayGate requires plain text "OK" response
    return new NextResponse("OK", { status: 200, headers });
  } catch (error) {
    console.error("Error processing PayGate notify:", error);
    return new NextResponse("OK", { status: 200 });
  }
}
