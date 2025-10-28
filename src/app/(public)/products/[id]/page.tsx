import { notFound } from "next/navigation";
import ProductWrapper from "./_component/product-wrapper";
import { Suspense } from "react";

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-24 lg:py-32">
        <Suspense>
          <ProductWrapper params={params} searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
};

export default ProductPage;
