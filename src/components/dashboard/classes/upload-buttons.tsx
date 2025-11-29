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

    const schoolId = typeof cls.school === "object" ? cls.school.id : cls.school;

    return (
      <div className="flex gap-2">
        <BulkUploadPhotos classId={id} schoolId={schoolId} />
        <UploadPhotoDialog classId={id} schoolId={schoolId} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching class for upload buttons:", error);
    return null;
  }
}
