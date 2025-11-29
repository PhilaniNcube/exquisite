import { getProductById } from "@/lib/queries/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default async function ProductDetailsView({ productId }: { productId: string }) {
  const product = await getProductById(parseInt(productId));

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
        {typeof product.image !== "number" && product.image.url ? (
          <Image
            src={product.image.url}
            alt={product.image.alt || product.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold mt-2">{formatPrice(product.price)}</p>
        </div>
       
      </div>
    </div>
  );
}
