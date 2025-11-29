import CategoryDetails from "@/components/dashboard/categories/category-details";
import CategoryPhotos from "@/components/dashboard/categories/category-photos";
import React, { Suspense } from "react";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) => {
  return (
    <div>
      <Suspense fallback={<div>Loading category details...</div>}>
        <CategoryDetails params={params} />
      </Suspense>
      <Suspense fallback={<div>Loading category photos...</div>}>
        <CategoryPhotos params={params} />
      </Suspense>
    </div>
  );
};

export default CategoryPage;
