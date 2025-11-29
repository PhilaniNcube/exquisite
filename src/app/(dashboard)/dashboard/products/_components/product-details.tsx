import ProductDetailsView from "@/components/dashboard/products/product-details-view";

export default async function ProductDetailsWrapper({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  return <ProductDetailsView productId={productId} />
}