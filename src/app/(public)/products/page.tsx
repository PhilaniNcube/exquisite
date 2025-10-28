
import ProductsHero from "./_components/products-hero";

import ProductsContainer from "./[id]/_component/products-container";
import ProductsFallback from "./_components/products-fallback";
import { Suspense } from "react";
import { cacheLife } from "next/cache";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {



  return (
    <main>
      <ProductsHero />
      <Suspense fallback={<ProductsFallback />}>
        <ProductsContainer searchParams={searchParams} />
      </Suspense>
    </main>
  );
};

export default ProductsPage;
