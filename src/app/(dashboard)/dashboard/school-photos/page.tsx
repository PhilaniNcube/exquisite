import React, { Suspense } from 'react'
import { SchoolPhotosFilterWrapper } from '@/components/dashboard/school-photos/school-photos-filter-wrapper'
import { SchoolPhotosList } from '@/components/dashboard/school-photos/photo-list'
import { SchoolPhotosFilterSkeleton, SchoolPhotosListSkeleton } from '@/components/dashboard/school-photos/skeletons'

export default function SchoolPhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; school?: string; class?: string }>
}) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">School Photos</h1>
      </div>

      <Suspense fallback={<SchoolPhotosFilterSkeleton />}>
        <SchoolPhotosFilterWrapper />
      </Suspense>

      <Suspense fallback={<SchoolPhotosListSkeleton />}>
        <SchoolPhotosList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
