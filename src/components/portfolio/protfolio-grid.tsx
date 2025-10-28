import { Category, Media } from "@/payload-types";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

import { getCategories } from "@/lib/queries/categories";

const PortfolioGrid = async () => {
  const { docs: categories } = await getCategories();

  // Function to get the correct portfolio route
  const getPortfolioRoute = (slug: string) => {
    const routes = {
      creches: "/portfolio/creches" as const,
      families: "/portfolio/families" as const,
      matric: "/portfolio/matric" as const,
      portraits: "/portfolio/portraits" as const,
      school: "/portfolio/school" as const,
      weddings: "/portfolio/weddings" as const,
    } as const;
    return routes[slug as keyof typeof routes] || ("/portfolio" as const);
  };



  // Empty state
  if (!categories || categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories found
          </h3>
          <p className="text-gray-500">
            There are no portfolio categories to display at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 lg:pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {categories.map((category) => {
          const image = category.image as Media;

          return (
            <Link
              key={category.id}
              href={getPortfolioRoute(category.slug)}
              className="group block"
            >
              <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-accent/50 aspect-video overflow-hidden p-0">
                <div className="relative w-full h-full">
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt || category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      priority={false}
                    />
                  ) : (
                    // Fallback background if no image
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />

                  {/* Category Name Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <h3 className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-lg group-hover:scale-110 transition-transform duration-300 leading-tight">
                      {category.name}
                    </h3>
                  </div>

                  {/* Optional description on hover */}
                  {category.description && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioGrid;
