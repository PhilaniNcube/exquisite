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
      files: Array<{ name: string; type: string; size: number }> 
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
        
        const key = `${sanitizedName}-${timestamp}-${randomString}.${ext}`

        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: file.type,
        })

        const presignedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600, // URL expires in 1 hour
        })

        return {
          originalName: file.name,
          key,
          presignedUrl,
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
