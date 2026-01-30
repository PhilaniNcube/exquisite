"use server";

import { getPayload } from "payload";
import config from "@payload-config";
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
    await payload.login({
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

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.log("Login error:", error);
    console.error(error);
    revalidatePath("/", "layout");

    return {
      success: false,
      error: "An error occurred during login. Please try again.",
    };
  }
}
