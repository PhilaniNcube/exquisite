"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/app/(public)/(account)/logout/logoutAction"

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleLogout = () => {
    console.log('[AdminLogoutButton] Button clicked, starting logout...');
    startTransition(async () => {
      console.log('[AdminLogoutButton] Transition started');
      try {
        console.log('[AdminLogoutButton] Calling logoutAction...');
        await logoutAction()
        console.log('[AdminLogoutButton] logoutAction completed, redirecting to login...');
        // The logoutAction already handles redirect, but we'll push just in case
        router.push('/sys-admin/login')
        console.log('[AdminLogoutButton] Router push executed');
      } catch (error) {
        console.error('[AdminLogoutButton] Error caught:', error)
        console.error('[AdminLogoutButton] Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
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
