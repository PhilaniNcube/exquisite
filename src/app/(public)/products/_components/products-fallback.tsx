import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProductsFallback = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-4">
            {/* Product Image Skeleton */}
            <Skeleton className="w-full aspect-square rounded-lg" />
            
            {/* Product Title Skeleton */}
            <Skeleton className="h-4 w-3/4" />
            
            {/* Product Price Skeleton */}
            <Skeleton className="h-4 w-1/2" />
            
            {/* Product Description Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center space-x-2">
        <Skeleton className="h-10 w-20" />
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-10 rounded" />
          ))}
        </div>
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

export default ProductsFallback;