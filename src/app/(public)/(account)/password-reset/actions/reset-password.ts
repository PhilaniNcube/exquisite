"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { cookies } from "next/headers";

interface Response {
  success: boolean;
  error?: string;
  message?: string;
}

export async function resetPassword(
  _prevState: Response | null,
  formData: FormData
): Promise<Response> {
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const token = formData.get("token")?.toString();

  if (!password || !confirmPassword || !token) {
    return {
      success: false,
      error: "Missing required fields.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: "Passwords do not match.",
    };
  }

  const payload = await getPayload({ config });
  const cookieStore = await cookies();

  try {
    const result = await payload.resetPassword({
      collection: "customers",
      data: {
        password,
        token,
      },
      overrideAccess: true,
    });

    console.log("Password reset result:", result);

    // Clear any existing payload-token cookie
    cookieStore.delete("payload-token");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error resetting password. Please try again.",
    };
  }

  return {
    success: true,
    message: "Password reset successfully. You can now sign in.",
  };
}
