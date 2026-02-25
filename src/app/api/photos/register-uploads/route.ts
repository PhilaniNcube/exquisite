import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      uploads: Array<{
        key: string
        originalName: string
        size: number
        type: string
        alt: string
        width: number
        height: number
        sizes: Record<string, {
          key: string
          width: number
          height: number
          filesize: number
        }>
      }>
      schoolId: number
      classId: number
      photoType: string
    }

    const { uploads, schoolId, classId, photoType } = body

    if (!uploads || uploads.length === 0) {
      return NextResponse.json(
        { error: 'No uploads provided' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''
    const results = []

    for (const upload of uploads) {
      try {
        // Build sizes metadata from client-generated thumbnails
        // Include url so Payload's static handler can serve them
        const sizesData: Record<string, {
          filename: string
          url: string
          width: number
          height: number
          mimeType: string
          filesize: number
        }> = {}

        for (const [sizeName, sizeInfo] of Object.entries(upload.sizes)) {
          sizesData[sizeName] = {
            filename: sizeInfo.key,
            url: `${serverURL}/api/media/file/${encodeURIComponent(sizeInfo.key)}`,
            width: sizeInfo.width,
            height: sizeInfo.height,
            mimeType: 'image/webp',
            filesize: sizeInfo.filesize,
          }
        }

        // Create media entry with metadata only — files already in R2.
        // No file download, no sharp processing, no re-upload.
        // We explicitly set url + filename so Payload's static handler can serve them.
        const media = await payload.create({
          collection: 'media',
          data: {
            alt: upload.alt,
            url: `${serverURL}/api/media/file/${encodeURIComponent(upload.key)}`,
            filename: upload.key,
            mimeType: upload.type,
            filesize: upload.size,
            width: upload.width,
            height: upload.height,
            sizes: sizesData,
          } as any, // upload fields are managed by PayloadCMS internally
        })

        // If payload.create didn't persist the url/filename fields (they're upload-managed),
        // update the record to explicitly set them.
        if (!media.url || !media.filename) {
          await payload.update({
            collection: 'media',
            id: media.id,
            data: {
              url: `${serverURL}/api/media/file/${encodeURIComponent(upload.key)}`,
              filename: upload.key,
              mimeType: upload.type,
              filesize: upload.size,
              width: upload.width,
              height: upload.height,
              sizes: sizesData,
            } as any,
          })
        }

        // Create SchoolPhoto entry
        const schoolPhoto = await payload.create({
          collection: 'schoolPhotos',
          data: {
            name: upload.alt,
            photoType: photoType as any,
            schoolDetails: {
              school: schoolId,
              class: classId,
            },
            studentName: '',
            photo: media.id,
          },
        })

        results.push({
          success: true,
          originalName: upload.originalName,
          mediaId: media.id,
          schoolPhotoId: schoolPhoto.id,
        })
      } catch (error) {
        console.error(`Error processing ${upload.originalName}:`, error)
        results.push({
          success: false,
          originalName: upload.originalName,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const errorCount = results.filter((r) => !r.success).length

    return NextResponse.json({
      results,
      summary: {
        total: uploads.length,
        success: successCount,
        failed: errorCount,
      },
    })
  } catch (error) {
    console.error('Error registering uploads:', error)
    return NextResponse.json(
      { error: 'Failed to register uploads' },
      { status: 500 },
    )
  }
}
