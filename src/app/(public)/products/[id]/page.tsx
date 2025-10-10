import { getProductById } from "@/lib/queries/products";
import { notFound } from "next/navigation";
import React from "react";
import ProductHero from "./_component/product-hero";
import { ProductImage } from "./_component/product-image";
import { ProductInfo } from "./_component/product-info";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const product = await getProductById(parseInt(id));

  if (!product) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImage product={product} />
          <ProductInfo product={product} />
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
