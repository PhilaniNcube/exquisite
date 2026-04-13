"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { cookies } from "next/headers";

interface Response {
  success: boolean;
  error?: string;
  message?: string;
}

export async function forgotPassword(
  _prevState: Response | null,
  formData: FormData
): Promise<Response> {
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    return {
      success: false,
      error: "Please enter the email address for your account.",
    };
  }

  const payload = await getPayload({ config });
  const cookieStore = await cookies();

  try {
    await payload.forgotPassword({
      collection: "customers",
      data: {
        email,
      },
    });

    // Clear any existing payload-token cookie
    cookieStore.delete("payload-token");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error requesting password reset. Please try again.",
    };
  }

  return {
    success: true,
    message:
      "If an account with that email exists, a reset link has been sent.",
  };
}
