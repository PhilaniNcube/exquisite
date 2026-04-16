'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const editClassSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  schoolId: z.number(),
})

export type EditClassState = {
  errors?: {
    name?: string[]
    schoolId?: string[]
    _form?: string[]
  }
  message?: string
  success?: boolean
}

export async function editClass(
  prevState: EditClassState,
  formData: FormData
): Promise<EditClassState> {
  const validatedFields = editClassSchema.safeParse({
    id: Number(formData.get('id')),
    name: formData.get('name'),
    schoolId: Number(formData.get('schoolId')),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Class.',
      success: false,
    }
  }

  const { id, name, schoolId } = validatedFields.data

  try {
    const payload = await getPayload({ config })

    await payload.update({
      collection: 'classes',
      id,
      data: {
        name,
        school: schoolId,
      },
    })

    revalidatePath('/dashboard/classes')
    revalidatePath(`/dashboard/classes/${id}`)
    revalidatePath(`/dashboard/schools/${schoolId}`)

    return {
      success: true,
      message: 'Class updated successfully',
    }
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Database Error: Failed to Update Class.',
      success: false,
    }
  }
}
