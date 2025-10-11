"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/payload-types";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";

interface ProductInfoProps {
  product: Product;
  children?: React.ReactNode;
}

export function ProductInfo({ product, children }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log("[v0] Adding to cart:", { product: product.id, quantity });
    // Add your cart logic here
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance text-foreground">
          {product.title}
        </h1>
        <p className="font-sans text-2xl md:text-3xl text-muted-foreground">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Description */}
      <div className="prose prose-neutral max-w-none">
        <RichText data={product.productDetails} />
      </div>

      {children}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label
          htmlFor="quantity"
          className="text-sm font-medium text-foreground"
        >
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-10 w-10"
            aria-label="Decrease quantity"
          >
            -
          </Button>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
            }
            className="w-20 h-10 text-center border border-border rounded-md bg-background text-foreground"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
            className="h-10 w-10"
            aria-label="Increase quantity"
          >
            +
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button onClick={handleAddToCart} size="lg" className="w-full gap-2">
        <ShoppingCart className="h-5 w-5" />
        Add to Cart
      </Button>

      {/* Product Details */}
 
    </div>
  );
}
