'use server'

import { getPayload } from "payload"
import config from "@payload-config"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createClassSchema = z.object({
  name: z.string().min(1, "Name is required"),
  schoolId: z.number(),
})

export type CreateClassState = {
  errors?: {
    name?: string[]
    schoolId?: string[]
    _form?: string[]
  }
  message?: string
  success?: boolean
}

export async function createClass(
  prevState: CreateClassState,
  formData: FormData
): Promise<CreateClassState> {
  const validatedFields = createClassSchema.safeParse({
    name: formData.get("name"),
    schoolId: Number(formData.get("schoolId")),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Class.",
      success: false,
    }
  }

  const { name, schoolId } = validatedFields.data

  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: "classes",
      data: {
        name,
        school: schoolId,
      },
    })

    revalidatePath(`/dashboard/schools/${schoolId}`)
    
    return {
      success: true,
      message: "Class created successfully",
    }
  } catch (error) {
    console.error("Database Error:", error)
    return {
      message: "Database Error: Failed to Create Class.",
      success: false,
    }
  }
}
