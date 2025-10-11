import { getSchoolPhotosBySchoolId } from "@/lib/queries/schoolPhotos";
import Image from "next/image";
import React from "react";

interface SchoolPhotosDisplayProps {
  searchParams: { [key: string]: string | string[] | undefined };
  key: string;
}

const SchoolPhotosDisplay = async ({
  searchParams,
  key,
}: SchoolPhotosDisplayProps) => {
  const { schoolId, classId } = searchParams;

  let schoolPhotos;

  // Don't attempt to fetch if no school is selected
  if (!schoolId || typeof schoolId !== "string") {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-center">
          Select a school to view photos.
        </p>
      </div>
    );
  }

  console.log("SchoolPhotosDisplay props:", { searchParams, key });

  try {
    schoolPhotos = await getSchoolPhotosBySchoolId(schoolId);
  } catch (error) {
    console.error("Error fetching school photos:", error);
    return (
      <div className="p-4">
        <p className="text-red-500 text-center">
          Unable to load photos at this time. The query configuration may need
          to be updated.
        </p>
      </div>
    );
  }

  console.log("Fetched school photos:", schoolPhotos);

  if (!schoolPhotos || !schoolPhotos.docs || schoolPhotos.docs.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-center">
          {schoolId
            ? "No photos available for the selected school."
            : "Select a school to view photos."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        School Photos ({schoolPhotos.docs.length})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {schoolPhotos.docs.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square relative overflow-hidden rounded-lg border"
          >
            {photo.photo &&
            typeof photo.photo === "object" &&
            photo.photo.url ? (
              <Image
                src={photo.photo.url}
                alt={photo.photo.alt || `School photo ${photo.id}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            {photo.name && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                {photo.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchoolPhotosDisplay;
