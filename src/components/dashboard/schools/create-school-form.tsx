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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createSchool, type CreateSchoolState } from '@/lib/actions/schools'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['creche', 'school']),
  pass_code: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const initialState: CreateSchoolState = {
  message: '',
  errors: {},
  success: false,
}

export function CreateSchoolForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createSchool, initialState)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'school',
      pass_code: '',
    },
  })

  useEffect(() => {
    if (state.errors?.name?.[0]) {
      form.setError('name', { message: state.errors.name[0] })
    }

    if (state.errors?.type?.[0]) {
      form.setError('type', { message: state.errors.type[0] })
    }

    if (state.errors?.pass_code?.[0]) {
      form.setError('pass_code', { message: state.errors.pass_code[0] })
    }

    if (state.success && state.schoolId) {
      toast.success(state.message || 'School created successfully')
      router.push(`/dashboard/schools/${state.schoolId}`)
      router.refresh()
      return
    }

    if (!state.success && state.message) {
      toast.error(state.message)
    }
  }, [state, form, router])

  function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('type', values.type)
    formData.append('pass_code', values.pass_code || '')

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
                <Input placeholder="Enter school name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="creche">Creche</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pass_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pass Code (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Leave blank to auto-generate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create School'}
        </Button>
      </form>
    </Form>
  )
}
