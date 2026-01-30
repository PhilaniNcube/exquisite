"use client"

import { useActionState, Suspense, useEffect, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { loginAdmin } from "@/lib/actions/users"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? "Signing in..." : "Sign in"}
    </Button>
  )
}

function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [state, formAction] = useActionState(loginAdmin, null)

  useEffect(() => {
    if (state?.success) {
      startTransition(() => {
        router.push("/dashboard")
      })
    }
  }, [state, router])

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <SubmitButton isPending={isPending} />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="text-sm text-center text-muted-foreground">
          <Link href="/sys-admin/forgot-password" className="underline">
            Forgot your password?
          </Link>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sys-admin/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm mx-auto p-4 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
