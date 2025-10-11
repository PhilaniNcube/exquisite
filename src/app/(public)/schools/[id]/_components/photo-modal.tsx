"use client";

import { SchoolPhoto } from "@/payload-types";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface PhotoModalProps {
  photo: SchoolPhoto | null;
  isOpen: boolean;
  onClose: () => void;
}

const PhotoModal = ({ photo, isOpen, onClose }: PhotoModalProps) => {
  if (!photo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <div className="relative">
          {photo.photo && typeof photo.photo === "object" && (
            <div className="relative w-full h-[80vh]">
              <Image
                src={photo.photo.url || ""}
                alt={photo.photo.alt || "School photo"}
                fill
                className="object-contain"
              />
            </div>
          )}
          
          {/* Photo details overlay */}
          {(photo.photo || (photo.schoolDetails && typeof photo.schoolDetails.class === "object" && photo.schoolDetails.class)) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              {photo.photo && typeof photo.photo === "object" && photo.photo.alt && (
                <h3 className="text-lg font-medium mb-2">{photo.photo.alt}</h3>
              )}
              
              <div className="flex flex-wrap gap-2">
                {photo.schoolDetails &&
                  typeof photo.schoolDetails.class === "object" &&
                  photo.schoolDetails.class && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {photo.schoolDetails.class.name}
                    </Badge>
                  )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;
