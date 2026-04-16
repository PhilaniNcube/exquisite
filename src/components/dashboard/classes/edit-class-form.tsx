'use client'

import { useActionState, useEffect, startTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { editClass, type EditClassState } from '@/lib/actions/edit-class'
import type { Class, School } from '@/payload-types'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

type FormValues = z.infer<typeof formSchema>

const initialState: EditClassState = {
  message: '',
  errors: {},
  success: false,
}

export function EditClassForm({ cls }: { cls: Class }) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(editClass, initialState)

  const schoolId = typeof cls.school === 'object' ? (cls.school as School).id : cls.school

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cls.name,
    },
  })

  useEffect(() => {
    if (state.errors?.name?.[0]) {
      form.setError('name', { message: state.errors.name[0] })
    }

    if (state.success) {
      toast.success(state.message || 'Class updated successfully')
      router.push(`/dashboard/classes/${cls.id}`)
      router.refresh()
      return
    }

    if (!state.success && state.message) {
      toast.error(state.message)
    }
  }, [state, form, router, cls.id])

  function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.append('id', cls.id.toString())
    formData.append('name', values.name)
    formData.append('schoolId', schoolId.toString())

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter class name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/classes/${cls.id}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
