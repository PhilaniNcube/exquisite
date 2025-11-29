'use server'

import { getPayload } from "payload"
import config from "@payload-config"

export async function uploadMedia(formData: FormData) {
  const file = formData.get('file') as File
  const alt = formData.get('alt') as string

  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  try {
    const payload = await getPayload({ config })
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const media = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      file: {
        data: buffer,
        name: file.name,
        mimetype: file.type,
        size: file.size,
      },
    })

    return { success: true, doc: media }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Failed to upload media' }
  }
}
