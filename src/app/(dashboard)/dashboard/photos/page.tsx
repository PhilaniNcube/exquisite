import React, { Suspense } from 'react'
import { PhotosGrid } from '@/components/dashboard/photos/photos-grid'
import { PhotoSearchInput } from '@/components/dashboard/photos/photo-search-input'
import { PhotoSortSelect } from '@/components/dashboard/photos/photo-sort-select'
import { Skeleton } from '@/components/ui/skeleton'

export default function PhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; q?: string }>
}) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Photos</h1>
      </div>

      <Suspense fallback={<PhotosToolbarSkeleton />}>
        <div className="flex flex-col sm:flex-row gap-4 items-end mb-6">
          <PhotoSearchInput
            className="w-full sm:max-w-sm"
            placeholder="Search by title or ID..."
          />
          <PhotoSortSelect
            className="w-full sm:w-[220px]"
            label="Sort by title"
          />
        </div>
      </Suspense>

      <Suspense fallback={<div>Loading photos...</div>}>
        <PhotosGrid searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

function PhotosToolbarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end mb-6">
      <div className="w-full space-y-1 sm:max-w-sm">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="w-full space-y-1 sm:w-[220px]">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
