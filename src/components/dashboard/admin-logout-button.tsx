"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/actions/auth/logout"

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  console.log('[AdminLogoutButton] Component rendered, logoutAction type:', typeof logoutAction);

  const handleLogout = () => {
    console.log('[AdminLogoutButton] Button clicked, starting logout...');
    console.log('[AdminLogoutButton] logoutAction is:', logoutAction);
    
    startTransition(async () => {
      console.log('[AdminLogoutButton] Inside startTransition callback');
      try {
        console.log('[AdminLogoutButton] About to call logoutAction...');
        const result = await logoutAction()
        console.log('[AdminLogoutButton] logoutAction returned:', result);
        
        if (result.success) {
          console.log('[AdminLogoutButton] Logout successful, redirecting to login...');
          router.push('/sys-admin/login')
          router.refresh();
        } else {
          console.error('[AdminLogoutButton] Logout failed:', result.error);
        }
      } catch (error) {
        console.error('[AdminLogoutButton] Error caught in try-catch:', error)
        console.error('[AdminLogoutButton] Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined
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
