import { getProducts } from "@/lib/queries/products";
import { getSchoolPhotoById } from "@/lib/queries/schoolPhotos";
import React from "react";
import { SchoolPhotoDisplay } from "../_components/school-photo-display";
import { ProductSelector } from "../_components/product-selector";

const SchoolPhoto = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const schoolPhotoPromise = getSchoolPhotoById(id);
  const productsPromise = getProducts(); // Placeholder for fetching related products if needed

  const [schoolPhoto, products] = await Promise.all([
    schoolPhotoPromise,
    productsPromise,
  ]);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-24 lg:py-32">
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-3">
            Your School Photo
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            View your school photo and order beautiful prints to share with
            family and friends
          </p>
        </header>
        <div className="grid lg:grid-cols-[400px_1fr] gap-8 lg:gap-12 mb-12">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <SchoolPhotoDisplay photo={schoolPhoto} />
          </div>
           <div>
            <ProductSelector products={products.docs} schoolPhoto={schoolPhoto} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default SchoolPhoto;
