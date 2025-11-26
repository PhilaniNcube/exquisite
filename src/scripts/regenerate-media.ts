
import { getPayload } from 'payload'
import config from '../payload.config'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const regenerateMedia = async () => {
  console.log('Starting media regeneration...')
  console.log('NOTE: If your media URLs are relative (e.g. /api/media/...), ensure your local dev server is running (pnpm dev) so files can be fetched.')
  
  const payload = await getPayload({ config })

  const media = await payload.find({
    collection: 'media',
    limit: 1000,
  })

  console.log(`Found ${media.totalDocs} media items.`)

  for (const doc of media.docs) {
    if (!doc.mimeType?.startsWith('image/')) {
      console.log(`Skipping non-image: ${doc.filename}`)
      continue
    }

    console.log(`Processing: ${doc.filename}`)

    try {
      if (!doc.url) {
        console.error(`No URL for ${doc.filename}`)
        continue
      }

      let fileUrl = doc.url

      if (fileUrl.startsWith('/')) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        fileUrl = `${baseUrl}${fileUrl}`
        console.log(`Converted relative URL to: ${fileUrl}`)
      }

      const response = await fetch(fileUrl)
      if (!response.ok) {
        console.error(`Failed to fetch ${doc.url}: ${response.statusText}`)
        continue
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
            alt: doc.alt, // Keep existing data
        },
        file: {
            data: buffer,
            name: doc.filename!,
            mimetype: doc.mimeType!,
            size: buffer.length,
        },
      })

      console.log(`Regenerated: ${doc.filename}`)
    } catch (error) {
      console.error(`Error processing ${doc.filename}:`, error)
    }
  }

  console.log('Done!')
  process.exit(0)
}

regenerateMedia()
