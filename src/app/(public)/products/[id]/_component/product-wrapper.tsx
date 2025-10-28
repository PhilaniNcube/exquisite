import React, { Suspense } from "react";
import { ProductImage } from "./product-image";
import { ProductInfo } from "./product-info";
import SchoolsSelector from "./schools-selector";
import SchoolPhotosDisplay from "./school-photos-display";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/cache";
import { getProductById } from "@/lib/queries/products";
import { getSchoolsWithClasses } from "@/lib/queries/schools";

const ProductContent = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  "use cache";
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  cacheLife("hours");
  cacheTag(`product-${id}`);

  const [product, schoolsWithClasses] = await Promise.all([
    getProductById(parseInt(id)),
    getSchoolsWithClasses(),
  ]);
  
  return (
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
  );
};

const ProductWrapper = ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div>
      <Suspense fallback={<div>Loading product...</div>}>
        <ProductContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default ProductWrapper;
