import PhotoMasonryGrid from '@/components/portfolio/photo-masonry-grid';
import { getCategoryPhotosBySlug } from '@/lib/queries/photos';
import React from 'react'

const CategoryPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
    // Fetch category data based on slug if needed
    const { docs:photos } = await getCategoryPhotosBySlug(slug);

    console.log(photos);

  return (
    <div>
      <PhotoMasonryGrid photos={photos} />
    </div>
  )
}

export default CategoryPage