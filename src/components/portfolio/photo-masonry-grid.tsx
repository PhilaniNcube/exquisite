"use client"

import { Photo } from '@/payload-types'
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const PhotoMasonryGrid = ({photos}:{photos:Photo[]}) => {
  const router = useRouter()

  const handlePhotoClick = (photoId: number) => {
    router.push(`/photo/${photoId}`)
  }

  return (
    <div className='max-w-7xl mx-auto py-12 px-4'>
      <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'>
        {photos.map((photo) => (
          <div 
            key={photo.id}
            className='break-inside-avoid mb-4 cursor-pointer group'
            onClick={() => handlePhotoClick(photo.id)}
          >
            <div className='relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300'>
              {typeof photo.image === 'object' && photo.image?.url && (
                <Image
                  src={photo.image.url}
                  alt={photo.image.alt || photo.title || 'Photo'}
                  width={photo.image.width || 400}
                  height={photo.image.height || 600}
                  className='w-full h-auto group-hover:scale-105 transition-transform duration-300'
                />
              )}
              {photo.title && (
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4'>
                  <p className='text-white text-sm font-medium'>{photo.title}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PhotoMasonryGrid