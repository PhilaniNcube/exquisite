import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: undefined,
        formatOptions: { format: 'webp' },
      },
      {
        name: 'card',
        width: 768,
        height: undefined,
        formatOptions: { format: 'webp' },
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        formatOptions: { format: 'webp' },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}