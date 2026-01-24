import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import sharp from 'sharp'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_ACCESS_SECRET || '',
  },
  forcePathStyle: true,
})

async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on('data', (chunk: Buffer) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      uploads: Array<{
        key: string
        originalName: string
        size: number
        type: string
        alt: string
      }>
      schoolId: number
      classId: number
      photoType: string
    }

    const { uploads, schoolId, classId, photoType } = body

    if (!uploads || uploads.length === 0) {
      return NextResponse.json(
        { error: 'No uploads provided' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })
    const bucket = process.env.S3_BUCKET || ''
    const results = []

    // Process each upload
    for (const upload of uploads) {
      try {
        // Fetch the uploaded file from S3 to generate thumbnails
        const getCommand = new GetObjectCommand({
          Bucket: bucket,
          Key: upload.key,
        })

        const s3Response = await s3Client.send(getCommand)
        const buffer = await streamToBuffer(s3Response.Body)

        // Get image dimensions
        const metadata = await sharp(buffer).metadata()

        // Create media entry in PayloadCMS
        // Note: Since the file is already in S3, we create the database entry
        // PayloadCMS will generate thumbnails automatically via the S3 adapter
        const media = await payload.create({
          collection: 'media',
          data: {
            alt: upload.alt,
          },
          file: {
            data: buffer,
            name: upload.originalName,
            mimetype: upload.type,
            size: upload.size,
          },
        })

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
      { status: 500 }
    )
  }
}
