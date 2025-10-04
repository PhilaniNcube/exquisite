"use server";

import { getPayload } from "payload";
import config from "@payload-config";

interface LoginParams {
  email: string;
  password: string;
}

interface Response {
  success: boolean;
  error?: string;
}

export async function login({ email, password }: LoginParams): Promise<Response> {
  const payload = await getPayload({ config });

    try {
    await payload.login({
      collection: "users",
      data: {
        email,
        password,
      },
    });
  } catch (error) {
    console.error(error);
    return { success: false, error: "Invalid email or password" };
  }

  return { success: true };
}
