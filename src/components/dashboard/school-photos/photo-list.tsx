import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Media } from '@/payload-types'
import { Pagination } from './pagination'
import { DeletePhotoButton } from './delete-photo-button'
import { getSchoolPhotos } from '@/lib/queries/schoolPhotos'
import { normalizePhotoSearch, normalizePhotoSortOrder } from '@/lib/photo-query'

export async function SchoolPhotosList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; school?: string; class?: string; sort?: string; q?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1
  const schoolId = resolvedSearchParams?.school
  const classId = resolvedSearchParams?.class
  const sortOrder = normalizePhotoSortOrder(resolvedSearchParams?.sort)
  const search = normalizePhotoSearch(resolvedSearchParams?.q)
  const limit = 12

  const photos = await getSchoolPhotos({
    page,
    limit,
    schoolId,
    classId,
    sortOrder,
    search,
    visibility: "all",
  })

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.docs.map((photo: any) => {
          const image = photo.photo as Media
          const imageUrl = image?.sizes?.card?.url || image?.url

          return (
            <Card key={photo.id} className="overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={photo.name || 'School Photo'}
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
              <CardFooter className="p-4 flex flex-col items-start gap-2">
                <div className="flex justify-between items-center w-full">
                    <span className="font-medium truncate flex-1 mr-2" title={photo.name}>
                    {photo.name || 'Untitled'}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      #{photo.id}
                    </span>
                    {photo.visibility && photo.visibility !== 'public' && (
                      <Badge variant="secondary" className="shrink-0 text-[10px] uppercase">
                        {photo.visibility === 'pending_removal' ? 'Removal requested' : 'Hidden'}
                      </Badge>
                    )}
                    <Button asChild variant="outline" size="sm" className="ml-2">
                    <Link href={`/dashboard/school-photos/${photo.id}`}>View</Link>
                    </Button>
                    <DeletePhotoButton
                      photoId={photo.id}
                      photoName={photo.name}
                      className="ml-1 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    />
                </div>
                <div className="text-xs text-muted-foreground w-full">
                    {photo.schoolDetails?.school && (
                        <span className="block truncate">
                            School: {typeof photo.schoolDetails.school === 'object' ? photo.schoolDetails.school.name : 'Unknown'}
                        </span>
                    )}
                    {photo.schoolDetails?.class && (
                        <span className="block truncate">
                            Class: {typeof photo.schoolDetails.class === 'object' ? photo.schoolDetails.class.name : 'Unknown'}
                        </span>
                    )}
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {photos.docs.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          {search
            ? `No school photos found for "${search}".`
            : 'No school photos found matching your criteria.'}
        </div>
      )}

      <Pagination 
        page={photos.page || 1}
        totalPages={photos.totalPages}
        hasPrevPage={photos.hasPrevPage}
        hasNextPage={photos.hasNextPage}
        prevPage={photos.prevPage}
        nextPage={photos.nextPage}
        searchParams={resolvedSearchParams || {}}
        baseUrl="/dashboard/school-photos"
      />
    </>
  )
}
