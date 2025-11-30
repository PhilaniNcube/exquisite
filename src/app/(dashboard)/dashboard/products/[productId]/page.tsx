import React, { Suspense } from "react";
import ProductDetailsWrapper from "../_components/product-details";

export default function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading product details...</div>}>
        <ProductDetailsWrapper params={params} />
      </Suspense>
    </div>
  );
}
