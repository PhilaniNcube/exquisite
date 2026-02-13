'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createSchoolSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['creche', 'school']),
  pass_code: z.string().optional(),
})

export type CreateSchoolState = {
  errors?: {
    name?: string[]
    type?: string[]
    pass_code?: string[]
    _form?: string[]
  }
  message?: string
  success?: boolean
  schoolId?: number
}

export async function createSchool(
  prevState: CreateSchoolState,
  formData: FormData
): Promise<CreateSchoolState> {
  const validatedFields = createSchoolSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    pass_code: formData.get('pass_code') || undefined,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create School.',
      success: false,
    }
  }

  const { name, type, pass_code } = validatedFields.data

  try {
    const payload = await getPayload({ config })

    const school = await payload.create({
      collection: 'schools',
      data: {
        name,
        type,
        pass_code,
      },
    })

    revalidatePath('/dashboard/schools')

    return {
      success: true,
      message: 'School created successfully',
      schoolId: typeof school.id === 'number' ? school.id : Number(school.id),
    }
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Database Error: Failed to Create School.',
      success: false,
    }
  }
}
