import React from "react";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getUser } from "@/lib/auth";

const CheckoutPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/checkout");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Review your order and complete your purchase
        </p>
      </div>

      <CheckoutForm user={user} />
    </div>
  );
};

export default CheckoutPage;
