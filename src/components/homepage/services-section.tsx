import React from "react";
import PortfolioGrid from "../portfolio/protfolio-grid";
import { getCategories } from "@/lib/queries/categories";

const ServicesSection = async () => {
  const { docs: categories } = await getCategories();

  return (
    <section id="services" className="py-20 md:py-32 bg-background">
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

        <PortfolioGrid categories={categories} />
      </div>
    </section>
  );
};

export default ServicesSection;
