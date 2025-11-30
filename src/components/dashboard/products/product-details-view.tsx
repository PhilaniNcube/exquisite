import { getProductById } from "@/lib/queries/products";
import { notFound } from "next/navigation";
import { UpdateProductTitle } from "./update-product-title";
import { UpdateProductPrice } from "./update-product-price";
import { UpdateProductImage } from "./update-product-image";
import { UpdateProductDetails } from "./update-product-details";
import type { Media } from "@/payload-types";

export default async function ProductDetailsView({ productId }: { productId: string }) {
  const product = await getProductById(parseInt(productId));

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <UpdateProductTitle
          productId={product.id}
          currentTitle={product.title}
        />
        <UpdateProductPrice
          productId={product.id}
          currentPrice={product.price}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <UpdateProductImage
          productId={product.id}
          currentImage={product.image as Media}
        />
       
      </div>
    </div>
  );
}
