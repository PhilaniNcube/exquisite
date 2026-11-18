import Image from "next/image";
import { notFound } from "next/navigation";
import { getPhotoById } from "@/lib/queries/photos";
import { Modal } from "./modal";
import { Suspense } from "react";

const PhotoContent = async ({ id }: { id: string }) => {
  try {
    const photo = await getPhotoById(Number(id));
  
    if (!photo) {
      notFound()
    }
    
    return (
      <div className="flex justify-center items-center h-full">
        <div className="relative">
          {typeof photo.image === 'object' && photo.image?.url && (
            <Image
              src={
                photo.image.sizes?.tablet?.url ||
                photo.image.sizes?.card?.url ||
                photo.image.url
              }
              alt={photo.image.alt || photo.title || 'Photo'}
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
              className="h-[80vh] object-contain rounded-lg"
              priority
            />
          )}
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

const PhotoContentWrapper = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <PhotoContent id={id} />;
}

export default function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Modal>
      <Suspense fallback={<div className="flex justify-center items-center h-full">Loading photo...</div>}>
        <PhotoContentWrapper params={params} />
      </Suspense>
    </Modal>
  )
}