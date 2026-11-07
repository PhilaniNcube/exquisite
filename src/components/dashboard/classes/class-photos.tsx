import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { DeletePhotoButton } from "./delete-photo-button"
import { getSchoolPhotosByClassId } from "@/lib/queries/schoolPhotos"
import { normalizePhotoSearch, normalizePhotoSortOrder } from "@/lib/photo-query"
import { PhotoSearchInput } from "@/components/dashboard/photos/photo-search-input"
import { PhotoSortSelect } from "@/components/dashboard/photos/photo-sort-select"

export default async function ClassPhotos({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>
  searchParams: Promise<{ sort?: string; q?: string }>
}) {
  const { classId } = await params
  const { sort, q } = await searchParams
  const id = parseInt(classId, 10)
  if (isNaN(id)) return null

  const sortOrder = normalizePhotoSortOrder(sort)
  const search = normalizePhotoSearch(q)

  const photos = await getSchoolPhotosByClassId(classId, {
    limit: 100,
    sortOrder,
    search,
    visibility: "all",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos ({photos.totalDocs})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <PhotoSearchInput
            className="w-full sm:max-w-xs"
            placeholder="Search by name or ID..."
          />
          <PhotoSortSelect
            className="w-full sm:w-[200px]"
            label="Sort by name"
          />
        </div>

        {photos.docs.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {search
              ? `No photos found for "${search}".`
              : 'No photos found for this class.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.docs.map((photo) => {
              const media = photo.photo
              if (typeof media !== "object" || !media?.url) return null
              
              return (
                <div key={photo.id} className="relative aspect-square rounded-md overflow-hidden border group">
                  <Image
                    src={media.sizes?.thumbnail?.url || media.url}
                    alt={media.alt || photo.name}
                    fill
                    className="object-cover"
                  />
                  <DeletePhotoButton photoId={photo.id} classId={id} />
                  {photo.visibility && photo.visibility !== "public" && (
                    <Badge
                      variant="secondary"
                      className="absolute left-1 top-1 text-[10px] uppercase"
                    >
                      {photo.visibility === "pending_removal"
                        ? "Removal requested"
                        : "Hidden"}
                    </Badge>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                    {photo.name}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
