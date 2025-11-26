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
  } catch (error) {
    notFound();
  }
}

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Modal>
      <Suspense fallback={<div className="flex justify-center items-center h-full">Loading photo...</div>}>
        <PhotoContent id={id} />
      </Suspense>
    </Modal>
  )
}