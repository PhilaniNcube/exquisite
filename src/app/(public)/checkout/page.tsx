import React from "react";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getAuthState } from "@/lib/auth-state";

const CheckoutPage = async () => {
  const { isLoggedIn, token } = await getAuthState();

  if (!isLoggedIn) {
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

      <CheckoutForm />
    </div>
  );
};

export default CheckoutPage;
