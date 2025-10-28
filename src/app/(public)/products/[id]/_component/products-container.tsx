import { getProducts } from "@/lib/queries/products";
import React, { Suspense } from "react";
import ProductGrid from "../../_components/products-grid";
import ProductPagination from "../../_components/product-pagination";

const ProductsContent = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
  const {
    docs: products,
    totalDocs,
    totalPages,
    page: currentPage,
    hasNextPage,
    hasPrevPage,
  } = await getProducts({ page });
  
  return (
    <>
      <ProductGrid products={products} />
      <ProductPagination
        totalDocs={totalDocs}
        totalPages={totalPages}
        page={currentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </>
  );
};

const ProductsContainer = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default ProductsContainer;
