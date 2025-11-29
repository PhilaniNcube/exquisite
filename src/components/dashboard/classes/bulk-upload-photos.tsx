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
import { createSchoolPhoto } from "@/lib/actions/photos"
import { uploadMedia } from "@/lib/actions/media"
import { Progress } from "@/components/ui/progress"

const formSchema = z.object({
  photoType: z.enum(["Individual", "Class", "Sports", "Group"]),
  files: z.any().refine((files) => files?.length > 0, "Files are required"),
})

export function BulkUploadPhotos({ classId, schoolId }: { classId: number, schoolId: number }) {
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState("")

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
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i]
      setCurrentFile(file.name)
      
      try {
        const formData = new FormData()
        const altText = file.name.replace(/\.[^/.]+$/, "") || "Untitled"
        formData.append("alt", altText)
        formData.append("file", file)

        // 1. Upload to Media collection
        const uploadRes = await uploadMedia(formData)

        if (!uploadRes.success || !uploadRes.doc) {
          throw new Error(`Failed to upload image: ${file.name}`)
        }

        const mediaId = uploadRes.doc.id

        // 2. Create School Photo entry
        const result = await createSchoolPhoto({
          name: file.name.split('.')[0], // Use filename without extension as name
          photoType: values.photoType,
          schoolId,
          classId,
          studentName: "", // Empty for bulk upload
          mediaId,
        })

        if (result.success) {
          successCount++
        } else {
          errorCount++
          console.error(`Failed to create photo entry for ${file.name}: ${result.message}`)
        }
      } catch (error) {
        console.error(error)
        errorCount++
      }

      setProgress(Math.round(((i + 1) / totalFiles) * 100))
    }

    setIsUploading(false)
    toast.success(`Upload complete. ${successCount} success, ${errorCount} failed.`)
    setOpen(false)
    form.reset()
    setProgress(0)
    setCurrentFile("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Files className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
                  <span>Uploading: {currentFile}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
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
