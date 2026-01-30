"use server";

import { getPayload } from "payload"
import config from "@payload-config"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function loginAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Missing email or password" }
  }

  const payload = await getPayload({ config })

  try {
    const { token, user, exp } = await payload.login({
      collection: "users",
      data: {
        email,
        password,
      },
    })

    if (!token) {
      return { error: "Authentication failed" }
    }

    // Check for admin role
    const roles = user.roles as string[] | undefined
    if (!roles || !roles.includes("admin")) {
      return { error: "Unauthorized: Admin access required" }
    }

    const cookieStore = await cookies()
    cookieStore.set("payload-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      expires: exp ? new Date(exp * 1000) : undefined,
    })

  } catch (error) {
    return { error: "Invalid email or password" }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function registerUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const adminSecret = formData.get("adminSecret") as string

  if (!email || !password || !firstName || !lastName) {
    return { error: "Missing required fields" }
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  const payload = await getPayload({ config })

  try {
    // Check if user exists
    const existingUsers = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingUsers.totalDocs > 0) {
      return { error: "User already exists" }
    }

    const roles: ("user" | "admin" | "editor")[] = ["user"]
    if (adminSecret && adminSecret === process.env.ADMIN_REGISTRATION_SECRET) {
      roles.push("admin")
    }

    await payload.create({
      collection: "users",
      data: {
        email,
        password,
        firstName,
        lastName,
        roles,
      },
    })

    try {
      await payload.sendEmail({
        to: email,
        subject: "Welcome to Exquisite Photography",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to Exquisite Photography!</h1>
                </div>
                <div class="content">
                  <p>Hi ${firstName},</p>
                  <p>Thank you for creating an account with us. We're excited to have you on board.</p>
                  <p>You can now log in to your account to view your photos and manage your orders.</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Exquisite Photography. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Continue execution even if email fails, as user is created
    }

    return { success: "Account created successfully" }

  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to create account" }
  }
}

export async function logout() {
  "use server"
  const cookieStore = await cookies()
  cookieStore.delete("payload-token")
  redirect("/sys-admin/login")
}

export async function adminLogout() {
  "use server"
  const cookieStore = await cookies()
  cookieStore.delete("payload-token")
  revalidatePath("/", "layout")
  redirect("/sys-admin/login")
}

export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Missing email" }
  }

  const payload = await getPayload({ config })

  try {
    await payload.forgotPassword({
      collection: "users",
      data: {
        email,
      },
      disableEmail: false,
    })
    return { success: "If an account with that email exists, a reset link has been sent." }
  } catch (error) {
    console.error("Forgot password error:", error)
    return { error: "Failed to send reset email" }
  }
}

export async function resetPassword(prevState: any, formData: FormData) {
  const token = formData.get("token") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!token || !password || !confirmPassword) {
    return { error: "Missing required fields" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  const payload = await getPayload({ config })

  try {
    await payload.resetPassword({
      collection: "users",
      data: {
        token,
        password,
      },
      overrideAccess: true,
    })
    return { success: "Password reset successfully" }
  } catch (error) {
    console.error("Reset password error:", error)
    return { error: "Failed to reset password" }
  }
}

