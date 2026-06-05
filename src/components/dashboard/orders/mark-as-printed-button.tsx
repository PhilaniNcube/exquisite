'use client'

import { useTransition } from "react"
import { Loader2, PackageCheck } from "lucide-react"
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
import { markOrderAsPrinted } from "@/lib/actions/orders"

interface MarkAsPrintedButtonProps {
  orderId: number
  variant?: "icon" | "button"
  className?: string
}

export function MarkAsPrintedButton({
  orderId,
  variant = "button",
  className,
}: MarkAsPrintedButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleMarkAsPrinted = () => {
    startTransition(async () => {
      const result = await markOrderAsPrinted(orderId)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.refresh()
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={variant === "icon" ? "ghost" : "default"}
          size={variant === "icon" ? "icon" : "default"}
          disabled={isPending}
          className={cn(
            variant === "icon"
              ? "h-8 w-8 p-0 text-muted-foreground hover:text-purple-600"
              : "gap-2 bg-purple-600 hover:bg-purple-700 text-white",
            className,
          )}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PackageCheck className="h-4 w-4" />
          )}
          {variant === "button" ? "Mark as Printed" : <span className="sr-only">Mark as printed</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark order as printed & delivered?</AlertDialogTitle>
          <AlertDialogDescription>
            This will update the order status to indicate that the photos/prints have been created and delivered to the customer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleMarkAsPrinted}
            disabled={isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isPending ? "Updating..." : "Mark as Printed"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
