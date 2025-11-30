"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { forgotPassword } from "@/lib/actions/users"
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

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Sending link..." : "Send Reset Link"}
    </Button>
  )
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPassword, null)

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
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
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-green-500">{state.success}</p>
          )}
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center text-muted-foreground w-full">
          Remember your password?{" "}
          <Link href="/sys-admin/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
