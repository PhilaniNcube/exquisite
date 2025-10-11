"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Class, Media, School, SchoolPhoto } from "@/payload-types";
import { unstable_ViewTransition as ViewTransition } from "react";

interface SchoolPhotoDisplayProps {
  photo: SchoolPhoto;
}

export function SchoolPhotoDisplay({ photo }: SchoolPhotoDisplayProps) {
  const photoMedia =
    typeof photo.photo === "number" ? null : (photo.photo as Media);
  const school =
    typeof photo.schoolDetails.school === "number"
      ? null
      : (photo.schoolDetails.school as School);
  const classInfo =
    photo.schoolDetails.class && typeof photo.schoolDetails.class !== "number"
      ? (photo.schoolDetails.class as Class)
      : null;

  const photoTypeLabels: Record<string, string> = {
    individual: "Individual Photo",
    class: "Class Photo",
    group: "Group Photo",
  };

  return (
    <Card className="overflow-hidden border-2">
      <div className="aspect-[4/5] relative bg-muted">
        {photoMedia?.url ? (
          <ViewTransition enter={"auto"} key="photo-image">
            <Image
              src={photoMedia.url || "/placeholder.svg"}
              alt={photoMedia.alt || photo.name}
              fill
              className="object-cover"
              priority
            />
          </ViewTransition>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
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
      </div>
    </Card>
  );
}
