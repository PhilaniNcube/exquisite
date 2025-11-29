import React, { Suspense } from 'react'
import { PhotoDetails } from '@/components/dashboard/photos/photo-details'

export default async function PhotoPage({ params }: { params: Promise<{ photoId: string }> }) {
  

  return (
    <Suspense fallback={<div>Loading photo...</div>}>
      <PhotoDetails params={params} />
    </Suspense>
  )
}