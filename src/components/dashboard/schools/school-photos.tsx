import { getPayload } from "payload";
import config from "@payload-config";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Trash2 } from "lucide-react";
import type { Media, SchoolPhoto } from "@/payload-types";

export default async function SchoolPhotos({
  schoolId,
}: {
  schoolId: string;
}) {
  const id = parseInt(schoolId, 10);
  if (isNaN(id)) return null;

  const payload = await getPayload({ config });

  const photos = await payload.find({
    collection: "schoolPhotos",
    where: {
      "schoolDetails.school": {
        equals: id,
      },
    },
    limit: 12,
    depth: 1,
    sort: "-createdAt",
  });

  // Count photos by type
  const typeCounts = photos.docs.reduce(
    (acc, photo) => {
      const type = photo.photoType || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  async function deletePhoto(photoId: string | number) {
    "use server";
    const payload = await getPayload({ config });
    await payload.delete({
      collection: "schoolPhotos",
      id: photoId,
    });
    revalidatePath(`/dashboard/schools/${id}`);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>School Photos</CardTitle>
          <Badge variant="secondary">{photos.totalDocs}</Badge>
        </div>
        <Button asChild size="sm">
          <Link href={`/dashboard/school-photos?school=${id}`}>
            <Camera className="h-4 w-4 mr-2" />
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo type breakdown */}
        {Object.keys(typeCounts).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeCounts).map(([type, count]) => (
              <Badge key={type} variant="outline">
                {type}: {count}
              </Badge>
            ))}
          </div>
        )}

        {/* Photo grid */}
        {photos.docs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No photos have been uploaded for this school yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.docs.map((photo) => {
              const image = photo.photo as Media;
              const imageUrl =
                image?.sizes?.card?.url ||
                image?.sizes?.thumbnail?.url ||
                image?.url;

              return (
                <div key={photo.id} className="group relative">
                  <Link
                    href={`/dashboard/school-photos/${photo.id}`}
                    className="block"
                  >
                    <div className="relative aspect-square rounded-md overflow-hidden border bg-muted">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={photo.name || "School Photo"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <form 
                    action={deletePhoto.bind(null, photo.id)} 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                     <Button type="submit" variant="destructive" size="icon" className="h-7 w-7 rounded-full shadow-md" title="Delete photo">
                       <Trash2 className="h-3.5 w-3.5" />
                     </Button>
                  </form>

                  <div className="mt-1">
                    <p className="text-sm truncate" title={photo.name || ""}>
                      {photo.name || "Untitled"}
                    </p>
                    {photo.photoType && (
                      <p className="text-xs text-muted-foreground">
                        {photo.photoType}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Show "View All" if there are more */}
        {photos.totalDocs > 12 && (
          <div className="text-center pt-2">
            <Button asChild variant="link" size="sm">
              <Link href={`/dashboard/school-photos?school=${id}`}>
                View all {photos.totalDocs} photos
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
