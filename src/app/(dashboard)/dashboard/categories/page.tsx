import CategoriesList from "@/components/dashboard/categories/categories-list";
import React, { Suspense } from "react";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategoriesList />
      </Suspense>
    </div>
  );
}
