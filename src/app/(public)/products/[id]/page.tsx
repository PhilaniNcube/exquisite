import { getProductById } from "@/lib/queries/products";
import { getSchoolsWithClasses } from "@/lib/queries/schools";
import { notFound } from "next/navigation";
import React from "react";
import { ProductImage } from "./_component/product-image";
import { ProductInfo } from "./_component/product-info";
import SchoolsSelector from "./_component/schools-selector";
import SchoolPhotosDisplay from "./_component/school-photos-display";

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const [product, schoolsWithClasses] = await Promise.all([
    getProductById(parseInt(id)),
    getSchoolsWithClasses(),
  ]);

  if (!product) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImage product={product} />
          <ProductInfo product={product}>
            <SchoolsSelector schoolsWithClasses={schoolsWithClasses} />
            <SchoolPhotosDisplay
              key={`${resolvedSearchParams.schoolId}-${resolvedSearchParams.classId}`}
              searchParams={resolvedSearchParams}
            />
          </ProductInfo>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
