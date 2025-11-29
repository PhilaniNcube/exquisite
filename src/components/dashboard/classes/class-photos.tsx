import { getPayload } from "payload"
import config from "@payload-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default async function ClassPhotos({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const id = parseInt(classId, 10)
  if (isNaN(id)) return null

  const payload = await getPayload({ config })
  
  const photos = await payload.find({
    collection: "schoolPhotos",
    where: {
      "schoolDetails.class": {
        equals: id,
      },
    },
    limit: 100,
    depth: 1,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos ({photos.totalDocs})</CardTitle>
      </CardHeader>
      <CardContent>
        {photos.docs.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No photos found for this class.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.docs.map((photo) => {
              const media = photo.photo
              if (typeof media !== "object" || !media?.url) return null
              
              return (
                <div key={photo.id} className="relative aspect-square rounded-md overflow-hidden border">
                  <Image
                    src={media.sizes?.thumbnail?.url || media.url}
                    alt={media.alt || photo.name}
                    fill
                    className="object-cover"
                  />
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
