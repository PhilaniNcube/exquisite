
import { formatPrice } from "@/lib/utils"
import { Product } from "@/payload-types"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Extract image URL from product
  const getImageUrl = (): string => {
    if (typeof product.image === "number") {
      return `/placeholder.svg?height=400&width=400&query=product-${product.id}`
    }
    return (
      product.image.url ||
      product.image.thumbnailURL ||
      `/placeholder.svg?height=400&width=400&query=product-${product.id}`
    )
  }

  const getImageAlt = (): string => {
    if (typeof product.image === "number") {
      return product.title
    }
    return product.image.alt || product.title
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <article className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted mb-4">
          <Image
            src={getImageUrl() || "/placeholder.svg"}
            alt={getImageAlt()}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1">
          <h3 className="font-serif text-lg md:text-xl text-balance mb-2 text-foreground group-hover:text-muted-foreground transition-colors">
            {product.title}
          </h3>

          <p className="font-sans text-sm md:text-base text-muted-foreground mt-auto">{formatPrice(product.price)}</p>
        </div>
      </article>
    </Link>
  )
}
