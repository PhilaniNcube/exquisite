import PhotoMasonryGrid from '@/components/portfolio/photo-masonry-grid';
import CategoryHero from '@/components/portfolio/category-hero';
import { getCategoryPhotosBySlug } from '@/lib/queries/photos';
import { getCategoryBySlug } from '@/lib/queries/categories';
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

// Category hero with data fetching
const CategoryHeroContent = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const { docs } = await getCategoryBySlug(slug)
  const category = docs?.[0]
  if (!category) return null
  return <CategoryHero category={category} />
}

const HeroLoading = () => (
  <div className="relative w-full h-[55vh] max-h-[70vh] overflow-hidden">
    <div className="absolute inset-0 bg-muted" />
  </div>
)

const CategoryPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <div className="">
      <Suspense fallback={<HeroLoading />}>
        <CategoryHeroContent params={params} />
      </Suspense>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <Suspense fallback={<PhotosLoading />}>
          <PhotosContent params={params} />
        </Suspense>
      </div>
    </div>
  )
}

export default CategoryPage