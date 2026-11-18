"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Class, Media, School, SchoolPhoto } from "@/payload-types";
import { PhotoRemovalRequestButton } from "@/components/school-photos/photo-removal-request-button";
interface SchoolPhotoDisplayProps {
  photo: SchoolPhoto;
}

export function SchoolPhotoDisplay({ photo }: SchoolPhotoDisplayProps) {
  const photoMedia =
    typeof photo.photo === "number" ? null : (photo.photo as Media);
  // Payload generates a 768px webp `card` at upload. The original is only used
  // as a fallback, and only then do we let the optimizer touch it.
  const display = photoMedia?.sizes?.card ?? null;
  const school =
    !photo.schoolDetails || typeof photo.schoolDetails.school === "number"
      ? null
      : (photo.schoolDetails.school as School);
  const classInfo =
    photo.schoolDetails?.class && typeof photo.schoolDetails.class !== "number"
      ? (photo.schoolDetails.class as Class)
      : null;

  const photoTypeLabels: Record<string, string> = {
    individual: "Individual Photo",
    class: "Class Photo",
    group: "Group Photo",
  };

  return (
    <Card className="overflow-hidden border-2 p-0">
      <div className="relative bg-muted">
        {photoMedia?.url ? (
          <Image
            src={display?.url || photoMedia.url || "/placeholder.svg"}
            alt={photoMedia.alt || photo.name}
            width={display?.width || photoMedia.width || 800}
            height={display?.height || photoMedia.height || 1000}
            sizes="(min-width: 1024px) 400px, 100vw"
            unoptimized={Boolean(display?.url)}
            style={{ width: "100%", height: "auto" }}
            className="block"
            priority
          />
        ) : (
          <div className="w-full aspect-4/5 flex items-center justify-center">
            <span className="text-muted-foreground">No photo available</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-balance mb-2">
            {photo.name}
          </h2>
          {photo.photoType && (
            <Badge variant="secondary" className="text-sm">
              {photoTypeLabels[photo.photoType] || photo.photoType}
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm">
          {photo.studentName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Student:</span>
              <span className="font-medium">{photo.studentName}</span>
            </div>
          )}

          {school && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">School:</span>
              <span className="font-medium">{school.name}</span>
            </div>
          )}

          {classInfo && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Class:</span>
              <span className="font-medium">{classInfo.name}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t text-xs text-muted-foreground">
          Photo ID: {photo.id}
        </div>

        {/* <PhotoRemovalRequestButton
          photo={photo}
          schoolName={school?.name}
          className="w-full"
        /> */}
      </div>
    </Card>
  );
}
