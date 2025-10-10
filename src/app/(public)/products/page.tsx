import { getProducts } from "@/lib/queries/products";
import React from "react";
import ProductsHero from "./_components/products-hero";
import ProductGrid from "./_components/products-grid";
import ProductPagination from "./_components/product-pagination";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;

  const {
    docs: products,
    totalDocs,
    totalPages,
    page: currentPage,
    hasNextPage,
    hasPrevPage,
  } = await getProducts({ page });

  return (
    <main>
      <ProductsHero />
      <ProductGrid products={products} />
      <ProductPagination
        totalDocs={totalDocs}
        totalPages={totalPages}
        page={currentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </main>
  );
};

export default ProductsPage;
