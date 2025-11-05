"use client"

import { Photo } from '@/payload-types'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const PhotoMasonryGrid = ({photos}:{photos:Photo[]}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (index: number) => {
    setSelectedPhotoIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedPhotoIndex(null)
  }, [])

  const goToNext = useCallback(() => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1)
    }
  }, [selectedPhotoIndex, photos.length])

  const goToPrevious = useCallback(() => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1)
    }
  }, [selectedPhotoIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen || selectedPhotoIndex === null) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, selectedPhotoIndex, goToNext, goToPrevious, closeModal])

  const canGoNext = selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1
  const canGoPrevious = selectedPhotoIndex !== null && selectedPhotoIndex > 0
  const currentPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null

  return (
    <>
      <div className='container mx-auto py-12 px-4'>
        <div className='columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openModal(index)}
              className='break-inside-avoid cursor-pointer group mb-4 block'
            >
              <div className='relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300'>
                {typeof photo.image === 'object' && photo.image?.url && (
                  <Image
                    src={photo.image.url}
                    alt={photo.image.alt || photo.title || 'Photo'}
                    width={(photo.image.width ?? 4000)/15}
                    height={(photo.image.height ?? 6000)/15}
                    quality={100}
                    className='w-full h-auto group-hover:scale-105 transition-transform duration-300'
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-none bg-black/95">
          <DialogTitle className="sr-only">
            {/* {currentPhoto?.title || 'Photo Gallery'} */}
          </DialogTitle>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 h-10 w-10"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>

            {/* Previous button */}
            <Button
              variant="ghost"
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
              variant="ghost"
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
            {currentPhoto && typeof currentPhoto.image === 'object' && currentPhoto.image?.url && (
              <div className="relative w-full h-full flex items-center justify-center p-12">
                <Image
                  src={currentPhoto.image.url}
                  alt={currentPhoto.image.alt || currentPhoto.title || 'Photo'}
                  width={currentPhoto.image.width || 800}
                  height={currentPhoto.image.height || 600}
                  className="max-w-full max-h-full object-contain"
                  priority
                />
              </div>
            )}

            {/* Photo counter */}
            {selectedPhotoIndex !== null && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedPhotoIndex + 1} of {photos.length}
              </div>
            )}

            {/* Photo title (if available) */}
            {currentPhoto?.title && (
              <div className="absolute top-16 left-4 right-4 text-center">
                <h2 className="text-white text-lg font-medium truncate">
                  {currentPhoto.title}
                </h2>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PhotoMasonryGrid