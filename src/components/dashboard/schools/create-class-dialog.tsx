'use client'

import { useState, useEffect, useActionState, startTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus } from "lucide-react"
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
import { createClass, CreateClassState } from "@/lib/actions/classes"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

export function CreateClassDialog({ schoolId }: { schoolId: number }) {
  const [open, setOpen] = useState(false)
  const initialState: CreateClassState = { message: "", errors: {} }
  const [state, formAction, isPending] = useActionState(createClass, initialState)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (state.success) {
      toast.success(state.message)
      setOpen(false)
      form.reset()
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("schoolId", schoolId.toString())
    
    // Using startTransition is handled by useActionState's dispatch automatically if used in form action,
    // but here we are calling it manually. 
    // React 19 useActionState dispatch is wrapped in transition automatically? 
    // Actually, standard practice with RHF is to just call it.
    // However, since we are not using the form action prop directly, we need to be careful.
    // Let's just pass the formData to formAction.
    
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
          <DialogDescription>
            Add a new class to this school. Click save when you're done.
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
                    <Input placeholder="Class Name (e.g. Grade 1A)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
