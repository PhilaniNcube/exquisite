import PhotoMasonryGrid from '@/components/portfolio/photo-masonry-grid';
import { getCategoryPhotosBySlug } from '@/lib/queries/photos';
import React, { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Component to handle both params resolution and data fetching
const PhotosContent = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const { docs: photos } = await getCategoryPhotosBySlug(slug);
  return <PhotoMasonryGrid photos={photos} />;
}

// Loading component for suspense fallback
const PhotosLoading = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-64 mb-4 break-inside-avoid" />
      ))}
    </div>
  </div>
)

const CategoryPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <Suspense fallback={<PhotosLoading />}>
        <PhotosContent params={params} />
      </Suspense>
    </div>
  )
}

export default CategoryPage