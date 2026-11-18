import { getPayload } from "payload";
import config from "@payload-config";
import React from "react";
import Image from "next/image";

const PhotoDisplay = async ({ id }: { id: number }) => {
  const payload = await getPayload({ config });

  const photo = await payload.findByID({
    collection: "photos",
    id,
  });

  return (
    <div className="relative">
      {typeof photo.image === "object" && photo.image?.url && (
        <Image
          src={
            photo.image.sizes?.tablet?.url ||
            photo.image.sizes?.card?.url ||
            photo.image.url
          }
          alt={photo.image.alt || photo.title || "Photo"}
          width={
            photo.image.sizes?.tablet?.width ||
            photo.image.width ||
            800
          }
          height={
            photo.image.sizes?.tablet?.height ||
            photo.image.height ||
            1200
          }
          sizes="(min-width: 1024px) 896px, 100vw"
          unoptimized={Boolean(
            photo.image.sizes?.tablet?.url || photo.image.sizes?.card?.url
          )}
          className="w-full h-auto rounded-lg"
          priority
        />
      )}
    </div>
  );
};

export default PhotoDisplay;
