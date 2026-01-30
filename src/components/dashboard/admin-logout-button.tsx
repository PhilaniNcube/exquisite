"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/app/(public)/(account)/logout/logoutAction"

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
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
