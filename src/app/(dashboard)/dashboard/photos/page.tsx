

import React, { Suspense } from 'react'
import { PhotosGrid } from '@/components/dashboard/photos/photos-grid'

export default function PhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Photos</h1>
      </div>

      <Suspense fallback={<div>Loading photos...</div>}>
        <PhotosGrid searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
