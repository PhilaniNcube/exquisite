"use client";

import { Product } from "@/payload-types";
import Image from "next/image";

interface ProductImageProps {
  product: Product;
}

export function ProductImage({ product }: ProductImageProps) {
  // Extract image URL from product
  const getImageUrl = (): string => {
    if (typeof product.image === "number") {
      return `/placeholder.svg?height=800&width=800&query=${encodeURIComponent(product.title)}`;
    }
    return (
      product.image.url ||
      product.image.thumbnailURL ||
      `/placeholder.svg?height=800&width=800&query=${encodeURIComponent(product.title)}`
    );
  };

  const getImageAlt = (): string => {
    if (typeof product.image === "number") {
      return product.title;
    }
    return product.image.alt || product.title;
  };

  return (
    <div className="relative aspect-square overflow-hidden bg-muted rounded-lg">
      <Image
        src={getImageUrl() || "/placeholder.svg"}
        alt={getImageAlt()}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />
    </div>
  );
}
