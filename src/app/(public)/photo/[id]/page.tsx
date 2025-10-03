import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from "payload";
import config from "@payload-config";

const PhotoPage = async ({ params }: { params: Promise<{ id: number }> }) => {

  const { id } = await params;

  const payload = await getPayload({ config });

  const photo = await payload.findByID({
    collection: "photos",
    id,
  });


  if (!photo) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link 
        href="/portfolio" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Portfolio
      </Link>
      
      <div className="relative">
        {typeof photo.image === 'object' && photo.image?.url && (
          <Image
            src={photo.image.url}
            alt={photo.image.alt || photo.title || 'Photo'}
            width={photo.image.width || 800}
            height={photo.image.height || 1200}
            className="w-full h-auto rounded-lg"
            priority
          />
        )}
        
       
      </div>
    </div>
  )
}

export default PhotoPage