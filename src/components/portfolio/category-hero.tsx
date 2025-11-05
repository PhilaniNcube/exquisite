import Image from 'next/image'
import React from 'react'
import { Category, Media } from '@/payload-types'

type Props = {
  category: Category
}

const CategoryHero = ({ category }: Props) => {
  const media: Media | null = typeof category.image === 'object' && category.image ? (category.image as Media) : null

  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="20%" />
          <stop stop-color="#edeef1" offset="50%" />
          <stop stop-color="#f6f7f8" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f6f7f8" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `

  const toBase64 = (str: string) =>
    typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

  const blur = `data:image/svg+xml;base64,${toBase64(
    shimmer(media?.width || 1200, media?.height || 600)
  )}`

  return (
    <section className="relative w-full h-[55vh] max-h-[70vh] overflow-hidden">
      {media?.url && (
        <Image
          src={media.url}
          alt={media.alt || category.name}
          fill
          priority
          quality={80}
          className="object-cover object-center"
          placeholder="blur"
          blurDataURL={blur}
        />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{category.name}</h1>
            {category.description && (
              <p className="mt-4 text-base sm:text-lg text-white/90">{category.description}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoryHero
