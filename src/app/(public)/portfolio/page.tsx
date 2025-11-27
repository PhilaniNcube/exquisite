
import { Metadata } from "next";
import PortfolioGrid from "@/components/portfolio/protfolio-grid";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Portfolio | Exquisite Photography",
  description: "Showcasing the finest photography services",
};

const PortfolioPage = async () => {
  return (
    <div className="min-h-screen ">
      <div className="py-20 lg:py-36 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our Portfolio
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our diverse collection of photography services, each
              crafted with passion and expertise.
            </p>
          </div>
        </div>
      </div>
      <Suspense fallback={<GridFallback />}>
        <PortfolioGrid />
      </Suspense>
    </div>
  );
};

export default PortfolioPage;

const GridFallback = () => {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 lg:pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden aspect-square border-0">
            <Skeleton className="w-full h-full" />
          </Card>
        ))}
      </div>
    </div>
  );
};
