"use client"

import { Photo } from '@/payload-types'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const PhotoMasonryGrid = ({photos}:{photos:Photo[]}) => {
  const pathname = usePathname()

  return (
    <div className='max-w-7xl mx-auto py-12 px-4'>
      <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'>
        {photos.map((photo) => (
          <Link 
            key={photo.id}
            href={`/photo/${photo.id}?from=${pathname}`}
            scroll={false}
            className='break-inside-avoid cursor-pointer group mb-4 block'
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
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PhotoMasonryGrid