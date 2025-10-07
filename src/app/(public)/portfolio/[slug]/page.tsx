import PhotoMasonryGrid from '@/components/portfolio/photo-masonry-grid';
import { getCategoryPhotosBySlug } from '@/lib/queries/photos';
import React from 'react'

const CategoryPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
    // Fetch category data based on slug if needed
    const { docs:photos } = await getCategoryPhotosBySlug(slug);

    console.log(photos);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <PhotoMasonryGrid photos={photos} />
    </div>
  )
}

export default CategoryPage