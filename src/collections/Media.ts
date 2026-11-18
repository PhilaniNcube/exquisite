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
    // Media files are uploaded once under a unique filename and never rewritten,
    // so they are safe to cache immutably. Without this the S3 static handler
    // falls back to Payload's `public, max-age=0, must-revalidate`, which makes
    // the CDN revalidate (and re-fetch from origin) on every single view.
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      return headers
    },
  },
}