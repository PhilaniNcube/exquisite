import React from 'react'
import { getPhotos } from '@/lib/queries/photos'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Media } from '@/payload-types'

export async function PhotosGrid({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1
  const limit = 12

  const photos = await getPhotos(page, limit)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.docs.map((photo: any) => {
          const image = photo.image as Media
          const imageUrl = image?.sizes?.card?.url || image?.url

          return (
            <Card key={photo.id} className="overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={photo.title || 'Photo'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
               
                <Button asChild variant="outline" className='w-full'>
                  <Link href={`/dashboard/photos/${photo.id}`}>View</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {photos.docs.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No photos found.
        </div>
      )}

      {photos.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            disabled={!photos.hasPrevPage}
            asChild={photos.hasPrevPage}
          >
            {photos.hasPrevPage ? (
              <Link href={`/dashboard/photos?page=${photos.prevPage}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span className="cursor-not-allowed opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {photos.page} of {photos.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={!photos.hasNextPage}
            asChild={photos.hasNextPage}
          >
            {photos.hasNextPage ? (
              <Link href={`/dashboard/photos?page=${photos.nextPage}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="cursor-not-allowed opacity-50">
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      )}
    </>
  )
}
