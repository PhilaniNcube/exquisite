'use client'

import { useTransition } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { deleteSchool } from "@/lib/actions/delete-school"
import { Route } from "next"

interface DeleteSchoolButtonProps {
  schoolId: number
  schoolName?: string
  redirectTo?: string
  variant?: "icon" | "button"
  className?: string
}

export function DeleteSchoolButton({
  schoolId,
  schoolName,
  redirectTo,
  variant = "icon",
  className,
}: DeleteSchoolButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSchool(schoolId)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)

      if (redirectTo) {
        router.push(redirectTo as Route)
        return
      }

      router.refresh()
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={variant === "icon" ? "ghost" : "destructive"}
          size={variant === "icon" ? "icon" : "default"}
          disabled={isPending}
          className={cn(
            variant === "icon"
              ? "h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              : "gap-2",
            className,
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {variant === "button" ? "Delete School" : <span className="sr-only">Delete school</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete school{schoolName ? ` "${schoolName}"` : ""}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Deleting this school will also permanently remove all
            classes and school photos associated with it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
