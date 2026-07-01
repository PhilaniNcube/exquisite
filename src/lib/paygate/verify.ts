import { getPayload } from "payload";
import config from "@payload-config";
import { getPayGateService } from "@/lib/paygate";
import type { Order } from "@/payload-types";

/**
 * Order statuses that represent a successful (paid) payment.
 * Mirrors the `paidOnly` filter used in `src/lib/queries/orders.ts`.
 */
export const PAID_ORDER_STATUSES = [
  "completed",
  "processing",
  "printed",
] as const;

export type PaymentVerificationResult =
  | "paid"
  | "cancelled"
  | "pending"
  | "not_found";

/**
 * Determines whether an order has actually been paid.
 *
 * Order of precedence:
 *  1. If the order's persisted `orderStatus` is already a paid state, trust it
 *     (the PayGate notify webhook has done the verification).
 *  2. If it is `cancelled`, return cancelled.
 *  3. Otherwise, query PayGate directly (using the stored `payRequestId`) for
 *     the authoritative transaction status. If PayGate reports a paid or
 *     cancelled status, persist that update so future requests are fast and
 *     the notify webhook's update is idempotent.
 *  4. If PayGate cannot confirm payment, return `pending` — the caller must
 *     NOT treat the order as paid.
 *
 * This is the single source of truth used before clearing the customer's cart
 * so that the cart is only ever cleared after a verified successful payment.
 */
export async function verifyOrderPaymentStatus(
  orderId: string | number
): Promise<PaymentVerificationResult> {
  const payload = await getPayload({ config });

  let order: Order | null = null;
  try {
    order = (await payload.findByID({
      collection: "orders",
      id: orderId,
      depth: 2,
    })) as Order;
  } catch {
    return "not_found";
  }

  if (!order) {
    return "not_found";
  }

  // 1. Trust the webhook-verified persisted status.
  if (
    order.orderStatus != null &&
    (PAID_ORDER_STATUSES as readonly string[]).includes(order.orderStatus)
  ) {
    return "paid";
  }
  if (order.orderStatus === "cancelled") {
    return "cancelled";
  }

  // 2. Query PayGate for the authoritative status.
  const payRequestId = order.paymentDetails?.payRequestId ?? null;
  if (!payRequestId) {
    // No payment was ever initiated for this order — definitely not paid.
    return "pending";
  }

  const payGateService = getPayGateService();
  let pgResult: Record<string, string>;
  try {
    pgResult = await payGateService.queryTransaction(
      payRequestId,
      order.id.toString()
    );
  } catch (error) {
    console.error(
      `[verifyOrderPaymentStatus] PayGate query failed for order ${order.id}:`,
      error
    );
    return "pending";
  }

  const transactionStatus = pgResult.TRANSACTION_STATUS;
  const mappedStatus = payGateService.mapTransactionStatus(transactionStatus);

  // 3. Persist the verified status so subsequent loads don't re-query PayGate
  //    and the notify webhook update remains idempotent.
  if (
    mappedStatus !== order.orderStatus &&
    (mappedStatus === "completed" ||
      mappedStatus === "processing" ||
      mappedStatus === "cancelled")
  ) {
    try {
      const receivedAmountCents = parseInt(pgResult.AMOUNT || "0", 10);
      const expectedAmountCents = Math.round(
        order.productDetails.orderItems.reduce(
          (sum, item) => sum + item.linePrice,
          0
        ) * 100
      );

      const amountOk = payGateService.verifyPaymentAmount(
        expectedAmountCents,
        receivedAmountCents
      );

      if (amountOk) {
        await payload.update({
          collection: "orders",
          id: order.id,
          data: {
            orderStatus: mappedStatus,
            paymentDetails: {
              ...(order.paymentDetails ?? {}),
              payRequestId: pgResult.PAY_REQUEST_ID ?? payRequestId,
              transactionId: pgResult.TRANSACTION_ID,
              transactionStatus,
              resultCode: pgResult.RESULT_CODE,
              resultDescription: pgResult.RESULT_DESC,
              payMethod: pgResult.PAY_METHOD,
              payMethodDetail: pgResult.PAY_METHOD_DETAIL,
              amount: receivedAmountCents,
            },
          },
        });
      } else {
        console.error(
          `[verifyOrderPaymentStatus] Amount mismatch for order ${order.id}: expected ${expectedAmountCents}, received ${receivedAmountCents}`
        );
        return "pending";
      }
    } catch (updateError) {
      console.error(
        `[verifyOrderPaymentStatus] Failed to persist verified status for order ${order.id}:`,
        updateError
      );
      // Fall through — still use the mapped status for this request.
    }
  }

  if (
    mappedStatus === "completed" ||
    mappedStatus === "processing"
  ) {
    return "paid";
  }
  if (mappedStatus === "cancelled") {
    return "cancelled";
  }
  return "pending";
}