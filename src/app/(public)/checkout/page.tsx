import React, { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutPageSkeleton } from "@/components/checkout/checkout-page-skeleton";

const CheckoutContent = async () => {
  return <CheckoutForm />;
};

const CheckoutPage = () => {
  return (
    <Suspense fallback={<CheckoutPageSkeleton />}>
      <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Review your order and complete your purchase
          </p>
        </div>

        <CheckoutContent />
      </div>
    </Suspense>
  );
};

export default CheckoutPage;
