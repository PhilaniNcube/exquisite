"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";

function redirectToPayGate(
  paymentUrl: string,
  paymentData: Record<string, string>
) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentUrl;

  for (const [key, value] of Object.entries(paymentData)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

export function CheckoutForm() {
  const { items, getTotalPrice } = useCartStore();
  const [cellNumber, setCellNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const totalPrice = getTotalPrice();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        linePrice: item.linePrice,
        picture: item.picture,
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cellNumber, orderItems }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message || "Failed to place order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (result.paymentData && result.paymentUrl) {
        toast.success("Redirecting to payment...");
        redirectToPayGate(result.paymentUrl, result.paymentData);
      } else {
        toast.error("Failed to initialize payment.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">
          Add some products to your cart before checking out.
        </p>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:py-24 gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-start">
                {(item.productDetails?.thumbnailUrl || item.productDetails?.image) && (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 bg-muted">
                    <Image
                      src={item.productDetails.thumbnailUrl || item.productDetails.image!}
                      alt={item.productDetails?.name || "Product"}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                {(item.pictureDetails?.thumbnailUrl || item.pictureDetails?.url) && (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 bg-muted">
                    <Image
                      src={item.pictureDetails.thumbnailUrl || item.pictureDetails.url!}
                      alt={item.pictureDetails?.name || "School photo"}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
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
            <CardTitle>Customer Details & Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" className="bg-muted" />
            </div>

            <div className="space-y-2">
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

              <div className="space-y-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Proceed to Payment (${formatPrice(totalPrice)})`
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to PayGate to complete your payment securely
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
