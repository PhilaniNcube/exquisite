"use client";

import { Product } from "@/payload-types";
import Image from "next/image";

interface ProductImageProps {
  product: Product;
}

export function ProductImage({ product }: ProductImageProps) {
  const image = typeof product.image === "number" ? null : product.image;
  // Payload already produced the 400px webp; re-optimizing it only burns
  // transformations and cache writes.
  const thumbnail = image?.sizes?.thumbnail;

  const src =
    thumbnail?.url ||
    image?.url ||
    image?.thumbnailURL ||
    `/placeholder.svg?height=800&width=800&query=${encodeURIComponent(product.title)}`;

  return (
    <div className="relative aspect-square overflow-hidden bg-muted rounded-lg">
      <Image
        src={src}
        alt={image?.alt || product.title}
        fill
        unoptimized={Boolean(thumbnail?.url)}
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />
    </div>
  );
}
