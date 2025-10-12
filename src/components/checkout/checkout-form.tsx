"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { Customer } from "@/payload-types";
import { createOrder } from "@/lib/actions/orders";

export function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [cellNumber, setCellNumber] = useState("");
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createOrder, {
    success: false,
    message: "",
    error: "",
  });

  const totalPrice = getTotalPrice();

  // Handle form submission result
  if (state.success) {
    clearCart();
    toast.success("Order placed successfully!");
  } else if (state.error) {
    toast.error(state.message || "Failed to place order. Please try again.");
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">
          Add some products to your cart before checking out.
        </p>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{item.productDetails?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {item.pictureDetails?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.linePrice)}</p>
              </div>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" disabled className="bg-muted" />
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" disabled className="bg-muted" />
            </div>

            <div>
              <Label htmlFor="cellNumber">Cell Number *</Label>
              <Input
                id="cellNumber"
                name="cellNumber"
                type="tel"
                value={cellNumber}
                onChange={(e) => setCellNumber(e.target.value)}
                placeholder="e.g., +27 82 123 4567"
                required
              />
            </div>

            {/* Hidden input for order items */}
            <input
              type="hidden"
              name="orderItems"
              value={JSON.stringify(
                items.map((item) => ({
                  product: item.product,
                  quantity: item.quantity,
                  priceAtPurchase: item.priceAtPurchase,
                  linePrice: item.linePrice,
                  picture: item.picture,
                }))
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending
                ? "Placing Order..."
                : `Place Order (R${totalPrice.toFixed(2)})`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
