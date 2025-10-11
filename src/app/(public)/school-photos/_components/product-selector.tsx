"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Check } from "lucide-react";
import { Media, Product } from "@/payload-types";
import { toast } from "sonner";

interface ProductSelectorProps {
  products: Product[];
}

export function ProductSelector({
  products,
}: ProductSelectorProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );

  const toggleProduct = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

    const handleOrderSubmit = (selectedProducts: Product[]) => {
    toast(`Order Submitted! You've ordered ${selectedProducts.length} product${
      selectedProducts.length === 1 ? "" : "s"
    }. Total: $${selectedProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}`);
  }

  const handleSubmit = () => {
    const selected = products.filter((p) => selectedProducts.has(p.id));
    handleOrderSubmit(selected);
  };

  




  const totalPrice = products
    .filter((p) => selectedProducts.has(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-balance mb-2">
          Choose Your Products
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Select one or more products to print your school photo on
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const isSelected = selectedProducts.has(product.id);
          const productImage =
            typeof product.image === "number" ? null : (product.image as Media);

          return (
            <Card
              key={product.id}
              className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg p-0 ${
                isSelected ? "ring-2 ring-accent" : ""
              }`}
              onClick={() => toggleProduct(product.id)}
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

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-accent text-accent-foreground rounded-full p-2">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-balance">
                  {product.title}
                </h3>
                <Badge variant="outline" className="text-base font-semibold">
                  ${product.price.toFixed(2)}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedProducts.size > 0 && (
        <Card className="p-6 bg-secondary/50 border-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {selectedProducts.size}{" "}
                {selectedProducts.size === 1 ? "product" : "products"} selected
              </p>
              <p className="text-3xl font-bold">${totalPrice.toFixed(2)}</p>
            </div>

            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto"
              onClick={handleSubmit}
            >
              Order Now
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
