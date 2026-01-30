"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { adminLogout } from "@/lib/actions/users"

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout()
    })
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  )
}
