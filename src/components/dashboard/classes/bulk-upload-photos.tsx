'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, Loader2, Files } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { runWithConcurrency } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
  photoType: z.enum(["Individual", "Class", "Sports", "Group"]),
  files: z.any().refine((files) => files?.length > 0, "Files are required"),
})

const BATCH_SIZE = 5 // Upload 5 files concurrently (each file = original + up to 3 thumbnails)

// Image sizes to generate client-side (must match PayloadCMS Media collection imageSizes)
const IMAGE_SIZES = [
  { name: 'thumbnail', width: 400 },
  { name: 'card', width: 768 },
  { name: 'tablet', width: 1024 },
] as const

interface ProcessedImage {
  file: File
  width: number
  height: number
  thumbnails: Array<{
    name: string
    width: number
    height: number
    blob: Blob
  }>
}

interface PresignedUrlData {
  originalName: string
  key: string
  presignedUrl: string
  sizes: Record<string, { key: string; presignedUrl: string }>
}

/**
 * Process an image in the browser: extract dimensions and generate
 * resized WebP thumbnails using the Canvas API.
 */
async function processImage(file: File): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = async () => {
      try {
        const origWidth = img.width
        const origHeight = img.height
        const thumbnails: ProcessedImage['thumbnails'] = []

        for (const size of IMAGE_SIZES) {
          if (size.width >= origWidth) continue // Don't upscale

          const scale = size.width / origWidth
          const targetHeight = Math.round(origHeight * scale)

          const canvas = document.createElement('canvas')
          canvas.width = size.width
          canvas.height = targetHeight

          const ctx = canvas.getContext('2d')
          if (!ctx) continue

          ctx.drawImage(img, 0, 0, size.width, targetHeight)

          const blob = await new Promise<Blob>((res, rej) => {
            canvas.toBlob(
              (b) => (b ? res(b) : rej(new Error(`Failed to generate ${size.name}`))),
              'image/webp',
              0.8,
            )
          })

          thumbnails.push({ name: size.name, width: size.width, height: targetHeight, blob })
        }

        URL.revokeObjectURL(img.src)
        resolve({ file, width: origWidth, height: origHeight, thumbnails })
      } catch (error) {
        URL.revokeObjectURL(img.src)
        reject(error)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error(`Failed to load image: ${file.name}`))
    }
    img.src = URL.createObjectURL(file)
  })
}

async function uploadToR2(
  data: Blob | File,
  presignedUrl: string,
  contentType: string,
): Promise<boolean> {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: data,
      headers: { 'Content-Type': contentType },
    })
    return response.ok
  } catch (error) {
    console.error('Upload failed:', error)
    return false
  }
}

export function BulkUploadPhotos({ classId, schoolId }: { classId: number, schoolId: number }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState("")
  const [uploadStats, setUploadStats] = useState({ completed: 0, total: 0, failed: 0 })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoType: "Individual",
    },
  })

  const fileRef = form.register("files")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true)
    setProgress(0)
    const files = Array.from(values.files as FileList)
    const totalFiles = files.length
    setUploadStats({ completed: 0, total: totalFiles, failed: 0 })

    try {
      // Step 1: Process images client-side (extract dimensions + generate thumbnails)
      setCurrentFile("Processing images...")
      let processedCount = 0
      const processedImages = await runWithConcurrency(files, 3, async (file) => {
        try {
          const res = await processImage(file)
          processedCount++
          setCurrentFile(`Processed ${processedCount} of ${totalFiles} images...`)
          setProgress(Math.round((processedCount / totalFiles) * 20))
          return res
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error)
          processedCount++
          setCurrentFile(`Processed ${processedCount} of ${totalFiles} images...`)
          setProgress(Math.round((processedCount / totalFiles) * 20))
          return { file, width: 0, height: 0, thumbnails: [] }
        }
      })

      // Step 2: Get presigned URLs for originals + thumbnails
      setCurrentFile("Preparing uploads...")
      const fileMetadata = processedImages.map((img) => ({
        name: img.file.name,
        type: img.file.type,
        size: img.file.size,
        sizeNames: img.thumbnails.map((t) => t.name),
      }))

      const presignedResponse = await fetch('/api/photos/generate-presigned-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: fileMetadata }),
      })

      if (!presignedResponse.ok) {
        throw new Error('Failed to generate presigned URLs')
      }

      const { presignedUrls } = await presignedResponse.json() as {
        presignedUrls: PresignedUrlData[]
      }

      // Step 3: Upload originals + thumbnails to R2 concurrently using sliding window
      const successfulUploads: Array<{
        key: string
        originalName: string
        size: number
        type: string
        alt: string
        width: number
        height: number
        sizes: Record<string, { key: string; width: number; height: number; filesize: number }>
      }> = []
      let failedCount = 0
      let completedUploads = 0

      await runWithConcurrency(processedImages, 5, async (processed, j) => {
        const urlData = presignedUrls[j]
        setCurrentFile(`Uploading ${processed.file.name}...`)

        try {
          const originalUpload = uploadToR2(processed.file, urlData.presignedUrl, processed.file.type)
          const thumbnailUploads = processed.thumbnails.map((thumb) => {
            const sizeUrl = urlData.sizes[thumb.name]
            if (!sizeUrl) return Promise.resolve(true)
            return uploadToR2(thumb.blob, sizeUrl.presignedUrl, 'image/webp')
          })

          const results = await Promise.all([originalUpload, ...thumbnailUploads])
          const success = results.every(Boolean)

          if (success) {
            const sizes: Record<string, { key: string; width: number; height: number; filesize: number }> = {}
            processed.thumbnails.forEach((thumb) => {
              const sizeUrl = urlData.sizes[thumb.name]
              if (sizeUrl) {
                sizes[thumb.name] = {
                  key: sizeUrl.key,
                  width: thumb.width,
                  height: thumb.height,
                  filesize: thumb.blob.size,
                }
              }
            })

            successfulUploads.push({
              key: urlData.key,
              originalName: processed.file.name,
              size: processed.file.size,
              type: processed.file.type,
              alt: processed.file.name.replace(/\.[^/.]+$/, "") || "Untitled",
              width: processed.width,
              height: processed.height,
              sizes,
            })
          } else {
            failedCount++
          }
        } catch (error) {
          console.error(`Failed to upload ${processed.file.name}:`, error)
          failedCount++
        }

        completedUploads++
        setUploadStats({ completed: completedUploads, total: totalFiles, failed: failedCount })
        setProgress(20 + Math.round((completedUploads / totalFiles) * 60))
      })

      // Step 4: Register uploaded files in database (batches of 20)
      if (successfulUploads.length > 0) {
        setCurrentFile("Registering uploads in database...")
        const REGISTER_BATCH_SIZE = 20
        let registeredCount = 0

        for (let i = 0; i < successfulUploads.length; i += REGISTER_BATCH_SIZE) {
          const batch = successfulUploads.slice(i, i + REGISTER_BATCH_SIZE)

          const registerResponse = await fetch('/api/photos/register-uploads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uploads: batch,
              schoolId,
              classId,
              photoType: values.photoType,
            }),
          })

          if (!registerResponse.ok) {
            console.error('Failed to register batch:', await registerResponse.text())
            toast.error(`Failed to register batch ${Math.floor(i / REGISTER_BATCH_SIZE) + 1}`)
          } else {
            registeredCount += batch.length
            setCurrentFile(`Registered ${registeredCount} of ${successfulUploads.length} photos...`)
          }

          setProgress(80 + Math.round(((i + REGISTER_BATCH_SIZE) / successfulUploads.length) * 20)) // 80-100%
        }

        if (registeredCount > 0) {
          toast.success(`Successfully registered ${registeredCount} photos in database`)
        }
      }

      setIsUploading(false)
      toast.success(
        `Upload complete! ${successfulUploads.length} successful, ${failedCount} failed.`,
      )

      // Refresh the page data first so new photos are visible, then close dialog
      router.refresh()

      // Small delay to let the refresh start before closing the dialog
      await new Promise((resolve) => setTimeout(resolve, 500))

      setOpen(false)
      form.reset()
      setProgress(0)
      setCurrentFile("")
      setUploadStats({ completed: 0, total: 0, failed: 0 })
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.')
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Files className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Bulk Upload Photos</DialogTitle>
          <DialogDescription>
            Upload multiple photos at once. Filenames will be used as photo names.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="photoType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Class">Class</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photos</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      multiple
                      {...fileRef} 
                      onChange={(e) => {
                        field.onChange(e.target.files)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {currentFile || `Processing ${uploadStats.completed} of ${uploadStats.total}`}
                  </span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
                {uploadStats.total > 0 && (
                  <div className="text-xs text-muted-foreground text-center">
                    Completed: {uploadStats.completed - uploadStats.failed} | Failed: {uploadStats.failed}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isUploading}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Uploading..." : "Start Upload"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
