import React from 'react'
import { getPhotos } from '@/lib/queries/photos'
import { normalizePhotoSearch, normalizePhotoSortOrder } from '@/lib/photo-query'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Media } from '@/payload-types'
import { Route } from 'next'

export async function PhotosGrid({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; q?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1
  const sortOrder = normalizePhotoSortOrder(resolvedSearchParams?.sort)
  const search = normalizePhotoSearch(resolvedSearchParams?.q)
  const limit = 12

  const photos = await getPhotos(page, limit, sortOrder, search)

  const buildPageHref = (pageNumber: number) => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (sortOrder === 'desc') params.set('sort', 'desc')
    params.set('page', pageNumber.toString())
    return `/dashboard/photos?${params.toString()}` as Route
  }

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
              <CardFooter className="p-4 flex flex-col items-stretch gap-2">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="font-medium truncate" title={photo.title || 'Untitled photo'}>
                    {photo.title || 'Untitled photo'}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    #{photo.id}
                  </span>
                </div>
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
          {search ? `No photos found for "${search}".` : 'No photos found.'}
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
              <Link href={buildPageHref(photos.prevPage ?? 1)}>
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
              <Link href={buildPageHref(photos.nextPage ?? 1)}>
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
