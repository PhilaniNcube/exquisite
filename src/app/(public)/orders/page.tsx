import { Metadata } from 'next';
import React from 'react'
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getPayload } from "payload";
import config from "@payload-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Order, Product, SchoolPhoto } from "@/payload-types";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orders | Exquisite Photography",
  description: "Showcasing the finest photography services",
};

interface OrdersPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/orders");
  }

  const { orderId } = await searchParams;

  if (orderId) {
    // Fetch specific order
    try {
      const payload = await getPayload({ config });
      
      const order = await payload.findByID({
        collection: "orders",
        id: orderId,
        depth: 2, // To populate product and picture relationships
      }) as Order;

      // Check if user owns this order
      if (typeof order.customerDetails.customer === 'object' 
          ? order.customerDetails.customer.id !== user.id 
          : order.customerDetails.customer !== user.id) {
        redirect("/orders");
      }

      return (
        <div className="container mx-auto px-4 lg:px-8 lg:py-24 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Order Confirmation</h1>
            <p className="text-muted-foreground">
              Thank you for your order! Here are the details:
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Order #{order.id}
                  <Badge 
                    variant={
                      order.orderStatus === 'completed' ? 'default' : 
                      order.orderStatus === 'processing' ? 'secondary' : 
                      order.orderStatus === 'cancelled' ? 'destructive' : 
                      'outline'
                    }
                  >
                    {order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'Unknown'}
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
                  {order.paymentReference && (
                    <div>
                      <p className="text-muted-foreground">Payment Reference</p>
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
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{product?.title || 'Product'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {schoolPhoto?.name || 'School Photo'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.linePrice)}</p>
                      </div>
                    </div>
                  );
                })}
                
                <Separator />
                
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total:</span>
                  <span>
                    {formatPrice(
                      order.productDetails.orderItems.reduce(
                        (total, item) => total + item.linePrice, 
                        0
                      )
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/orders">View All Orders</Link>
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

  // Generic orders page - fetch user's orders
  try {
    const payload = await getPayload({ config });
    
    const orders = await payload.find({
      collection: "orders",
      where: {
        "customerDetails.customer": {
          equals: user.id,
        },
      },
      sort: "-createdAt",
      depth: 1,
    });

    return (
      <div className="container mx-auto px-4 md:px-8 py-8 lg:py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            View your order history and track your purchases
          </p>
        </div>

        {orders.docs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven&apos;t placed any orders yet.
              </p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.docs.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        order.orderStatus === 'completed' ? 'default' : 
                        order.orderStatus === 'processing' ? 'secondary' : 
                        order.orderStatus === 'cancelled' ? 'destructive' : 
                        'outline'
                      }
                    >
                      {order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'Unknown'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {order.productDetails.orderItems.length} item(s)
                      </p>
                      <p className="font-medium">
                        {formatPrice(
                          order.productDetails.orderItems.reduce(
                            (total, item) => total + item.linePrice, 
                            0
                          )
                        )}
                      </p>
                    </div>
                    
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/orders?orderId=${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    
    return (
      <div className="container mx-auto px-4 mdpx-8 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-semibold mb-2">Error loading orders</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem loading your orders.
            </p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default OrdersPage;