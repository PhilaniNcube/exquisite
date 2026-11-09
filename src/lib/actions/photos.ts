'use server'

import { getPayload } from "payload"
import config from "@payload-config"
import { revalidatePath, revalidateTag } from "next/cache"
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
        visibility: "public",
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

function relationshipId(
  value: number | { id: number } | null | undefined
): number | null {
  if (!value) return null
  return typeof value === "object" ? value.id : value
}

/**
 * Deletes a school photo from any dashboard view. Looks up the photo first so
 * every list that can show it (school, class, and global photo gallery) is
 * revalidated, regardless of which page triggered the delete.
 */
export async function deleteSchoolPhotoById(id: number) {
  try {
    const payload = await getPayload({ config })

    let schoolId: number | null = null
    let classId: number | null = null
    try {
      const photo = await payload.findByID({
        collection: "schoolPhotos",
        id,
        depth: 0,
      })
      schoolId = relationshipId(photo.schoolDetails?.school)
      classId = relationshipId(photo.schoolDetails?.class)
    } catch {
      // Photo may already be gone; still attempt the delete below.
    }

    await payload.delete({
      collection: "schoolPhotos",
      id,
    })

    revalidatePath("/dashboard/school-photos")
    revalidatePath("/dashboard")
    revalidateTag(`school-photo-${id}`, "max")

    if (schoolId) {
      revalidatePath(`/dashboard/schools/${schoolId}`)
      revalidatePath(`/schools/${schoolId}`)
    }

    if (classId) {
      revalidatePath(`/dashboard/classes/${classId}`)
    }

    // Product pages cache school-photo lists, so invalidate the product layout.
    revalidatePath("/products", "layout")

    return { success: true, message: "Photo deleted successfully" }
  } catch (error) {
    console.error("Failed to delete photo:", error)
    return { success: false, message: "Failed to delete photo" }
  }
}
