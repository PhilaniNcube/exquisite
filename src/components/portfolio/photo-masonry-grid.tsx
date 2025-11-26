"use client";

import { Photo } from "@/payload-types";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PhotoMasonryGrid = ({ photos }: { photos: Photo[] }) => {
  // Simple SVG shimmer placeholder for blurDataURL
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="20%" />
          <stop stop-color="#edeef1" offset="50%" />
          <stop stop-color="#f6f7f8" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f6f7f8" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setIsImageLoading(true);
  }, [selectedPhotoIndex]);

  const openModal = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPhotoIndex(null);
  }, []);

  const goToNext = useCallback(() => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  }, [selectedPhotoIndex, photos.length]);

  const goToPrevious = useCallback(() => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  }, [selectedPhotoIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen || selectedPhotoIndex === null) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, selectedPhotoIndex, goToNext, goToPrevious, closeModal]);

  const canGoNext =
    selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1;
  const canGoPrevious = selectedPhotoIndex !== null && selectedPhotoIndex > 0;
  const currentPhoto =
    selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <>
      <div className="container mx-auto py-12 px-4">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openModal(index)}
              className="break-inside-avoid cursor-pointer group mb-4 block"
            >
              <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                {typeof photo.image === "object" && photo.image?.url && (
                  <Image
                    src={
                      (photo.image as any).sizes?.card?.url ||
                      photo.image.sizes?.card?.url
                    }
                    alt={photo.image.alt || photo.title || "Photo"}
                    width={500}
                    height={500}
                    quality={80}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 8}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(
                        (photo.image.width ?? 4000) / 20,
                        (photo.image.height ?? 6000) / 20
                      )
                    )}`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-none overflow-hidden">
          <DialogTitle className="sr-only">
            {/* {currentPhoto?.title || 'Photo Gallery'} */}
          </DialogTitle>

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}

            {/* Previous button */}
            <Button
              size="icon"
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12",
                !canGoPrevious && "opacity-30 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="h-8 w-8" />
              <span className="sr-only">Previous photo</span>
            </Button>

            {/* Next button */}
            <Button
              size="icon"
              onClick={goToNext}
              disabled={!canGoNext}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12",
                !canGoNext && "opacity-30 cursor-not-allowed"
              )}
            >
              <ChevronRight className="h-8 w-8" />
              <span className="sr-only">Next photo</span>
            </Button>

            {/* Main image */}
            {currentPhoto &&
              typeof currentPhoto.image === "object" &&
              currentPhoto.image?.url && (
                <div className="relative w-full h-full flex items-center justify-center">
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                      <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
                    </div>
                  )}
                  <Image
                    src={
                      currentPhoto.image.sizes?.card?.url ||
                      currentPhoto.image.url
                    }
                    alt={
                      currentPhoto.image.alt || currentPhoto.title || "Photo"
                    }
                    width={
                      currentPhoto.image.width
                        ? currentPhoto.image.width / 2
                        : 800
                    }
                    height={
                      currentPhoto.image.height
                        ? currentPhoto.image.height / 2
                        : 600
                    }
                    className="max-w-full max-h-full object-contain"
                    priority
                    onLoad={() => setIsImageLoading(false)}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(
                        currentPhoto.image.width || 800,
                        currentPhoto.image.height || 600
                      )
                    )}`}
                  />
                </div>
              )}

            {/* Photo counter */}
            {selectedPhotoIndex !== null && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedPhotoIndex + 1} of {photos.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoMasonryGrid;
