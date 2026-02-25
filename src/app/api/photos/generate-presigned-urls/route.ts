import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_ACCESS_SECRET || '',
  },
  forcePathStyle: true,
})

export async function POST(request: NextRequest) {
  try {
    const { files } = await request.json() as { 
      files: Array<{ name: string; type: string; size: number; sizeNames?: string[] }> 
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Limit to 200 files per request
    if (files.length > 200) {
      return NextResponse.json(
        { error: 'Maximum 200 files per batch' },
        { status: 400 }
      )
    }

    const bucket = process.env.S3_BUCKET || ''
    const presignedUrls = await Promise.all(
      files.map(async (file) => {
        // Generate a unique filename to avoid collisions
        const timestamp = Date.now()
        const randomString = crypto.randomBytes(8).toString('hex')
        const ext = file.name.split('.').pop()
        const sanitizedName = file.name
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars
          .toLowerCase()
        
        const baseName = `${sanitizedName}-${timestamp}-${randomString}`
        const key = `${baseName}.${ext}`

        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: file.type,
        })

        const presignedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600, // URL expires in 1 hour
        })

        // Generate presigned URLs for image size variants (client-generated thumbnails)
        const sizes: Record<string, { key: string; presignedUrl: string }> = {}
        if (file.sizeNames && file.sizeNames.length > 0) {
          await Promise.all(
            file.sizeNames.map(async (sizeName) => {
              const sizeKey = `${baseName}-${sizeName}.webp`
              const sizeCommand = new PutObjectCommand({
                Bucket: bucket,
                Key: sizeKey,
                ContentType: 'image/webp',
              })
              const sizePresignedUrl = await getSignedUrl(s3Client, sizeCommand, {
                expiresIn: 3600,
              })
              sizes[sizeName] = { key: sizeKey, presignedUrl: sizePresignedUrl }
            }),
          )
        }

        return {
          originalName: file.name,
          key,
          presignedUrl,
          sizes,
        }
      })
    )

    return NextResponse.json({ presignedUrls })
  } catch (error) {
    console.error('Error generating presigned URLs:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URLs' },
      { status: 500 }
    )
  }
}
