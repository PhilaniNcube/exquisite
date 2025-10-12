"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Route } from "next";

interface LoginParams {
  email: string;
  password: string;
  redirectTo?: string;
}

interface Response {
  success: boolean;
  error?: string;
}

export async function login({
  email,
  password,
  redirectTo,
}: LoginParams): Promise<Response> {
  const payload = await getPayload({ config });

  try {
    await payload.login({
      collection: "customers",
      data: {
        email,
        password,
      },
    });

    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error(error);
    revalidatePath("/", "layout");
    return { success: false, error: "Invalid email or password" };
  }

  redirect((redirectTo || "/") as Route);
}
