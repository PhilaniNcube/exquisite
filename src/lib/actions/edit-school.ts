'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const editSchoolSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['creche', 'school']),
  pass_code: z.string().optional(),
  order_deadline: z.string().optional().nullable(),
})

export type EditSchoolState = {
  errors?: {
    name?: string[]
    type?: string[]
    pass_code?: string[]
    order_deadline?: string[]
    _form?: string[]
  }
  message?: string
  success?: boolean
}

export async function editSchool(
  prevState: EditSchoolState,
  formData: FormData
): Promise<EditSchoolState> {
  const orderDeadlineValue = formData.get('order_deadline')
  const validatedFields = editSchoolSchema.safeParse({
    id: Number(formData.get('id')),
    name: formData.get('name'),
    type: formData.get('type'),
    pass_code: formData.get('pass_code') || undefined,
    order_deadline: orderDeadlineValue ? String(orderDeadlineValue) : null,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update School.',
      success: false,
    }
  }

  const { id, name, type, pass_code, order_deadline } = validatedFields.data

  try {
    const payload = await getPayload({ config })

    await payload.update({
      collection: 'schools',
      id,
      data: {
        name,
        type,
        pass_code,
        order_deadline: order_deadline || undefined,
      },
    })

    revalidatePath('/dashboard/schools')
    revalidatePath(`/dashboard/schools/${id}`)

    return {
      success: true,
      message: 'School updated successfully',
    }
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Database Error: Failed to Update School.',
      success: false,
    }
  }
}
