"use client";

import { SchoolPhoto, Class } from "@/payload-types";
import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import { useState, useMemo } from "react";
import PhotoModal from "./photo-modal";
import PhotoFilters from "./photo-filters";
import Link from "next/link";

interface SchoolPhotosGalleryProps {
  photos: SchoolPhoto[];
  classes: Class[];
  schoolName: string;
}

const SchoolPhotosGallery = ({
  photos,
  classes,
  schoolName,
}: SchoolPhotosGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<SchoolPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    class: "",
    studentName: "",
    photoType: "",
  });

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Filter by class
      if (
        filters.class &&
        photo.schoolDetails &&
        typeof photo.schoolDetails.class === "object" &&
        photo.schoolDetails.class?.id !== parseInt(filters.class)
      ) {
        return false;
      }

      // Filter by student name
      if (filters.studentName) {
        // Since students property doesn't exist on SchoolPhoto, skip this filter for now
        // TODO: Update this when the correct property for students is available
        // const hasStudent = photo.students?.some(
        //   (student) =>
        //     typeof student === "object" && student.name === filters.studentName
        // );
        // if (!hasStudent) return false;
      }

      // Filter by photo type
      if (filters.photoType && photo.photoType !== filters.photoType) {
        return false;
      }

      return true;
    });
  }, [photos, filters]);

  const handlePhotoClick = (photo: SchoolPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

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

      <PhotoFilters
        photos={photos}
        classes={classes}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">
            No Photos Found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters to see more photos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <Card
              key={photo.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 relative p-0 cursor-pointer"
            >
              <Link
                href={`/school-photos/${photo.id}`}
                className="aspect-square relative overflow-hidden"
              >
                <CardTitle className="sr-only">
                  {photo.name|| "School Photo"}
                </CardTitle>
                {photo.photo && typeof photo.photo === "object" && (
                  <Image
                    src={photo.photo.url || ""}
                    alt={photo.photo.alt || "School photo"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Photo details overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex flex-wrap gap-2">
                    {photo.schoolDetails &&
                      typeof photo.schoolDetails.class === "object" &&
                      photo.schoolDetails.class && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-white/20 text-white border-white/30 hover:bg-white/30"
                        >
                          {photo.schoolDetails.class.name}
                        </Badge>
                      )}
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolPhotosGallery;
