import React from "react";
import PortfolioGrid from "../portfolio/protfolio-grid";
import { getCategories } from "@/lib/queries/categories";
import { Suspense } from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ServicesSection = async () => {
 

  return (
    <section id="services" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            Our Services
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Professional photography services tailored to capture your most
            important moments
          </p>
        </div>
        <Suspense fallback={<GridFallback />}>
          <PortfolioGrid />
        </Suspense>
      </div>
    </section>
  );
};

export default ServicesSection;

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
