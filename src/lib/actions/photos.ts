'use server'

import { getPayload } from "payload"
import config from "@payload-config"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createPhotoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  photoType: z.enum(["Individual", "Class", "Sports", "Group"]),
  schoolId: z.number(),
  classId: z.number(),
  studentName: z.string().optional(),
  mediaId: z.number(),
})

type CreatePhotoState = {
  errors?: {
    name?: string[]
    photoType?: string[]
    studentName?: string[]
    _form?: string[]
  }
  message?: string
  success?: boolean
}

export async function createSchoolPhoto(
  data: z.infer<typeof createPhotoSchema>
): Promise<CreatePhotoState> {
  const validatedFields = createPhotoSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Photo.",
      success: false,
    }
  }

  const { name, photoType, schoolId, classId, studentName, mediaId } = validatedFields.data

  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: "schoolPhotos",
      data: {
        name,
        photoType,
        schoolDetails: {
          school: schoolId,
          class: classId,
        },
        studentName,
        photo: mediaId,
      },
    })

    revalidatePath(`/dashboard/classes/${classId}`)
    
    return {
      success: true,
      message: "Photo created successfully",
    }
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: "Database Error: Failed to Create Photo.",
      success: false,
    }
  }
}

export async function deleteSchoolPhoto(id: number, classId: number) {
  try {
    const payload = await getPayload({ config })
    await payload.delete({
      collection: "schoolPhotos",
      id,
    })
    revalidatePath(`/dashboard/classes/${classId}`)
    return { success: true, message: "Photo deleted successfully" }
  } catch (error) {
    console.error("Failed to delete photo:", error)
    return { success: false, message: "Failed to delete photo" }
  }
}
