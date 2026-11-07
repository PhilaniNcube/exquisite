import { getCategoryPhotos } from '@/lib/queries/photos'
import { normalizePhotoSearch, normalizePhotoSortOrder } from '@/lib/photo-query'
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { Photo, Media } from '@/payload-types'
import Link from 'next/link'
import { PhotoSearchInput } from '@/components/dashboard/photos/photo-search-input'
import { PhotoSortSelect } from '@/components/dashboard/photos/photo-sort-select'

const CategoryPhotos = async ({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>
  searchParams: Promise<{ sort?: string; q?: string }>
}) => {
  const { categoryId } = await params;
  const { sort, q } = await searchParams;
  const categoryIdNum = parseInt(categoryId, 10);
  const sortOrder = normalizePhotoSortOrder(sort);
  const search = normalizePhotoSearch(q);
  const photosData = await getCategoryPhotos(categoryIdNum, sortOrder, search);
  const { docs: photos } = photosData;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <PhotoSearchInput
          className="w-full sm:max-w-xs"
          placeholder="Search by title or ID..."
        />
        <PhotoSortSelect
          className="w-full sm:w-[200px]"
          label="Sort by title"
        />
      </div>

      {!photos || photos.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          {search
            ? `No photos found for "${search}".`
            : 'No photos found for this category.'}
        </div>
      ) : (
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
      )}
    </div>
  )
}

export default CategoryPhotos
