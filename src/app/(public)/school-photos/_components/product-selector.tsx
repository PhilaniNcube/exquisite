"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Media, Product, SchoolPhoto } from "@/payload-types";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

interface ProductSelectorProps {
  products: Product[];
  schoolPhoto: SchoolPhoto;
}

export function ProductSelector({
  products,
  schoolPhoto,
}: ProductSelectorProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (product: Product) => {
    const productImage =
      typeof product.image === "number" ? null : (product.image as Media);

    addItem({
      id: `${product.id}-${schoolPhoto.id}`,
      product: product.id.toString(),
      priceAtPurchase: product.price,
      picture: schoolPhoto.id.toString(),
      productDetails: {
        name: product.title,
        price: product.price,
        image: productImage?.url ?? undefined,
      },
      pictureDetails: {
        name: schoolPhoto.name,
        url: productImage?.url ?? undefined,
      },
    });

    toast.success(`Added ${product.title} to cart!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-balance mb-2">
          Choose Your Products
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Select products to print your school photo on
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const productImage =
            typeof product.image === "number" ? null : (product.image as Media);

          return (
            <Card
              key={product.id}
              className="overflow-hidden transition-all hover:shadow-lg p-0"
            >
              <div className="aspect-square relative bg-muted">
                {productImage?.url ? (
                  <Image
                    src={productImage.url || "/placeholder.svg"}
                    alt={productImage.alt || product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">
                      No image
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-balance">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className="text-base font-semibold"
                    >
                      {formatPrice(product.price)}
                    </Badge>
                    <Button
                      size="sm"
                      className="cursor-pointer hover:bg-gray-800"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                 
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
