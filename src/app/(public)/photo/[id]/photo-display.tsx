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
          src={photo.image.url}
          alt={photo.image.alt || photo.title || "Photo"}
          width={photo.image.width || 800}
          height={photo.image.height || 1200}
          className="w-full h-auto rounded-lg"
          priority
        />
      )}
    </div>
  );
};

export default PhotoDisplay;
