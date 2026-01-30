"use server";

import { login } from '@payloadcms/next/auth'
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
  try {
    await login({
      collection: "customers",
      config,
      email,
      password,
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
