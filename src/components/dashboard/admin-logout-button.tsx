"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AdminLogoutButton() {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsPending(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      if (response.ok) {
        router.push('/sys-admin/login')
        router.refresh()
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsPending(false)
    }
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
