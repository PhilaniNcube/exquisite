'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, Loader2 } from "lucide-react"
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

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  photoType: z.enum(["Individual", "Class", "Sports", "Group"]),
  studentName: z.string().optional(),
  file: z.any().refine((files) => files && files.length > 0, "File is required"),
})

export function UploadPhotoDialog({ classId, schoolId }: { classId: number, schoolId: number }) {
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      photoType: "Individual",
      studentName: "",
    },
  })

  const fileRef = form.register("file")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true)
    try {
      const file = values.file[0]
      const formData = new FormData()
      formData.append("file", file)
      formData.append("alt", values.name)

      // 1. Upload to Media collection
      const uploadRes = await fetch("/api/media", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image")
      }

      const mediaData = await uploadRes.json()
      const mediaId = mediaData.doc.id

      // 2. Create School Photo entry
      const result = await createSchoolPhoto({
        name: values.name,
        photoType: values.photoType,
        schoolId,
        classId,
        studentName: values.studentName,
        mediaId,
      })

      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        form.reset()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
          <DialogDescription>
            Upload a new photo for this class.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Photo Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photoType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
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
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Student Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
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
            <DialogFooter>
              <Button type="submit" disabled={isUploading}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
