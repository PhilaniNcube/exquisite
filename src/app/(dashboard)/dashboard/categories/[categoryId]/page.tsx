import CategoryDetails from "@/components/dashboard/categories/category-details";
import CategoryPhotos from "@/components/dashboard/categories/category-photos";
import React, { Suspense } from "react";

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ sort?: string; q?: string }>;
}) => {
  return (
    <div>
      <Suspense fallback={<div>Loading category details...</div>}>
        <CategoryDetails params={params} />
      </Suspense>
      <Suspense fallback={<div>Loading category photos...</div>}>
        <CategoryPhotos params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default CategoryPage;
