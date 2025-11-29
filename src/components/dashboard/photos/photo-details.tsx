import { getPhotoById } from '@/lib/queries/photos'
import { Media } from '@/payload-types'
import Image from 'next/image'
import React from 'react'

export async function PhotoDetails({ params }: { params: Promise<{ photoId: string }> }) {
  const { photoId } = await params  
  const id = parseInt(photoId)

  if (isNaN(id)) {
    return <div>Invalid Photo ID</div>
  }

  const photo = await getPhotoById(id)

  if (!photo) {
    return <div>Photo not found</div>
  }

  const image = photo.image as Media

  return (
    <div className="w-full h-[calc(100vh-10rem)] relative flex items-center justify-center bg-muted/20 rounded-lg overflow-hidden border my-4">
      {image?.url ? (
        <Image
          src={image.url}
          alt={image.alt || photo.title || 'Photo'}
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="text-muted-foreground">No image available</div>
      )}
    </div>
  )
}
