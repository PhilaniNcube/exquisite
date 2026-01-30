'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, Loader2, Files } from "lucide-react"
import { toast } from "sonner"

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

const BATCH_SIZE = 10 // Upload 10 files concurrently

export function BulkUploadPhotos({ classId, schoolId }: { classId: number, schoolId: number }) {
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

  async function uploadToS3(file: File, presignedUrl: string): Promise<boolean> {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })
      return response.ok
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error)
      return false
    }
  }

  async function processBatch(
    files: File[],
    presignedUrls: Array<{ originalName: string; key: string; presignedUrl: string }>,
    startIndex: number
  ) {
    const batchFiles = files.slice(startIndex, startIndex + BATCH_SIZE)
    const batchUrls = presignedUrls.slice(startIndex, startIndex + BATCH_SIZE)

    // Upload all files in this batch concurrently to S3
    const uploadPromises = batchFiles.map((file, index) => {
      const urlData = batchUrls[index]
      setCurrentFile(file.name)
      return uploadToS3(file, urlData.presignedUrl).then((success) => ({
        success,
        file,
        urlData,
      }))
    })

    return await Promise.allSettled(uploadPromises)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true)
    setProgress(0)
    const files = Array.from(values.files as FileList)
    const totalFiles = files.length
    setUploadStats({ completed: 0, total: totalFiles, failed: 0 })

    try {
      // Step 1: Get presigned URLs for all files
      setCurrentFile("Preparing uploads...")
      const fileMetadata = files.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
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
        presignedUrls: Array<{ originalName: string; key: string; presignedUrl: string }>
      }

      // Step 2: Upload files to S3 in batches
      const successfulUploads: Array<{
        key: string
        originalName: string
        size: number
        type: string
        alt: string
      }> = []
      let failedCount = 0

      for (let i = 0; i < totalFiles; i += BATCH_SIZE) {
        const batchResults = await processBatch(files, presignedUrls, i)

        batchResults.forEach((result, batchIndex) => {
          const fileIndex = i + batchIndex
          if (result.status === 'fulfilled' && result.value.success) {
            const file = result.value.file
            const urlData = result.value.urlData
            successfulUploads.push({
              key: urlData.key,
              originalName: file.name,
              size: file.size,
              type: file.type,
              alt: file.name.replace(/\.[^/.]+$/, "") || "Untitled",
            })
          } else {
            failedCount++
          }
          
          setUploadStats((prev) => ({
            ...prev,
            completed: fileIndex + 1,
            failed: failedCount,
          }))
          setProgress(Math.round(((fileIndex + 1) / totalFiles) * 100))
        })
      }

      // Step 3: Register uploaded files in database (batches of 20)
      if (successfulUploads.length > 0) {
        setCurrentFile("Registering uploads in database...")
        const REGISTER_BATCH_SIZE = 20
        
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
          }
        }
      }

      setIsUploading(false)
      toast.success(
        `Upload complete! ${successfulUploads.length} successful, ${failedCount} failed.`
      )
      setOpen(false)
      form.reset()
      setProgress(0)
      setCurrentFile("")
      setUploadStats({ completed: 0, total: 0, failed: 0 })
      
      // Refresh the page to show new photos
      // window.location.reload()
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
