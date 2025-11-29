import { getCategoryPhotos } from '@/lib/queries/photos'
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { Photo, Media } from '@/payload-types'
import Link from 'next/link'

const CategoryPhotos = async ({params}: { params: Promise<{ categoryId: string }> }) => {
  const { categoryId } = await params;
  const categoryIdNum = parseInt(categoryId, 10);
  const photosData = await getCategoryPhotos(categoryIdNum);
  const { docs: photos } = photosData;

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No photos found for this category.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo: Photo) => {
        const image = photo.image as Media; // Type assertion assuming it's populated
        const thumbnailUrl = image?.sizes?.thumbnail?.url || image?.url;

        return (
          <Card key={photo.id} className="overflow-hidden p-0">
            <Link href={`/dashboard/photos/${photo.id}`}>
            <CardContent className="p-0 aspect-square relative">
              {thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt={image?.alt || photo.title || 'Photo'}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  No Image
                </div>
              )}
            </CardContent>
            </Link>
          </Card>
        )
      })}
    </div>
  )
}

export default CategoryPhotos