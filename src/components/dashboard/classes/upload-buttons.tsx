import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { UploadPhotoDialog } from "@/components/dashboard/classes/upload-photo-dialog";
import { BulkUploadPhotos } from "@/components/dashboard/classes/bulk-upload-photos";

export async function UploadButtons({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const id = parseInt(classId, 10);

  if (isNaN(id)) {
    return null;
  }

  const payload = await getPayload({ config });
  
  try {
    const cls = await payload.findByID({
      collection: "classes",
      id: id,
      depth: 0,
    });

    if (!cls) {
      return null;
    }

    const schoolId = cls.school && typeof cls.school === "object" && 'id' in cls.school ? cls.school.id : cls.school;

    if (!schoolId) {
      return null;
    }

    return (
      <div className="flex gap-2">
        <BulkUploadPhotos classId={id} schoolId={schoolId as number} />
        <UploadPhotoDialog classId={id} schoolId={schoolId as number} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching class for upload buttons:", error);
    return null;
  }
}
