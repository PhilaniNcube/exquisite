import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { Modal } from "./modal";
import { Suspense } from "react";

const PhotoContent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  const payload = await getPayload({ config });
  
  const photo = await payload.findByID({
    collection: "photos",
    id,
  });

  console.log(photo);
  
  if (!photo) {
    notFound()
  }
  
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative">
        {typeof photo.image === 'object' && photo.image?.url && (
          <Image
            src={photo.image.url}
            alt={photo.image.alt || photo.title || 'Photo'}
            width={photo.image.width || 800}
            height={photo.image.height || 1200}
            className="h-[80vh] object-contain rounded-lg"
            priority
          />
        )}
      </div>
    </div>
  );
}

export default function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Modal>
      <Suspense fallback={<div className="flex justify-center items-center h-full">Loading photo...</div>}>
        <PhotoContent params={params} />
      </Suspense>
    </Modal>
  )
}