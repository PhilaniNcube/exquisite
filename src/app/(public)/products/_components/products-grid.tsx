import { Product } from "@/payload-types";
import React from "react";
import { ProductCard } from "./product-card";

const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12 container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
