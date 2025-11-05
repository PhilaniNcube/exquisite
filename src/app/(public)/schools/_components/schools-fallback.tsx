import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SchoolsFallback = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 36 }).map((_, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchoolsFallback;
