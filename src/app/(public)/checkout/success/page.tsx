import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import { ClearCart } from "./clear-cart";
import { CheckoutSuccessPageSkeleton } from "@/components/checkout/checkout-success-skeleton";
import { getPayload } from "payload";
import config from "@payload-config";
import { formatPrice } from "@/lib/utils";
import { Order, Product, SchoolPhoto } from "@/payload-types";
import { getUser } from "@/lib/auth";
import { verifyOrderPaymentStatus } from "@/lib/paygate/verify";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | Exquisite Photography",
  description: "Your payment was successful and your order has been confirmed.",
};

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

async function SuccessContent({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/");
  }

  let order: Order | null = null;
  try {
    const payload = await getPayload({ config });
    order = (await payload.findByID({
      collection: "orders",
      id: orderId,
      depth: 2,
    })) as Order;
  } catch {
    // Order not found or invalid ID — fall through to verification below.
  }

  // Verify the order was actually paid before trusting this as a success.
  // This guards against direct navigation, cancelled/failed payments, or
  // the PayGate return redirect landing here without a confirmed payment.
  // Only clear the cart if payment is confirmed server-side.
  const paymentStatus = await verifyOrderPaymentStatus(orderId);
  if (paymentStatus === "cancelled" || paymentStatus === "not_found") {
    redirect("/checkout/cancel");
  }
  const isPaid = paymentStatus === "paid";

  // Re-fetch the order so any status update made during verification is
  // reflected in the displayed order details.
  if (order) {
    try {
      const payload = await getPayload({ config });
      order = (await payload.findByID({
        collection: "orders",
        id: orderId,
        depth: 2,
      })) as Order;
    } catch {
      // Keep the previously fetched order if the re-fetch fails.
    }
  }

  const user = await getUser();

  const orderTotal =
    order?.productDetails?.orderItems?.reduce(
      (sum, item) => sum + item.linePrice,
      0
    ) ?? 0;

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-24">
      {/* Clear the cart ONLY after a verified successful payment */}
      <ClearCart shouldClear={isPaid} />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl">
              {isPaid ? "Payment Successful!" : "Payment Confirmation Pending"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">
                {isPaid
                  ? "Thank you for your payment. Your order has been confirmed."
                  : "We have not yet received confirmation of your payment from PayGate. If you completed payment, please check back shortly — your cart has been preserved until payment is confirmed."}
              </p>
              <p className="text-sm">
                Order ID:{" "}
                <span className="font-mono font-semibold">{orderId}</span>
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ You will receive an email confirmation shortly</li>
                <li>✓ Your order is being processed</li>
                <li>✓ We will contact you when your order is ready</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <>
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{order.id}</span>
                  <Badge
                    variant={
                      order.orderStatus === "completed" || order.orderStatus === "printed"
                        ? "default"
                        : order.orderStatus === "processing"
                        ? "secondary"
                        : order.orderStatus === "cancelled"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {order.orderStatus
                      ? order.orderStatus === "printed"
                        ? "Printed & Delivered"
                        : order.orderStatus.charAt(0).toUpperCase() +
                          order.orderStatus.slice(1)
                      : "Pending"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cell Number</p>
                    <p>{order.customerDetails.cellNumber}</p>
                  </div>
                  {order.customerDetails.email && (
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p>{order.customerDetails.email}</p>
                    </div>
                  )}
                  {order.paymentReference && (
                    <div>
                      <p className="text-muted-foreground">
                        Payment Reference
                      </p>
                      <p>{order.paymentReference}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.productDetails.orderItems.map((item, index) => {
                  const product = item.product as Product;
                  const schoolPhoto = item.picture as SchoolPhoto;

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {product?.title || "Product"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {schoolPhoto?.name || "School Photo"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} ×{" "}
                          {formatPrice(item.priceAtPurchase)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.linePrice)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <Separator />

                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link href="/">Continue Shopping</Link>
          </Button>
          {/* Only show "My Orders" for logged-in users */}
          {user && (
            <Button asChild variant="outline" className="flex-1">
              <Link href="/orders">My Orders</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  return (
    <Suspense fallback={<CheckoutSuccessPageSkeleton />}>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
