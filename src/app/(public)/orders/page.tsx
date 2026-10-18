import { Metadata } from "next";
import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getPayload } from "payload";
import config from "@payload-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Order, Product, SchoolPhoto, School, Customer } from "@/payload-types";
import Link from "next/link";
import { OrdersPageSkeleton } from "@/components/orders/orders-page-skeleton";
import { OrderProofButton } from "@/components/orders/order-proof-button";
import { GuestOrderLookupForm } from "@/components/orders/guest-order-lookup";
import {
  FileText,
  LogIn,
  UserPlus,
  ShoppingBag,
  Sparkles,
  Package,
  Clock,
  CheckCircle,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Order History & Proofs | Exquisite Photography",
  description: "View your school photo order history, track order status, and download official proof of order receipts.",
};

interface OrdersPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

function getStatusLabel(status?: string | null) {
  if (!status) return "Pending";
  if (status === "printed") return "Printed & Delivered";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusBadgeVariant(status?: string | null): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed" || status === "printed") return "default";
  if (status === "processing") return "secondary";
  if (status === "cancelled") return "destructive";
  return "outline";
}

const OrdersContent = async ({ searchParams }: OrdersPageProps) => {
  const user = await getUser();
  const { orderId } = await searchParams;

  // ─────────────────────────────────────────────────────────────
  // 1. SPECIFIC ORDER DETAILS / PROOF VIEW
  // ─────────────────────────────────────────────────────────────
  if (orderId) {
    try {
      const payload = await getPayload({ config });

      const order = (await payload.findByID({
        collection: "orders",
        id: orderId,
        depth: 2,
      })) as Order;

      if (!order) {
        redirect("/orders");
      }

      // If this order belongs to a registered customer, ensure auth matches
      if (order.customerDetails?.customer) {
        const customerId =
          typeof order.customerDetails.customer === "object"
            ? order.customerDetails.customer.id
            : order.customerDetails.customer;

        if (!user) {
          redirect(`/login?redirect=${encodeURIComponent(`/orders?orderId=${orderId}`)}`);
        }

        if (customerId !== user.id) {
          // If the email matches, allow and update customer ID
          if (user.email && order.customerDetails.email?.toLowerCase() === user.email.toLowerCase()) {
            await payload.update({
              collection: "orders",
              id: order.id,
              data: {
                customerDetails: {
                  ...order.customerDetails,
                  customer: user.id,
                },
              },
            });
          } else {
            redirect("/orders");
          }
        }
      }

      const orderTotal =
        order.orderTotal ||
        order.productDetails?.orderItems?.reduce((total, item) => total + item.linePrice, 0) ||
        0;

      const isGuestViewer = !user;

      return (
        <div className="container mx-auto px-4 lg:px-8 lg:py-24 py-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Order Proof & Receipt</h1>
              <p className="text-muted-foreground">
                View order summary, fulfillment details, and download your official proof of order.
              </p>
            </div>
            <OrderProofButton order={order} size="default" />
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* If guest viewer, invite to link / create account */}
            {isGuestViewer && (
              <Card className="border-primary/20 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 shadow-xs">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">
                        Want this order saved to your account?
                      </h4>
                      <p className="text-xs text-slate-600">
                        Create an account or sign in with{" "}
                        <span className="font-semibold text-slate-900">{order.customerDetails?.email}</span> to access
                        this proof and future orders in one place.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button asChild size="sm">
                      <Link
                        href={`/create-account?email=${encodeURIComponent(
                          order.customerDetails?.email || ""
                        )}&redirect=${encodeURIComponent(`/orders?orderId=${order.id}`)}`}
                      >
                        Create Account
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="bg-white">
                      <Link href={`/login?redirect=${encodeURIComponent(`/orders?orderId=${order.id}`)}`}>
                        Sign In
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Status & Key Metadata */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">OFFICIAL ORDER REFERENCE</span>
                    <CardTitle className="text-2xl mt-0.5">Order #{order.id}</CardTitle>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.orderStatus)} className="text-xs px-3 py-1">
                    {getStatusLabel(order.orderStatus)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Order Date</p>
                    <p className="font-medium mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Cell Number</p>
                    <p className="font-medium mt-0.5">{order.customerDetails?.cellNumber || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Parent Email</p>
                    <p className="font-medium mt-0.5 truncate">{order.customerDetails?.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Payment Reference</p>
                    <p className="font-medium mt-0.5 truncate">{order.paymentReference || "PayGate Verified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ordered Photo Prints & Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.productDetails?.orderItems?.map((item, index) => {
                  const product = item.product as Product;
                  const schoolPhoto = item.picture as SchoolPhoto;
                  const school = schoolPhoto?.schoolDetails?.school as School | undefined;

                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-lg border bg-muted/20"
                    >
                      <div className="flex items-start gap-3.5">
                        {schoolPhoto?.photo && typeof schoolPhoto.photo === "object" && (
                          <div className="relative w-14 h-14 rounded-md overflow-hidden bg-muted shrink-0 border">
                            <Image
                              src={(schoolPhoto.photo as any).url || "/placeholder.jpg"}
                              alt={schoolPhoto.name || "School photo"}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-foreground">
                              {product?.title || "Photography Product"}
                            </h4>
                            {item.childName && (
                              <Badge variant="secondary" className="text-[11px] font-normal">
                                Student: {item.childName}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Photo: {schoolPhoto?.name || "School Photo"}
                            {school?.name ? ` • ${school.name}` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right sm:self-center">
                        <p className="font-semibold text-sm">{formatPrice(item.linePrice)}</p>
                      </div>
                    </div>
                  );
                })}

                <Separator className="my-2" />

                <div className="flex justify-between items-center font-bold text-lg pt-1">
                  <span>Grand Total:</span>
                  <span className="text-primary">{formatPrice(orderTotal)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Back / Continue Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button asChild className="flex-1">
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/orders">
                  {user ? "View All My Orders" : "Order History & Sign In"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error fetching order:", error);
      redirect("/orders");
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. GUEST LANDING: NOT LOGGED IN
  // ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12 lg:py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Order History & Proofs</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              Sign in to easily view all your school photo orders, track fulfillment and delivery, or look up a proof
              for an order placed as a guest.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Card 1: Sign In or Register */}
            <Card className="border border-border flex flex-col justify-between shadow-sm">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <LogIn className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Parent Account Sign In</CardTitle>
                <CardDescription>
                  Sign in to view your complete order history, download proofs, and track all your school photos in one place.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Instant access to past & current photo order proofs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Download official PDF receipts for school submission</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Orders placed with your email are automatically linked</span>
                  </li>
                </ul>

                <div className="space-y-2.5 pt-4">
                  <Button asChild className="w-full gap-2">
                    <Link href="/login?redirect=/orders">
                      <LogIn className="h-4 w-4" />
                      Sign In to View Orders
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full gap-2">
                    <Link href="/create-account?redirect=/orders">
                      <UserPlus className="h-4 w-4" />
                      Create Parent Account
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Look up Guest Order */}
            <Card className="border border-border flex flex-col justify-between shadow-sm">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-2">
                  <FileText className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">Find a Guest Order</CardTitle>
                <CardDescription>
                  Checked out as a guest? Enter your Order Number and the email you used to view and download your order proof.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <GuestOrderLookupForm />
              </CardContent>
            </Card>
          </div>

          {/* Supportive note */}
          <div className="bg-muted/40 border rounded-lg p-4 text-center text-xs text-muted-foreground">
            <p>
              Need help finding your order proof? Contact Exquisite Photography at{" "}
              <a href="mailto:este@exquisitephoto.co.za" className="underline font-medium text-foreground">
                este@exquisitephoto.co.za
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. LOGGED-IN CUSTOMER: FULL ORDER HISTORY
  // ─────────────────────────────────────────────────────────────
  try {
    const payload = await getPayload({ config });

    // Find orders where customer is user.id OR customerDetails.email matches user.email
    const orders = await payload.find({
      collection: "orders",
      where: {
        or: [
          {
            "customerDetails.customer": {
              equals: user.id,
            },
          },
          ...(user.email
            ? [
                {
                  "customerDetails.email": {
                    equals: user.email,
                  },
                },
              ]
            : []),
        ],
      },
      sort: "-createdAt",
      depth: 2,
    });

    // Auto-link any guest orders that matched this customer's email
    for (const doc of orders.docs) {
      if (!doc.customerDetails?.customer) {
        try {
          await payload.update({
            collection: "orders",
            id: doc.id,
            data: {
              customerDetails: {
                ...doc.customerDetails,
                customer: user.id,
              },
            },
          });
        } catch (e) {
          console.error("Auto-link order error:", e);
        }
      }
    }

    return (
      <div className="container mx-auto px-4 md:px-8 py-8 lg:py-24">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">My Orders & History</h1>
              <Badge variant="outline" className="text-xs text-primary border-primary/30">
                {orders.totalDocs} {orders.totalDocs === 1 ? "Order" : "Orders"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Signed in as <span className="font-semibold text-foreground">{user.email}</span> • Track order status and download official proofs.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to Shop</Link>
          </Button>
        </div>

        {orders.docs.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6 max-w-md text-sm">
                You haven&apos;t placed any orders yet, or your orders were placed with a different email address.
              </p>
              <Button asChild>
                <Link href="/">Browse Schools & Photos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.docs.map((order) => {
              const totalAmount =
                order.orderTotal ||
                order.productDetails?.orderItems?.reduce((total, item) => total + item.linePrice, 0) ||
                0;

              // Collect child names
              const childNames = Array.from(
                new Set(
                  order.productDetails?.orderItems
                    ?.map((it) => it.childName)
                    .filter(Boolean) || []
                )
              );

              return (
                <Card key={order.id} className="transition-all hover:shadow-sm">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-bold text-lg">Order #{order.id}</h3>
                          <Badge variant={getStatusBadgeVariant(order.orderStatus)} className="text-xs">
                            {getStatusLabel(order.orderStatus)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-xs text-muted-foreground">Order Total</span>
                        <p className="text-lg font-bold text-primary">{formatPrice(totalAmount)}</p>
                      </div>
                    </div>

                    <div className="bg-muted/40 rounded-lg p-3 text-xs space-y-1.5 mb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-muted-foreground">
                          {order.productDetails?.orderItems?.length || 0} Item(s)
                          {childNames.length > 0 ? ` for ${childNames.join(", ")}` : ""}
                        </span>
                        {order.paymentReference && (
                          <span className="text-muted-foreground font-mono">Ref: {order.paymentReference}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <OrderProofButton order={order as Order} size="sm" />
                      <Button variant="default" size="sm" asChild>
                        <Link href={`/orders?orderId=${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching orders:", error);

    return (
      <div className="container mx-auto px-4 md:px-8 py-16">
        <Card className="max-w-md mx-auto text-center p-8">
          <CardContent className="space-y-4">
            <h3 className="text-xl font-bold">Error loading orders</h3>
            <p className="text-muted-foreground text-sm">
              We encountered a temporary problem retrieving your order history. Please try again in a moment.
            </p>
            <Button asChild>
              <Link href="/orders">Reload</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
};

const OrdersPage = ({ searchParams }: OrdersPageProps) => {
  return (
    <Suspense fallback={<OrdersPageSkeleton />}>
      <OrdersContent searchParams={searchParams} />
    </Suspense>
  );
};

export default OrdersPage;