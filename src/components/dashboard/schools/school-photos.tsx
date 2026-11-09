import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import type { Media } from "@/payload-types";
import { getSchoolPhotosBySchoolId } from "@/lib/queries/schoolPhotos";
import { normalizePhotoSearch, normalizePhotoSortOrder } from "@/lib/photo-query";
import { PhotoSearchInput } from "@/components/dashboard/photos/photo-search-input";
import { PhotoSortSelect } from "@/components/dashboard/photos/photo-sort-select";
import { DeletePhotoButton } from "@/components/dashboard/school-photos/delete-photo-button";

export default async function SchoolPhotos({
  schoolId,
  sort,
  q,
}: {
  schoolId: string;
  sort?: string;
  q?: string;
}) {
  const id = parseInt(schoolId, 10);
  if (isNaN(id)) return null;

  const sortOrder = normalizePhotoSortOrder(sort);
  const search = normalizePhotoSearch(q);

  const photos = await getSchoolPhotosBySchoolId(schoolId, {
    limit: 12,
    sortOrder,
    search,
    visibility: "all",
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
            {search
              ? `No photos found for "${search}".`
              : "No photos have been uploaded for this school yet."}
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
                  
                  <DeletePhotoButton
                    photoId={photo.id}
                    photoName={photo.name}
                    className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-destructive text-destructive-foreground opacity-100 shadow-md transition-opacity hover:bg-destructive/90 hover:text-destructive-foreground focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                  />

                  <div className="mt-1">
                    <p className="text-sm truncate" title={photo.name || ""}>
                      {photo.name || "Untitled"}
                    </p>
                    {photo.photoType && (
                      <p className="text-xs text-muted-foreground">
                        {photo.photoType}
                      </p>
                    )}
                    {photo.visibility && photo.visibility !== "public" && (
                      <Badge variant="secondary" className="mt-1 text-[10px] uppercase">
                        {photo.visibility === "pending_removal"
                          ? "Removal requested"
                          : "Hidden"}
                      </Badge>
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
