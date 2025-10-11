import { SchoolPhoto } from "@/payload-types";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Camera } from "lucide-react";

interface SchoolPhotosGalleryProps {
  photos: SchoolPhoto[];
  schoolName: string;
}

const SchoolPhotosGallery = ({
  photos,
  schoolName,
}: SchoolPhotosGalleryProps) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-600 mb-2">
          No Photos Yet
        </h3>
        <p className="text-gray-500">
          Photos from {schoolName} will appear here once they&apos;re available.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">School Photos</h2>
        <p className="text-gray-600">
          Browse through our photography collection from {schoolName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <Card
            key={photo.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-square relative overflow-hidden">
              {photo.photo && typeof photo.photo === "object" && (
                <Image
                  src={photo.photo.url || ""}
                  alt={photo.photo.alt || "School photo"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <CardContent className="p-4">
              {photo.photo &&
                typeof photo.photo === "object" &&
                photo.photo.alt && (
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {photo.photo.alt}
                  </h4>
                )}

              <div className="flex flex-wrap gap-2 mb-3">
                {photo.schoolDetails &&
                  typeof photo.schoolDetails.class === "object" &&
                  photo.schoolDetails.class && (
                    <Badge variant="outline" className="text-xs">
                      {photo.schoolDetails.class.name}
                    </Badge>
                  )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SchoolPhotosGallery;
