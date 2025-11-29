import React from "react";
import { getOrder } from "@/lib/queries/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Customer, Media, Product, SchoolPhoto } from "@/payload-types";
import Image from "next/image";

interface OrderDetailsProps {
  params: Promise<{ orderId: string }>;
}

const OrderDetails = async ({ params }: OrderDetailsProps) => {
  const { orderId } = await params;
  const order = await getOrder(parseInt(orderId));

  if (!order) {
    return <div>Order not found</div>;
  }

  const customer = order.customerDetails.customer as Customer;
  const items = order.productDetails.orderItems;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Order #{order.id}</h2>
        <Badge
          variant={
            order.orderStatus === "completed"
              ? "default"
              : order.orderStatus === "cancelled"
              ? "destructive"
              : "secondary"
          }
        >
          {order.orderStatus}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                Name
              </div>
              <div className="text-sm">
                {customer.firstName} {customer.lastName}
              </div>

              <div className="text-sm font-medium text-muted-foreground">
                Email
              </div>
              <div className="text-sm">{customer.email}</div>

              <div className="text-sm font-medium text-muted-foreground">
                Phone
              </div>
              <div className="text-sm">{order.customerDetails.cellNumber}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                Date Placed
              </div>
              <div className="text-sm">
                {format(new Date(order.createdAt), "PPP")}
              </div>

              <div className="text-sm font-medium text-muted-foreground">
                Payment Ref
              </div>
              <div className="text-sm">{order.paymentReference || "N/A"}</div>

              <div className="text-sm font-medium text-muted-foreground">
                Total Amount
              </div>
              <div className="text-sm font-bold text-lg">
                {new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                }).format(order.orderTotal || 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {items?.map((item, index) => {
              const product = item.product as Product;
              const photo = item.picture as SchoolPhoto;
              const productImage = product.image as Media;
              const schoolPhoto = photo?.photo as Media;

              return (
                <div
                  key={item.id || index}
                  className="flex items-start justify-between"
                >
                  <div className="flex gap-4">
                    {productImage?.url && (
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={productImage.url}
                          alt={productImage.alt || product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{product.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} ×{" "}
                        {new Intl.NumberFormat("en-ZA", {
                          style: "currency",
                          currency: "ZAR",
                        }).format(item.priceAtPurchase)}
                      </p>
                      {photo && (
                        <div className="mt-2 space-y-2">
                          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                            <p className="font-medium mb-2">
                              Photo: {photo.name}
                            </p>
                            {schoolPhoto?.url && (
                              <div className="relative h-32 w-32 overflow-hidden rounded-md border bg-background">
                                <Image
                                  src={schoolPhoto.url}
                                  alt={schoolPhoto.alt || photo.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {new Intl.NumberFormat("en-ZA", {
                      style: "currency",
                      currency: "ZAR",
                    }).format(item.linePrice)}
                  </div>
                </div>
              );
            })}
            <Separator />
            <div className="flex items-center justify-between font-bold">
              <div>Total</div>
              <div>
                {new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                }).format(order.orderTotal || 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
