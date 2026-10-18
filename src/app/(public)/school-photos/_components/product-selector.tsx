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
  const { addItem, setIsOpen } = useCartStore();

  const isGroupOrSportsPhoto =
    schoolPhoto.photoType === "Sports" ||
    schoolPhoto.photoType === "Group" ||
    schoolPhoto.photoType === "Class";

  const filteredProducts = isGroupOrSportsPhoto
    ? products.filter((p) => p.availableForGroupSports !== false)
    : products;

  const handleAddToCart = (product: Product) => {
    const productImage =
      typeof product.image === "number" ? null : (product.image as Media);
    const schoolPhotoImage =
      typeof schoolPhoto.photo === "number" ? null : (schoolPhoto.photo as Media);

    const school = schoolPhoto.schoolDetails?.school;
    const schoolId = typeof school === "number" ? school.toString() : (school ? school.id.toString() : undefined);
    const schoolName = typeof school === "object" && school ? school.name : undefined;

    // Only allow one school per cart/order. If the cart already holds photos
    // from a different school, block the add and tell the parent to finish or
    // clear that order first. The API enforces this too, as a safety net.
    const existingItem = useCartStore
      .getState()
      .items.find((item) => item.pictureDetails?.schoolId);
    const existingSchoolId = existingItem?.pictureDetails?.schoolId;
    if (existingSchoolId && schoolId && existingSchoolId !== schoolId) {
      const existingSchoolName =
        existingItem?.pictureDetails?.schoolName ||
        "another school";
      toast.error(
        `Your cart already contains photos from ${existingSchoolName}. Please complete or clear that order before ordering from ${schoolName || "this school"}.`,
      );
      setIsOpen(true);
      return;
    }

    addItem({
      id: `${product.id}-${schoolPhoto.id}`,
      product: product.id.toString(),
      priceAtPurchase: product.price,
      picture: schoolPhoto.id.toString(),
      productDetails: {
        name: product.title,
        price: product.price,
        image: productImage?.url ?? undefined,
        thumbnailUrl: productImage?.sizes?.thumbnail?.url ?? undefined,
      },
      pictureDetails: {
        name: schoolPhoto.name,
        url: schoolPhotoImage?.url ?? undefined,
        thumbnailUrl: schoolPhotoImage?.sizes?.thumbnail?.url ?? undefined,
        schoolId,
        schoolName,
      },
    });

    toast.success(`Added ${product.title} to cart!`);
    setIsOpen(true);
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
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
