import { headers as getHeaders } from "next/headers"
import { getPayload } from "payload"
import configPromise from "@payload-config"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AdminLogoutButton } from "./admin-logout-button"

export async function AdminAuthButtons() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden md:inline-block">
          {user.email}
        </span>
        <AdminLogoutButton />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/sys-admin/login">Login</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sys-admin/register">Register</Link>
      </Button>
    </div>
  )
}
