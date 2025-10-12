"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface LoginParams {
  email: string;
  password: string;
}

interface Response {
  success: boolean;
  error?: string;
}

export async function loginUser({
  email,
  password,
}: LoginParams): Promise<Response> {
  const payload = await getPayload({ config });

  try {
    const result = await payload.login({
      collection: "customers",
      data: {
        email,
        password,
      },
      // req: req, // optional, pass a Request object to be provided to all hooks
      depth: 2,
      locale: "en",
      overrideAccess: false,
      showHiddenFields: true,
    });

    if (result.token) {
      const cookieStore = await cookies();
      cookieStore.set("payload-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      revalidatePath("/", "layout");
      return { success: true };
    } else {
      revalidatePath("/", "layout");
      return { success: false, error: "Invalid email or password." };
    }
  } catch (error) {
    console.error(error);
    revalidatePath("/", "layout");
    return {
      success: false,
      error: "An error occurred during login. Please try again.",
    };
  }
}
