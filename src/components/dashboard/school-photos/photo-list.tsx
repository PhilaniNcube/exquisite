import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Media } from '@/payload-types'
import { Pagination } from './pagination'

export async function SchoolPhotosList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; school?: string; class?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1
  const schoolId = resolvedSearchParams?.school
  const classId = resolvedSearchParams?.class
  const limit = 12

  const payload = await getPayload({ config: configPromise })

  // Build query
  const where: any = {}
  
  if (schoolId) {
    where['schoolDetails.school'] = {
      equals: schoolId,
    }
  }

  if (classId) {
    where['schoolDetails.class'] = {
      equals: classId,
    }
  }

  const photos = await payload.find({
    collection: 'schoolPhotos',
    limit,
    page,
    where,
    depth: 1,
  })

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.docs.map((photo: any) => {
          const image = photo.photo as Media
          const imageUrl = image?.sizes?.card?.url || image?.url

          return (
            <Card key={photo.id} className="overflow-hidden">
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
                    <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/school-photos/${photo.id}`}>View</Link>
                    </Button>
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
          No school photos found matching your criteria.
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
